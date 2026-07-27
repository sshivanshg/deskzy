import { test, expect } from "@playwright/test";

test.describe("Mobile home launcher", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("shows shorten dock on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#home-shorten-url")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Shorten$/i })).toBeVisible();
  });

  test("shows shorten dock, search, category chips, popular strip", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#home-shorten-url")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Shorten$/i })).toBeVisible();
    // Prefer #home-tool-search: placeholder regex also matches header "Search tools"
    // and a second HomeSearch in the desktop (display:none) branch.
    await expect(page.locator("#home-tool-search")).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Categories" }).getByRole("link", {
        name: /^PDF$/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Categories" }).getByRole("link", {
        name: /^Image$/i,
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Popular$/i })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "What do you need?" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Browse by category" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Free online file tools — private & no signup/i,
      }),
    ).toBeAttached();
  });
});
