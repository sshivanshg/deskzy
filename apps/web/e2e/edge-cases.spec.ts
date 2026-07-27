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
    await uploadFiles(page, fixture("sample-a.pdf"));
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
    await uploadFiles(page, fixture("sample-a.pdf"));
    await expect(page.locator("button.btn-primary").first()).toBeEnabled();
  });
});
