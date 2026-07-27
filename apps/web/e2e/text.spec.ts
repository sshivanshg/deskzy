import { test, expect } from "@playwright/test";
import {
  clickPrimary,
  expectDone,
  fillTextarea,
  gotoTool,
} from "./helpers";

test.describe("Text tools", () => {
  test("json-formatter", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await gotoTool(page, "json-formatter");
    await fillTextarea(page, '{"a":1,"b":[true,false]}');
    await clickPrimary(page, /Format/i);
    await expectDone(page);
    await expect(page.locator("pre")).toContainText('"a": 1');
    await page.getByRole("button", { name: /^Copy$/i }).click();
    await expect(page.getByRole("button", { name: /Copied/i })).toBeVisible();
  });

  test("base64 encode", async ({ page }) => {
    await gotoTool(page, "base64");
    await fillTextarea(page, "hello deskzy");
    await page.locator("button.chip", { hasText: "Encode" }).click();
    await clickPrimary(page, /^Run$/);
    await expectDone(page);
    await expect(page.locator("pre")).toContainText("aGVsbG8gZGVza3p5");
  });

  test("hash-generator sha-256", async ({ page }) => {
    await gotoTool(page, "hash-generator");
    await fillTextarea(page, "deskzy");
    await page.getByRole("button", { name: "SHA-256" }).click();
    await clickPrimary(page, /Run|Generate/i);
    await expectDone(page);
    const text = await page.locator("pre").innerText();
    expect(text.trim()).toMatch(/^[a-f0-9]{64}$/);
  });

  test("uuid-generator", async ({ page }) => {
    await gotoTool(page, "uuid-generator");
    await page.locator('input[type="number"]').fill("3");
    await clickPrimary(page, /Generate/i);
    await expectDone(page);
    const text = await page.locator("pre").innerText();
    const lines = text.trim().split("\n");
    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    }
  });

  test("qr-code", async ({ page }) => {
    await gotoTool(page, "qr-code");
    await fillTextarea(page, "https://deskzy.xyz");
    await clickPrimary(page, /Generate/i);
    await expectDone(page);
    await expect(page.getByRole("img", { name: /QR/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Download/i })).toBeVisible();
  });

  test("url-shortener end-to-end", async ({ page, request }) => {
    await gotoTool(page, "url-shortener");
    await fillTextarea(page, "https://example.com/e2e-shorten");
    await clickPrimary(page, /Shorten/i);
    await expectDone(page);
    const shortUrl = (await page.locator("pre").innerText()).trim();
    expect(shortUrl).toMatch(/\/r\/[A-Za-z0-9]+$/);

    const res = await request.get(shortUrl, { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers().location).toContain("example.com");
  });

  test("url-encode", async ({ page }) => {
    await gotoTool(page, "url-encode");
    await fillTextarea(page, "a b/c");
    await page.locator("button.chip", { hasText: "Encode" }).click();
    await clickPrimary(page, /^Run$/);
    await expectDone(page);
    await expect(page.locator("pre")).toContainText("a%20b%2Fc");
  });

  test("word-counter", async ({ page }) => {
    await gotoTool(page, "word-counter");
    await fillTextarea(page, "one two three");
    await clickPrimary(page, /Run/i);
    await expectDone(page);
    await expect(page.locator("pre")).toContainText("Words: 3");
  });

  test("case-converter", async ({ page }) => {
    await gotoTool(page, "case-converter");
    await fillTextarea(page, "hello world");
    await page.getByRole("button", { name: "upper" }).click();
    await clickPrimary(page, /Run|Convert/i);
    await expectDone(page);
    await expect(page.locator("pre")).toContainText("HELLO WORLD");
  });

  test("markdown-to-html", async ({ page }) => {
    await gotoTool(page, "markdown-to-html");
    await fillTextarea(page, "# Hello\n\n**bold**");
    await clickPrimary(page, /Convert/i);
    await expectDone(page);
    await expect(page.locator("pre")).toContainText("<h1");
    await expect(page.locator("pre")).toContainText("<strong>bold</strong>");
  });

  test("password-generator", async ({ page }) => {
    await gotoTool(page, "password-generator");
    await page.locator('input[type="number"]').fill("16");
    await clickPrimary(page, /Generate/i);
    await expectDone(page);
    const text = (await page.locator("pre").innerText()).trim();
    expect(text.length).toBe(16);
  });
});
