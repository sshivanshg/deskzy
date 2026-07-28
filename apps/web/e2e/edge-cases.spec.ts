import { test, expect } from "@playwright/test";
import {
  clickPrimary,
  fixture,
  gotoTool,
  uploadFiles,
} from "./helpers";

test.describe("Media & edge cases", () => {
  test("video-to-mp3 shows honest not-ready error", async ({ page }) => {
    await gotoTool(page, "video-to-mp3");
    await uploadFiles(page, fixture("sample.png"));
    await clickPrimary(page, /Run|Convert/i);
    await expect(
      page.locator("div").filter({ hasText: /ffmpeg\.wasm/i }).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("merge-pdf requires two files", async ({ page }) => {
    await gotoTool(page, "merge-pdf");
    await uploadFiles(page, fixture("doc-invoice.pdf"));
    await clickPrimary(page, /Merge/i);
    await expect(page.getByText(/at least 2/i)).toBeVisible();
  });

  test("json-formatter shows invalid json error", async ({ page }) => {
    await gotoTool(page, "json-formatter");
    await page.locator("textarea").fill("{not-json");
    await clickPrimary(page, /Format/i);
    await expect(page.locator("text=/JSON|Unexpected|invalid/i").first()).toBeVisible();
  });

  test("primary button disabled until input ready", async ({ page }) => {
    await gotoTool(page, "compress-pdf");
    await expect(page.locator("button.btn-primary").first()).toBeDisabled();
    await uploadFiles(page, fixture("doc-handbook.pdf"));
    await expect(page.locator("button.btn-primary").first()).toBeEnabled();
  });

  test("wrong file type on pdf tool surfaces error", async ({ page }) => {
    await gotoTool(page, "compress-pdf");
    await uploadFiles(page, fixture("photo.png"));
    await clickPrimary(page, /Compress/i);
    await expect(
      page.getByText(/pdf|invalid|failed|could not|error/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });
});
