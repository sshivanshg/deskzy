import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

type Ctx = { params: Promise<{ token: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  try {
    const { token } = await ctx.params;
    if (!token || token.length < 16) {
      return NextResponse.json({ error: "Invalid invite" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const admin = createServiceClient();
    const { data: invite } = await admin
      .from("seat_invites")
      .select("id,subscription_id,email,status")
      .eq("token", token)
      .maybeSingle();

    if (!invite || invite.status !== "pending") {
      return NextResponse.json(
        { error: "Invite not found or already used" },
        { status: 404 },
      );
    }

    if (
      user.email &&
      invite.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          error: `This invite is for ${invite.email}. Sign in with that email to accept.`,
        },
        { status: 403 },
      );
    }

    const { error: memberErr } = await admin.from("seat_members").upsert(
      {
        subscription_id: invite.subscription_id,
        user_id: user.id,
        role: "member",
      },
      { onConflict: "subscription_id,user_id" },
    );

    if (memberErr) {
      return NextResponse.json({ error: memberErr.message }, { status: 500 });
    }

    await admin
      .from("seat_invites")
      .update({ status: "accepted" })
      .eq("id", invite.id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
