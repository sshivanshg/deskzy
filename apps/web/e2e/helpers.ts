import path from "path";
import { expect, type Page } from "@playwright/test";

export const fixturesDir = path.join(__dirname, "fixtures");

export function fixture(...parts: string[]) {
  return path.join(fixturesDir, ...parts);
}

export async function gotoTool(page: Page, slug: string) {
  await page.goto(`/tools/${slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

export async function uploadFiles(page: Page, files: string | string[]) {
  const list = Array.isArray(files) ? files : [files];
  const input = page.locator('input[type="file"]');
  await expect(input).toBeAttached();
  await input.setInputFiles(list);
}

export async function clickPrimary(page: Page, label?: string | RegExp) {
  const btn = label
    ? page.locator("button.btn-primary").filter({ hasText: label })
    : page.locator("button.btn-primary").first();
  await expect(btn.first()).toBeEnabled({ timeout: 10_000 });
  await btn.first().click();
}

export async function expectDone(page: Page) {
  await expect(page.getByText("Done", { exact: true })).toBeVisible({
    timeout: 45_000,
  });
}

export async function expectDownloadReady(page: Page) {
  await expect(page.getByRole("link", { name: /Download/i })).toBeVisible({
    timeout: 45_000,
  });
}

export async function fillTextarea(page: Page, value: string) {
  const area = page.locator("textarea");
  await expect(area).toBeVisible();
  await area.fill(value);
}

export async function createWebpViaBrowser(page: Page): Promise<string> {
  // Produce a small webp blob in-page and write to fixtures via download path is hard;
  // instead return a data URL and convert using convert-image tool flow.
  const buffer = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.fillStyle = "#1f6b57";
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "#fff";
    ctx.fillRect(12, 12, 40, 40);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.9),
    );
    if (!blob) throw new Error("webp unsupported");
    const ab = await blob.arrayBuffer();
    return Array.from(new Uint8Array(ab));
  });
  const out = fixture("sample.webp");
  const fs = await import("fs");
  fs.writeFileSync(out, Buffer.from(buffer));
  return out;
}
