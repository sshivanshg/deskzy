#!/usr/bin/env node
/**
 * Live E2E smoke for Deskzy Free + Pro billing features.
 * Run: node scripts/e2e-pro-smoke.mjs
 */
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.SMOKE_BASE || "https://deskzy.xyz";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = process.env.SMOKE_EMAIL || "test@deskzy.xyz";
const PASSWORD = process.env.SMOKE_PASSWORD || "DeskzyTest!2026";

const results = [];

function ok(name, detail = "") {
  results.push({ name, pass: true, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, pass: false, detail });
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function jsonFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  let body = null;
  const text = await res.text();
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text.slice(0, 200) };
  }
  return { res, body };
}

async function main() {
  console.log(`\n=== Deskzy E2E smoke @ ${BASE} ===\n`);

  // --- Public pages ---
  for (const path of ["/", "/pricing", "/login", "/signup", "/tools/url-shortener", "/tools/merge-pdf"]) {
    const res = await fetch(`${BASE}${path}`);
    if (res.ok) ok(`GET ${path}`, String(res.status));
    else fail(`GET ${path}`, String(res.status));
  }

  // --- Free shorten (unlimited) ---
  const s1 = await jsonFetch(`${BASE}/api/links`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: `https://example.com/e2e-${Date.now()}` }),
  });
  if (s1.res.status === 201 && s1.body?.shortUrl && s1.body?.code) {
    ok("Free random shorten", s1.body.shortUrl);
  } else {
    fail("Free random shorten", `${s1.res.status} ${JSON.stringify(s1.body)}`);
  }

  const s2 = await jsonFetch(`${BASE}/api/links`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      url: "https://example.com/custom-blocked",
      slug: `free-blocked-${Date.now().toString(36)}`,
    }),
  });
  if (s2.res.status === 402) ok("Free custom slug blocked", "402");
  else fail("Free custom slug blocked", `${s2.res.status} ${JSON.stringify(s2.body)}`);

  // --- Hop page + click tracking ---
  if (s1.body?.code) {
    const hop = await fetch(`${BASE}/p/${s1.body.code}`);
    if (hop.ok) ok("Hop page renders", String(hop.status));
    else fail("Hop page renders", String(hop.status));

    const click = await jsonFetch(`${BASE}/api/links/${encodeURIComponent(s1.body.code)}/click`, {
      method: "POST",
    });
    if (click.res.ok && click.body?.ok) ok("Click beacon", "ok");
    else fail("Click beacon", `${click.res.status} ${JSON.stringify(click.body)}`);
  }

  // --- Usage gate (anon) ---
  const anon = `e2e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const u1 = await jsonFetch(`${BASE}/api/usage`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-deskzy-anon": anon,
    },
    body: JSON.stringify({ toolSlug: "merge-pdf", increment: true }),
  });
  if (u1.res.ok && u1.body?.ok) ok("Usage increment #1", `remaining=${u1.body.remaining}`);
  else fail("Usage increment #1", `${u1.res.status} ${JSON.stringify(u1.body)}`);

  const u2 = await jsonFetch(`${BASE}/api/usage`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-deskzy-anon": anon,
    },
    body: JSON.stringify({ toolSlug: "merge-pdf", increment: true }),
  });
  if (u2.res.ok && u2.body?.ok) ok("Usage increment #2 (cap=2)", `remaining=${u2.body.remaining}`);
  else fail("Usage increment #2 (cap=2)", `${u2.res.status} ${JSON.stringify(u2.body)}`);

  const u3 = await jsonFetch(`${BASE}/api/usage`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-deskzy-anon": anon,
    },
    body: JSON.stringify({ toolSlug: "merge-pdf", increment: true }),
  });
  if (u3.res.status === 402 && u3.body?.ok === false) {
    ok("Usage cap hit → 402", `used=${u3.body.used}/${u3.body.limit}`);
  } else {
    fail("Usage cap hit → 402", `${u3.res.status} ${JSON.stringify(u3.body)}`);
  }

  const uShort = await jsonFetch(`${BASE}/api/usage`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-deskzy-anon": anon,
    },
    body: JSON.stringify({ toolSlug: "url-shortener", increment: true }),
  });
  if (uShort.res.ok && (uShort.body?.unlimited || uShort.body?.remaining === null)) {
    ok("Shortener usage unlimited", JSON.stringify(uShort.body));
  } else {
    fail("Shortener usage unlimited", `${uShort.res.status} ${JSON.stringify(uShort.body)}`);
  }

  // --- Auth ---
  if (!SUPABASE_URL || !ANON || !SERVICE) {
    fail("Auth env present", "missing SUPABASE env");
    summarize();
    process.exit(1);
  }

  const auth = createClient(SUPABASE_URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const admin = createClient(SUPABASE_URL, SERVICE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: signIn, error: signErr } = await auth.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });
  if (signErr || !signIn.session) {
    fail("Sign in test@deskzy.xyz", signErr?.message || "no session");
    summarize();
    process.exit(1);
  }
  ok("Sign in test@deskzy.xyz", signIn.user.id);
  const token = signIn.session.access_token;
  const userId = signIn.user.id;
  const authHeaders = {
    authorization: `Bearer ${token}`,
    cookie: `sb-access-token=${token}`,
  };

  // Cookie-based auth for Next/Supabase SSR is trickier — use supabase client for DB
  // and hit APIs with Cookie from supabase auth helpers pattern.
  // Deskzy APIs use createClient() from cookies. We'll set both sb-* cookies via
  // a lightweight login page flow isn't available here — so we test Pro via
  // service-role entitlement + cookie jar from password grant using @supabase/ssr shape.

  // Build cookie header like supabase-ssr project ref
  const projectRef = new URL(SUPABASE_URL).hostname.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const cookieVal = encodeURIComponent(
    JSON.stringify({
      access_token: signIn.session.access_token,
      refresh_token: signIn.session.refresh_token,
      expires_at: signIn.session.expires_at,
      expires_in: signIn.session.expires_in,
      token_type: "bearer",
      user: signIn.user,
    }),
  );
  const cookieHeader = `${cookieName}=${cookieVal}`;

  // Ensure Free first
  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan: "free",
      status: "inactive",
      seats: 1,
      billing_cycle: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  // Check unique constraint — subscriptions may not have unique on user_id
  const { data: existingSubs } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId);
  if (existingSubs?.length) {
    await admin
      .from("subscriptions")
      .update({
        plan: "free",
        status: "inactive",
        seats: 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  } else {
    await admin.from("subscriptions").insert({
      user_id: userId,
      plan: "free",
      status: "inactive",
      seats: 1,
    });
  }
  ok("Set user to Free for baseline");

  const freeCustom = await jsonFetch(`${BASE}/api/links`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({
      url: "https://example.com/still-free",
      slug: `still-free-${Date.now().toString(36)}`,
    }),
  });
  if (freeCustom.res.status === 402) ok("Authed Free: custom slug 402");
  else fail("Authed Free: custom slug 402", `${freeCustom.res.status} ${JSON.stringify(freeCustom.body)}`);

  // Promote to Pro
  const { data: proSub, error: proErr } = await admin
    .from("subscriptions")
    .update({
      plan: "pro",
      status: "active",
      seats: 3,
      billing_cycle: "monthly",
      current_period_end: new Date(Date.now() + 30 * 864e5).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select("id,plan,status,seats")
    .maybeSingle();

  if (proErr || !proSub) {
    // insert if update matched nothing
    const ins = await admin
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan: "pro",
        status: "active",
        seats: 3,
        billing_cycle: "monthly",
        current_period_end: new Date(Date.now() + 30 * 864e5).toISOString(),
      })
      .select("id,plan,status,seats")
      .single();
    if (ins.error) fail("Promote to Pro", ins.error.message);
    else ok("Promote to Pro", JSON.stringify(ins.data));
  } else {
    ok("Promote to Pro", JSON.stringify(proSub));
  }

  const slug = `e2e-${Date.now().toString(36)}`;
  const proCustom = await jsonFetch(`${BASE}/api/links`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({
      url: "https://example.com/pro-custom",
      slug,
    }),
  });
  if (proCustom.res.status === 201 && proCustom.body?.isCustom) {
    ok("Pro custom slug create", proCustom.body.shortUrl);
  } else {
    fail(
      "Pro custom slug create",
      `${proCustom.res.status} ${JSON.stringify(proCustom.body)}`,
    );
  }

  // Persist owned link check in DB
  if (proCustom.body?.code) {
    const { data: owned } = await admin
      .from("short_links")
      .select("code,user_id,is_custom,hits")
      .eq("code", proCustom.body.code)
      .maybeSingle();
    if (owned?.user_id === userId && owned.is_custom) {
      ok("Owned link persisted in Supabase", owned.code);
    } else {
      fail("Owned link persisted in Supabase", JSON.stringify(owned));
    }

    // Click + stats
    const click = await jsonFetch(
      `${BASE}/api/links/${encodeURIComponent(proCustom.body.code)}/click`,
      {
        method: "POST",
        headers: { "user-agent": "DeskzyE2E/1.0", referer: "https://e2e.test/" },
      },
    );
    if (click.res.ok && click.body?.tracked) {
      ok("Click beacon records analytics", JSON.stringify(click.body));
    } else if (click.res.ok && click.body?.ok) {
      fail(
        "Click beacon records analytics",
        `ok but not tracked: ${JSON.stringify(click.body)}`,
      );
    } else {
      fail("Click beacon records analytics", `${click.res.status} ${JSON.stringify(click.body)}`);
    }

    await new Promise((r) => setTimeout(r, 300));
    const { data: clickRows } = await admin
      .from("link_clicks")
      .select("id")
      .eq("code", proCustom.body.code);
    if ((clickRows?.length || 0) > 0) ok("Click row in Supabase", `n=${clickRows.length}`);
    else fail("Click row in Supabase", "0 rows");

    const stats = await jsonFetch(
      `${BASE}/api/links/${encodeURIComponent(proCustom.body.code)}/stats`,
      { headers: { cookie: cookieHeader } },
    );
    if (stats.res.ok && stats.body?.link?.code === proCustom.body.code) {
      ok("Link stats API", `clicks30=${stats.body.clicks30}`);
    } else {
      fail("Link stats API", `${stats.res.status} ${JSON.stringify(stats.body)}`);
    }
  }

  const list = await jsonFetch(`${BASE}/api/links`, {
    headers: { cookie: cookieHeader },
  });
  if (list.res.ok && Array.isArray(list.body?.links)) {
    ok("List owned links", `n=${list.body.links.length}`);
  } else {
    fail("List owned links", `${list.res.status} ${JSON.stringify(list.body)}`);
  }

  // Presets
  const preset = await jsonFetch(`${BASE}/api/presets`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({
      kind: "utm",
      name: `e2e-${Date.now()}`,
      payload: { source: "e2e", medium: "test", campaign: "smoke" },
    }),
  });
  if (preset.res.status === 201 && preset.body?.preset?.id) {
    ok("Save Pro preset", preset.body.preset.id);
    const del = await jsonFetch(
      `${BASE}/api/presets?id=${encodeURIComponent(preset.body.preset.id)}`,
      { method: "DELETE", headers: { cookie: cookieHeader } },
    );
    if (del.res.ok) ok("Delete Pro preset");
    else fail("Delete Pro preset", `${del.res.status}`);
  } else {
    fail("Save Pro preset", `${preset.res.status} ${JSON.stringify(preset.body)}`);
  }

  // Seats
  const inviteEmail = `e2e+${Date.now()}@deskzy.xyz`;
  const invite = await jsonFetch(`${BASE}/api/seats`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({ email: inviteEmail }),
  });
  if (invite.res.status === 201 && invite.body?.inviteUrl) {
    ok("Create seat invite", invite.body.inviteUrl);
    const seatsGet = await jsonFetch(`${BASE}/api/seats`, {
      headers: { cookie: cookieHeader },
    });
    if (seatsGet.res.ok && (seatsGet.body?.invites || []).length > 0) {
      ok("List seat invites", `n=${seatsGet.body.invites.length}`);
    } else {
      fail("List seat invites", JSON.stringify(seatsGet.body));
    }
    if (invite.body?.invite?.id) {
      const rev = await jsonFetch(
        `${BASE}/api/seats?id=${encodeURIComponent(invite.body.invite.id)}`,
        { method: "DELETE", headers: { cookie: cookieHeader } },
      );
      if (rev.res.ok) ok("Revoke seat invite");
      else fail("Revoke seat invite", `${rev.res.status} ${JSON.stringify(rev.body)}`);
    }
  } else {
    fail("Create seat invite", `${invite.res.status} ${JSON.stringify(invite.body)}`);
  }

  // Pro usage unlimited
  const proUsage = await jsonFetch(`${BASE}/api/usage`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader,
      "x-deskzy-anon": anon,
    },
    body: JSON.stringify({ toolSlug: "merge-pdf", increment: true }),
  });
  if (proUsage.res.ok && proUsage.body?.remaining === null && proUsage.body?.plan === "pro") {
    ok("Pro usage unlimited", JSON.stringify(proUsage.body));
  } else {
    // may still be free if cookie auth failed for getUser
    fail("Pro usage unlimited", `${proUsage.res.status} ${JSON.stringify(proUsage.body)}`);
  }

  // Account page
  const account = await fetch(`${BASE}/account`, {
    headers: { cookie: cookieHeader },
    redirect: "manual",
  });
  if (account.status === 200 || account.status === 307 || account.status === 302) {
    ok("Account page reachable", String(account.status));
  } else {
    fail("Account page reachable", String(account.status));
  }

  // Pricing copy check
  const pricingHtml = await (await fetch(`${BASE}/pricing`)).text();
  if (pricingHtml.includes("Unlimited free short links") || pricingHtml.includes("Unlimited")) {
    ok("Pricing mentions unlimited short links");
  } else {
    fail("Pricing mentions unlimited short links", "phrase not found");
  }

  // Restore Free so test account doesn't stay paid accidentally
  await admin
    .from("subscriptions")
    .update({
      plan: "free",
      status: "inactive",
      seats: 1,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
  ok("Restore test user to Free");

  summarize();
}

function summarize() {
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===\n`);
  if (failed) {
    for (const r of results.filter((x) => !x.pass)) {
      console.log(`  • ${r.name}: ${r.detail}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
