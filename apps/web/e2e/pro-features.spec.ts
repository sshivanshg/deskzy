import { createClient } from "@supabase/supabase-js";
import { test, expect } from "@playwright/test";

const EMAIL = process.env.SMOKE_EMAIL || "test@deskzy.xyz";
const PASSWORD = process.env.SMOKE_PASSWORD || "DeskzyTest!2026";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

test.describe("Auth + Pro account UI", () => {
  test("login → account shows Free → Pro panel after promote", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    const admin = createClient(SUPABASE_URL, SERVICE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData } = await admin.auth.admin.listUsers();
    const user = userData.users.find((u) => u.email === EMAIL);
    expect(user).toBeTruthy();

    await admin
      .from("subscriptions")
      .update({
        plan: "free",
        status: "inactive",
        seats: 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user!.id);

    await page.goto("/login");
    await page.getByLabel(/email/i).fill(EMAIL);
    await page.getByLabel(/password/i).fill(PASSWORD);
    await page.getByRole("button", { name: /log in|sign in/i }).click();
    await page.waitForURL(/\/(account|pricing|$)/, { timeout: 30_000 });

    await page.goto("/account");
    await expect(page.getByText(EMAIL)).toBeVisible();
    await expect(page.getByText("Free").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /What Pro unlocks/i })).toBeVisible();
    await page.getByRole("button", { name: /Links/i }).click();
    await expect(page.getByRole("heading", { name: /Your short links/i })).toBeVisible();

    await admin
      .from("subscriptions")
      .update({
        plan: "pro",
        status: "active",
        seats: 3,
        billing_cycle: "monthly",
        current_period_end: new Date(Date.now() + 30 * 864e5).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user!.id);

    await page.reload();
    await expect(page.getByText("Pro").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Included with Pro/i })).toBeVisible();
    await page.getByRole("button", { name: /Team/i }).click();
    await expect(page.getByRole("heading", { name: /Team seats/i })).toBeVisible();
    await page.getByRole("button", { name: /Presets/i }).click();
    await expect(page.getByRole("heading", { name: /Synced presets/i })).toBeVisible();

    // Custom slug on shortener
    await page.goto("/tools/url-shortener");
    await expect(page.getByText(/Custom slug/i)).toBeVisible();
    const slug = `ui-${Date.now().toString(36)}`;
    await page.locator("textarea").fill("https://example.com/ui-e2e");
    await page.getByPlaceholder("your-brand").fill(slug);
    await page.getByRole("button", { name: /^Shorten$/i }).click();
    await expect(page.getByText(new RegExp(`/r/${slug}`))).toBeVisible({
      timeout: 20_000,
    });

    // Cleanup entitlement
    await admin
      .from("subscriptions")
      .update({
        plan: "free",
        status: "inactive",
        seats: 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user!.id);
  });
});
