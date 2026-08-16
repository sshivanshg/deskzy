import { NextResponse } from "next/server";
import { publicLinkUrl } from "@/lib/link-path";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "deskzy-admin-unlocked";

function hostFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const unlocked = cookieStore.get(COOKIE_NAME)?.value;
    if (unlocked !== "1") {
      return NextResponse.json({ error: "Admin unlock required" }, { status: 403 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing service role key" },
        { status: 500 },
      );
    }

    const admin = createServiceClient();
    const [{ data: links, error: linksError }, { data: clicks, error: clicksError }, { data: subs, error: subsError }, { data: keys, error: keysError }, { data: invites, error: invitesError }] =
      await Promise.all([
        admin
          .from("short_links")
          .select("code,dest,hits,created_at,user_id,is_custom,kind,urls")
          .order("created_at", { ascending: false })
          .limit(250),
        admin
          .from("link_clicks")
          .select("code,referrer,user_agent,country,colo,clicked_at")
          .order("clicked_at", { ascending: false })
          .limit(400),
        admin
          .from("subscriptions")
          .select("id,user_id,plan,status,billing_cycle,seats,razorpay_subscription_id,current_period_end,updated_at")
          .order("updated_at", { ascending: false })
          .limit(100),
        admin
          .from("api_keys")
          .select("id,user_id,name,key_prefix,created_at,last_used_at,revoked_at")
          .order("created_at", { ascending: false })
          .limit(100),
        admin
          .from("seat_invites")
          .select("id,subscription_id,email,status,token,created_at,invited_by")
          .order("created_at", { ascending: false })
          .limit(100),
      ]);

    const errors = [linksError, clicksError, subsError, keysError, invitesError].filter(Boolean);
    if (errors.length) {
      return NextResponse.json(
        { error: (errors[0] as { message?: string }).message || "Failed to load admin data" },
        { status: 500 },
      );
    }

    const referrerCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    const coloCounts = new Map<string, number>();
    const linkKindCounts = { single: 0, list: 0 };

    for (const link of links ?? []) {
      const kind = (link.kind === "list" ? "list" : "single") as "single" | "list";
      linkKindCounts[kind] += 1;
    }

    const recentClicks = (clicks ?? []).map((click) => {
      const ref = hostFromUrl(click.referrer as string | null);
      if (ref) referrerCounts.set(ref, (referrerCounts.get(ref) || 0) + 1);
      const country = (click.country as string | null)?.toUpperCase() || null;
      if (country) countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
      const colo = (click.colo as string | null)?.toUpperCase() || null;
      if (colo) coloCounts.set(colo, (coloCounts.get(colo) || 0) + 1);
      return click;
    });

    const totals = {
      links: links?.length ?? 0,
      clicks: clicks?.length ?? 0,
      users: new Set((subs ?? []).map((s) => s.user_id)).size,
      apiKeys: keys?.length ?? 0,
      invites: invites?.length ?? 0,
      listLinks: linkKindCounts.list,
      singleLinks: linkKindCounts.single,
    };

    const top = (map: Map<string, number>) =>
      [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([label, count]) => ({ label, count }));

    return NextResponse.json({
      totals,
      links: (links ?? []).map((link) => ({
        ...link,
        shortUrl: publicLinkUrl(link.code),
        destHost: hostFromUrl(link.dest),
        urlCount: Array.isArray(link.urls) ? link.urls.length : link.kind === "list" ? 2 : 1,
      })),
      clicks: recentClicks,
      subscriptions: subs ?? [],
      apiKeys: keys ?? [],
      invites: invites ?? [],
      topReferrers: top(referrerCounts),
      topCountries: top(countryCounts),
      topColos: top(coloCounts),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
