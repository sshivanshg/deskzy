import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isPaidActive, type SubscriptionRow } from "@/lib/entitlements";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

function inviteToken(): string {
  return randomBytes(24).toString("base64url");
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

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id,user_id,plan,status,seats")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub || !isPaidActive(sub as SubscriptionRow)) {
      return NextResponse.json({ invites: [], members: [], seats: 1, plan: "free" });
    }

    const [{ data: invites }, { data: members }] = await Promise.all([
      supabase
        .from("seat_invites")
        .select("id,email,status,token,created_at")
        .eq("subscription_id", sub.id)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("seat_members")
        .select("id,user_id,role,created_at")
        .eq("subscription_id", sub.id)
        .limit(50),
    ]);

    return NextResponse.json({
      invites: invites ?? [],
      members: members ?? [],
      seats: sub.seats,
      plan: sub.plan,
      subscriptionId: sub.id,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id,user_id,plan,status,seats")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub || !isPaidActive(sub as SubscriptionRow)) {
      return NextResponse.json(
        { error: "Seat invites require an active Pro plan", upgradeUrl: "/pricing" },
        { status: 402 },
      );
    }

    const body = (await req.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (email === user.email?.toLowerCase()) {
      return NextResponse.json({ error: "You already own this subscription" }, { status: 400 });
    }

    const admin = createServiceClient();
    const [{ count: memberCount }, { count: pendingCount }] = await Promise.all([
      admin
        .from("seat_members")
        .select("id", { count: "exact", head: true })
        .eq("subscription_id", sub.id),
      admin
        .from("seat_invites")
        .select("id", { count: "exact", head: true })
        .eq("subscription_id", sub.id)
        .eq("status", "pending"),
    ]);

    const used = 1 + (memberCount ?? 0) + (pendingCount ?? 0);
    // Owner occupies 1 seat; members + pending invites fill the rest
    if (used >= sub.seats) {
      return NextResponse.json(
        {
          error: `All ${sub.seats} seats are used. Increase seats on Pricing or revoke an invite.`,
        },
        { status: 409 },
      );
    }

    const token = inviteToken();
    const { data: invite, error } = await admin
      .from("seat_invites")
      .insert({
        subscription_id: sub.id,
        email,
        token,
        status: "pending",
        invited_by: user.id,
      })
      .select("id,email,status,token,created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const origin = req.nextUrl.origin;
    return NextResponse.json(
      {
        invite,
        inviteUrl: `${origin}/invite/${token}`,
      },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub) {
      return NextResponse.json({ error: "No subscription" }, { status: 404 });
    }

    const admin = createServiceClient();
    const { error } = await admin
      .from("seat_invites")
      .update({ status: "revoked" })
      .eq("id", id)
      .eq("subscription_id", sub.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
