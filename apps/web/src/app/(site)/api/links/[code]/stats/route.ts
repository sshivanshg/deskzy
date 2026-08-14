import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ code: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { code: raw } = await ctx.params;
    const code = decodeURIComponent(raw);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { data: link } = await supabase
      .from("short_links")
      .select("code,dest,hits,is_custom,created_at,user_id")
      .eq("code", code)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data: clicks } = await supabase
      .from("link_clicks")
      .select("clicked_at,referrer")
      .eq("code", code)
      .gte("clicked_at", since.toISOString())
      .order("clicked_at", { ascending: false })
      .limit(500);

    const byDay = new Map<string, number>();
    for (const c of clicks ?? []) {
      const day = c.clicked_at.slice(0, 10);
      byDay.set(day, (byDay.get(day) || 0) + 1);
    }

    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      return { day: key, clicks: byDay.get(key) || 0 };
    });

    return NextResponse.json({
      link,
      last7,
      clicks30: clicks?.length ?? 0,
      recent: (clicks ?? []).slice(0, 20),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
