import { NextRequest, NextResponse } from "next/server";
import {
  createApiKeyForUser,
  listApiKeysForUser,
  revokeApiKeyForUser,
} from "@/lib/api-keys";
import { getUserPlan } from "@/lib/pro-links";
import { createClient } from "@/lib/supabase/server";

async function requirePaidUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Login required" }, { status: 401 }) };
  }
  const { plan } = await getUserPlan(user.id);
  if (plan === "free") {
    return {
      error: NextResponse.json(
        {
          error: "API keys are a Pro feature",
          upgradeUrl: "/pricing",
        },
        { status: 402 },
      ),
    };
  }
  return { user };
}

/** List active API keys for the signed-in Pro/Business user. */
export async function GET() {
  try {
    const gate = await requirePaidUser();
    if ("error" in gate) return gate.error;

    const keys = await listApiKeysForUser(gate.user.id);
    return NextResponse.json({ keys });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}

/** Create a new API key. Plaintext returned once in `secret`. */
export async function POST(req: NextRequest) {
  try {
    const gate = await requirePaidUser();
    if ("error" in gate) return gate.error;

    let name: string | undefined;
    try {
      const body = (await req.json()) as { name?: string };
      name = body.name;
    } catch {
      name = undefined;
    }

    const { key, plaintext } = await createApiKeyForUser({
      userId: gate.user.id,
      name,
    });

    return NextResponse.json(
      {
        key,
        secret: plaintext,
        hint: "Copy this key now — it will not be shown again.",
      },
      { status: 201 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    const status = /maximum of 5/i.test(msg) ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

/** Revoke a key: DELETE /api/keys?id=<uuid> */
export async function DELETE(req: NextRequest) {
  try {
    const gate = await requirePaidUser();
    if ("error" in gate) return gate.error;

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    await revokeApiKeyForUser({ userId: gate.user.id, keyId: id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
