import { test, expect } from "@playwright/test";
import {
  clickPrimary,
  createWebpViaBrowser,
  expectDone,
  expectDownloadReady,
  fixture,
  gotoTool,
  uploadFiles,
} from "./helpers";

test.describe("Image tools", () => {
  test("compress-image", async ({ page }) => {
    await gotoTool(page, "compress-image");
    await uploadFiles(page, fixture("photo.png"));
    await page.getByRole("button", { name: "Balanced" }).click();
    await clickPrimary(page, /Compress/i);
    await expectDone(page);
    await expectDownloadReady(page);
  });

  test("resize-image", async ({ page }) => {
    await gotoTool(page, "resize-image");
    await uploadFiles(page, fixture("photo.png"));
    await page.getByLabel(/Keep aspect/i).uncheck();
    await page.locator('input[type="number"]').nth(0).fill("120");
    await page.locator('input[type="number"]').nth(1).fill("80");
    await clickPrimary(page, /Run|Resize/i);
    await expectDone(page);
    await expectDownloadReady(page);
    await expect(page.getByText(/width:\s*120/i)).toBeVisible();
  });

  test("convert-image to jpeg", async ({ page }) => {
    await gotoTool(page, "convert-image");
    await uploadFiles(page, fixture("photo-b.png"));
    await page.getByRole("button", { name: "JPEG" }).click();
    await clickPrimary(page, /Convert/i);
    await expectDone(page);
    await expectDownloadReady(page);
  });

  test("webp-to-png", async ({ page }) => {
    await page.goto("/");
    const webpPath = await createWebpViaBrowser(page);
    await gotoTool(page, "webp-to-png");
    await uploadFiles(page, webpPath);
    await clickPrimary(page, /Convert|Run/i);
    await expectDone(page);
    await expectDownloadReady(page);
  });
});
