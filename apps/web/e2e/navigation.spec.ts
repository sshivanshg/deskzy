import { test, expect } from "@playwright/test";

test.describe("Navigation & shell", () => {
  test("home shows brand, search, popular, categories", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: /Free online file tools — private & no signup/i,
      }),
    ).toBeVisible();
    await expect(page.getByText("Every file tool. One place.", { exact: true })).toBeVisible();
    await expect(page.locator("#home-tool-search-desktop")).toBeVisible();
    await expect(page.getByRole("heading", { name: "URL Shortener" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What do you need?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Popular right now" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Browse by category" })).toBeVisible();
    await expect(page.getByRole("link", { name: /^PDF$/ }).first()).toBeVisible();
  });

  test("shortcut /shorten lands on url shortener", async ({ page }) => {
    await page.goto("/shorten");
    await expect(page).toHaveURL(/\/tools\/url-shortener/);
    await expect(page.getByRole("heading", { name: "URL Shortener" })).toBeVisible();
  });

  test("home search finds compress pdf and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.locator("#home-tool-search-desktop").fill("compress pdf");
    await expect(page.getByRole("link", { name: /Compress PDF/i }).first()).toBeVisible();
    await page.getByRole("link", { name: /Compress PDF/i }).first().click();
    await expect(page).toHaveURL(/\/tools\/compress-pdf/);
    await expect(page.getByRole("heading", { name: "Compress PDF" })).toBeVisible();
  });

  test("category pages render tools", async ({ page }) => {
    for (const cat of ["pdf", "media", "image", "text", "links"] as const) {
      await page.goto(`/${cat}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        new RegExp(
          cat === "text" ? "Text" : cat === "links" ? "Links" : cat,
          "i",
        ),
      );
      await expect(page.locator('a[href^="/tools/"]').first()).toBeVisible();
    }
  });

  test("seo routes sitemap and robots", async ({ page }) => {
    const sitemap = await page.goto("/sitemap.xml");
    expect(sitemap?.status()).toBe(200);
    await expect(page.locator("body")).toContainText("deskzy.xyz/tools/url-shortener");

    const robots = await page.goto("/robots.txt");
    expect(robots?.status()).toBe(200);
    await expect(page.locator("body")).toContainText("Sitemap:");
  });

  test("tool pages include SEO FAQ section", async ({ page }) => {
    await page.goto("/tools/url-shortener");
    await expect(
      page.getByRole("heading", { name: /Frequently asked questions/i }),
    ).toBeVisible();
    await expect(page.getByText(/deskzy\.xyz\/r\//i)).toBeVisible();
  });

  test("about / privacy page", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /About & privacy/i })).toBeVisible();
    await expect(page.getByText(/Browser-first/i)).toBeVisible();
  });

  test("header nav links work", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.locator("nav").getByRole("link", { name: "PDF", exact: true }).click();
    await expect(page).toHaveURL(/\/pdf$/);
    await page.locator("nav").getByRole("link", { name: "Image", exact: true }).click();
    await expect(page).toHaveURL(/\/image$/);
  });

  test("every registered tool page loads", async ({ page }) => {
    const slugs = [
      "merge-pdf",
      "split-pdf",
      "compress-pdf",
      "pdf-to-images",
      "reorder-pdf",
      "compress-image",
      "resize-image",
      "convert-image",
      "webp-to-png",
      "json-formatter",
      "base64",
      "hash-generator",
      "uuid-generator",
      "qr-code",
      "url-shortener",
      "url-encode",
      "word-counter",
      "case-converter",
      "markdown-to-html",
      "password-generator",
      "video-to-mp3",
      "utm-builder",
      "whatsapp-link",
      "bio-link",
    ];
    const remote = /deskzy\.xyz|workers\.dev/.test(
      process.env.PLAYWRIGHT_BASE_URL || "",
    );
    const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (const slug of slugs) {
      let lastError: unknown;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await page.goto(`/tools/${slug}`, { waitUntil: "domcontentloaded" });
          // Worker 1102 / resource spikes under rapid sequential SSR
          if (
            await page.getByText(/Worker exceeded resource limits|Error 1102/i).count()
          ) {
            throw new Error(`Worker resource limit on /tools/${slug}`);
          }
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
          await expect(
            page.getByText(
              /Stays in browser|API for links only|Processed on server/i,
            ),
          ).toBeVisible();
          lastError = undefined;
          break;
        } catch (e) {
          lastError = e;
          if (attempt < 2) await pause(remote ? 1500 : 400);
        }
      }
      if (lastError) throw lastError;
      if (remote) await pause(350);
    }
  });
});
