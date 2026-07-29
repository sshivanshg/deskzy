import { NextRequest, NextResponse } from "next/server";
import { getUserPlan } from "@/lib/pro-links";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { plan } = await getUserPlan(user.id);

    const kind = req.nextUrl.searchParams.get("kind");
    let query = supabase
      .from("user_presets")
      .select("id,kind,name,payload,created_at,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(50);

    if (kind === "utm" || kind === "image") {
      query = query.eq("kind", kind);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ presets: data ?? [], plan });
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

    const { plan } = await getUserPlan(user.id);
    if (plan === "free") {
      return NextResponse.json(
        {
          error: "Saved presets are a Pro feature",
          upgradeUrl: "/pricing",
        },
        { status: 402 },
      );
    }

    const body = (await req.json()) as {
      kind?: string;
      name?: string;
      payload?: Record<string, unknown>;
    };
    if (body.kind !== "utm" && body.kind !== "image") {
      return NextResponse.json({ error: "kind must be utm or image" }, { status: 400 });
    }
    const name = body.name?.trim();
    if (!name || name.length > 80) {
      return NextResponse.json({ error: "name required (max 80 chars)" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_presets")
      .insert({
        user_id: user.id,
        kind: body.kind,
        name,
        payload: body.payload ?? {},
      })
      .select("id,kind,name,payload,created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ preset: data }, { status: 201 });
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

    const { error } = await supabase
      .from("user_presets")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

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
