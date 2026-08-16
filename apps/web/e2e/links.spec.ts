import { test, expect } from "@playwright/test";
import { clickPrimary, expectDone, gotoTool } from "./helpers";

test.describe("Link tools", () => {
  test("links category hub lists all six", async ({ page }) => {
    await page.goto("/links");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Links/i);
    for (const slug of [
      "url-shortener",
      "link-list",
      "qr-code",
      "utm-builder",
      "whatsapp-link",
      "bio-link",
    ]) {
      await expect(
        page.locator(`a.group.shell[href="/tools/${slug}"]`),
      ).toBeVisible();
    }
  });

  test("qr and shortener are not on text hub", async ({ page }) => {
    await page.goto("/text");
    await expect(
      page.locator('a.group.shell[href="/tools/json-formatter"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('a.group.shell[href="/tools/url-shortener"]'),
    ).toHaveCount(0);
    await expect(
      page.locator('a.group.shell[href="/tools/qr-code"]'),
    ).toHaveCount(0);
  });

  test("utm-builder generates tracked url", async ({ page }) => {
    await gotoTool(page, "utm-builder");
    await page.getByPlaceholder("https://example.com/landing").fill(
      "https://example.com/landing",
    );
    await page.getByRole("button", { name: "Google Ads" }).click();
    await page.getByPlaceholder("spring_sale").fill("launch");
    await clickPrimary(page, /Generate link/i);
    await expectDone(page);
    const text = (await page.locator("pre").innerText()).trim();
    expect(text).toContain("utm_source=google");
    expect(text).toContain("utm_medium=cpc");
    expect(text).toContain("utm_campaign=launch");
  });

  test("whatsapp-link builds wa.me url", async ({ page }) => {
    await gotoTool(page, "whatsapp-link");
    await page.getByPlaceholder("9876543210").fill("9876543210");
    await page.getByPlaceholder(/Hi! I found you/i).fill("Hello");
    await clickPrimary(page, /Generate link/i);
    await expectDone(page);
    const text = (await page.locator("pre").innerText()).trim();
    expect(text).toMatch(/^https:\/\/wa\.me\/919876543210\?text=/);
  });

  test("bio-link exports html download", async ({ page }) => {
    await gotoTool(page, "bio-link");
    await page.getByPlaceholder("Alex Chen").fill("Deskzy");
    const linkCards = page.locator("[data-bio-block='link']");
    await linkCards.nth(0).getByPlaceholder("Label").fill("Site");
    await linkCards
      .nth(0)
      .getByPlaceholder("https://")
      .fill("https://deskzy.xyz");
    await page.getByRole("button", { name: /Download HTML/i }).click();
    await expectDone(page);
    await expect(page.getByRole("link", { name: /Download/i })).toBeVisible();
    await expect(page.locator("pre")).toContainText("<!DOCTYPE html>");
  });

  test("link-list creates multi destination hop", async ({ page }) => {
    await gotoTool(page, "link-list");
    const draft = page.getByPlaceholder("https://…");
    await draft.fill("https://example.com/one");
    await page.getByRole("button", { name: /^Add$/i }).click();
    await draft.fill("https://example.com/two");
    await page.getByRole("button", { name: /^Add$/i }).click();
    await clickPrimary(page, /Publish list/i);
    await expectDone(page);
    await expect(page.getByText(/Only visible to you/i)).toBeVisible();
    const shortUrl = (await page.getByLabel(/Direct link/i).inputValue()).trim();
    expect(shortUrl).toMatch(/yoururl\.buzz\/p\/[A-Za-z0-9]+$/);

    await page.goto(shortUrl);
    await expect(page.getByText(/2 links/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /example\.com\/one/i }),
    ).toHaveAttribute("href", /example\.com\/one/);
  });

  test("shortcuts /utm /whatsapp /bio /list", async ({ page }) => {
    await page.goto("/utm");
    await expect(page).toHaveURL(/\/tools\/utm-builder/);
    await page.goto("/whatsapp");
    await expect(page).toHaveURL(/\/tools\/whatsapp-link/);
    await page.goto("/bio");
    await expect(page).toHaveURL(/\/tools\/bio-link/);
    await page.goto("/list");
    await expect(page).toHaveURL(/\/tools\/link-list/);
  });
});
