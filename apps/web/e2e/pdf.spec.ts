import { test, expect } from "@playwright/test";
import {
  clickPrimary,
  expectDone,
  expectDownloadReady,
  fixture,
  gotoTool,
  uploadFiles,
} from "./helpers";

test.describe("PDF tools", () => {
  test("merge-pdf combines two files", async ({ page }) => {
    await gotoTool(page, "merge-pdf");
    await uploadFiles(page, [
      fixture("doc-invoice.pdf"),
      fixture("doc-report.pdf"),
    ]);
    await clickPrimary(page, /Merge/i);
    await expectDone(page);
    await expectDownloadReady(page);
    await expect(page.getByText(/files:\s*2/i)).toBeVisible();
  });

  test("split-pdf extracts page range", async ({ page }) => {
    await gotoTool(page, "split-pdf");
    await uploadFiles(page, fixture("doc-handbook.pdf"));
    await page.getByRole("button", { name: "Page range" }).click();
    await page.locator('input[type="number"]').nth(0).fill("1");
    await page.locator('input[type="number"]').nth(1).fill("2");
    await clickPrimary(page, /Split/i);
    await expectDone(page);
    await expectDownloadReady(page);
  });

  test("split-pdf all pages zip", async ({ page }) => {
    await gotoTool(page, "split-pdf");
    await uploadFiles(page, fixture("doc-invoice.pdf"));
    await page.getByRole("button", { name: /All pages/i }).click();
    await clickPrimary(page, /Split/i);
    await expectDone(page);
    await expectDownloadReady(page);
  });

  test("compress-pdf produces download", async ({ page }) => {
    await gotoTool(page, "compress-pdf");
    await uploadFiles(page, fixture("doc-handbook.pdf"));
    await page.getByRole("button", { name: "balanced" }).click();
    await clickPrimary(page, /Compress/i);
    await expectDone(page);
    await expectDownloadReady(page);
  });

  test("reorder-pdf with custom order", async ({ page }) => {
    await gotoTool(page, "reorder-pdf");
    await uploadFiles(page, fixture("doc-handbook.pdf"));
    await page.getByPlaceholder(/3,1,2/i).fill("3,1,2");
    await clickPrimary(page, /Run|Reorder/i);
    await expectDone(page);
    await expectDownloadReady(page);
  });

  test("pdf-to-images exports zip", async ({ page }) => {
    await gotoTool(page, "pdf-to-images");
    await uploadFiles(page, fixture("doc-report.pdf"));
    await clickPrimary(page, /Run|Convert/i);
    await expectDone(page);
    await expectDownloadReady(page);
  });
});
