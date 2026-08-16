import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { buildPageMetadata } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Dashboard",
  description: "Internal admin dashboard for link inventory, sources, clicks, subscriptions, API keys, and invites.",
  path: "/account/admin",
});

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/admin");

  return <AdminDashboard />;
}

