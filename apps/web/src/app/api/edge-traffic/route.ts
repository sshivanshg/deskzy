import { NextResponse } from "next/server";
import {
  CF_COLO_COORDS,
  EDGE_TRAFFIC_FALLBACK,
  type EdgeArc,
  type EdgeMarker,
} from "@/lib/edge-traffic";
import { createServiceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Edge traffic for the home globe.
 * Prefers live colo counts from owned-link clicks (cf-ray / cf-ipcountry),
 * falls back to a Cloudflare Worker colo snapshot.
 */
export async function GET() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(EDGE_TRAFFIC_FALLBACK);
    }

    const admin = createServiceClient();
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const { data, error } = await admin
      .from("link_clicks")
      .select("colo")
      .gte("clicked_at", since.toISOString())
      .not("colo", "is", null)
      .limit(5000);

    if (error || !data?.length) {
      return NextResponse.json(EDGE_TRAFFIC_FALLBACK);
    }

    const counts = new Map<string, number>();
    for (const row of data) {
      const colo = (row.colo as string | null)?.toUpperCase();
      if (!colo || !CF_COLO_COORDS[colo]) continue;
      counts.set(colo, (counts.get(colo) || 0) + 1);
    }

    const ranked = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (ranked.length < 3) {
      return NextResponse.json(EDGE_TRAFFIC_FALLBACK);
    }

    const markers: EdgeMarker[] = ranked.map(([colo, requests]) => ({
      id: `cdn-${colo.toLowerCase()}`,
      location: CF_COLO_COORDS[colo],
      region: colo,
      requests,
    }));

    const arcs: EdgeArc[] = [];
    for (let i = 0; i < Math.min(markers.length - 1, 6); i++) {
      const from = markers[i];
      const to = markers[(i + 1) % markers.length];
      arcs.push({
        id: `arc-${from.region}-${to.region}`.toLowerCase(),
        from: from.location,
        to: to.location,
        requests: Math.max(1, Math.round((from.requests + to.requests) / 8)),
      });
    }

    const totalRequests = ranked.reduce((n, [, c]) => n + c, 0);

    return NextResponse.json({
      source: "clicks" as const,
      totalRequests,
      markers,
      arcs,
    });
  } catch {
    return NextResponse.json(EDGE_TRAFFIC_FALLBACK);
  }
}
