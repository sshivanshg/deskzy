import { test, expect } from "@playwright/test";

test.describe("Mobile home launcher", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("shows shorten dock on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#home-shorten-url")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Shorten$/i })).toBeVisible();
  });

  // Full mobile launcher layout — enabled in Task 2/3 once chips, Popular strip, and section hiding land.
  test.skip("shows shorten dock, search, category chips, popular strip", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#home-shorten-url")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Shorten$/i })).toBeVisible();
    await expect(page.getByPlaceholder(/shorten url|find a tool|search/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /^PDF$/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Image$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Popular/i })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "What do you need?" }),
    ).toHaveCount(0);
  });
});
