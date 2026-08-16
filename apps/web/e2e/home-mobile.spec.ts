import { test, expect } from "@playwright/test";

test.describe("Mobile home launcher", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("shows shorten dock on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#home-shorten-url")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Publish$/i })).toBeVisible();
  });

  test("shows shorten dock, search, category chips, popular strip", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#home-shorten-url")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Publish$/i })).toBeVisible();
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
        name: /Own shared links on deskzy\.xyz — plus private file tools/i,
      }),
    ).toBeAttached();
  });

  test("shorten on home shows copyable short link", async ({
    page,
    request,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.locator("#home-shorten-url").fill("https://example.com/home-dock-e2e");
    await page.getByRole("button", { name: /^Publish$/i }).click();
    await expect(page.getByText(/Link ready/i)).toBeVisible();
    await expect(page.getByText(/Only visible to you/i)).toBeVisible();
    const directInput = page.getByLabel(/Direct link/i);
    await expect(directInput).toBeVisible();
    const shortUrl = (await directInput.inputValue()).trim();
    expect(shortUrl).toMatch(/yoururl\.buzz\/p\/[A-Za-z0-9]+$/);
    await page.getByRole("button", { name: /^Copy$/i }).first().click();
    await expect(page.getByRole("button", { name: /^Copied$/i }).first()).toBeVisible();

    const res = await request.get(shortUrl, { maxRedirects: 0 });
    expect(res.status()).toBe(200);
    await page.goto(shortUrl);
    await expect(page.getByRole("heading", { name: /Shared content/i })).toBeVisible();
  });
});
