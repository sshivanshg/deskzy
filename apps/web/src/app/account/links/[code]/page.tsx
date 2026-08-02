import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LinkStatsView } from "@/components/LinkStatsView";
import { isPaidActive, type SubscriptionRow } from "@/lib/entitlements";
import { buildPageMetadata } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  return buildPageMetadata({
    title: `Stats · /r/${decodeURIComponent(code)}`,
    description: "Click analytics for your Deskzy short link.",
    path: `/account/links/${encodeURIComponent(code)}`,
  });
}

export default async function LinkStatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw);

  let paid = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect(`/login?next=/account/links/${encodeURIComponent(code)}`);

    const { data } = await supabase
      .from("subscriptions")
      .select("plan,status")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    paid = isPaidActive((data as SubscriptionRow | null) ?? null);
  } catch {
    redirect("/login?next=/account");
  }

  return <LinkStatsView code={code} paid={paid} />;
}
