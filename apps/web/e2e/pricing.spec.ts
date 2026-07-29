import { test, expect } from "@playwright/test";

test.describe("Pricing page", () => {
  test("shows Free, Pro, Business and updates seat totals", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/pricing");

    await expect(
      page.getByRole("heading", { name: /Choose the plan that suits you/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Free", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pro", exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Business", exact: true }),
    ).toBeVisible();

    // Yearly default — effective monthly ~₹225
    await expect(page.getByText(/₹225\s*\/\s*month/i)).toBeVisible();
    await expect(page.getByText(/₹2,699 billed annually/i)).toBeVisible();

    await page.getByRole("button", { name: "Monthly Billing" }).click();
    await expect(page.getByText("Billed monthly")).toBeVisible();
    await expect(page.getByText("₹399")).toBeVisible();

    await page.getByRole("button", { name: "Increase seats" }).click();
    await expect(page.getByLabel("Number of Pro seats")).toHaveValue("2");
    await expect(page.getByText("₹798")).toBeVisible();

    await expect(
      page.getByRole("button", { name: /Log in to Go Pro|Go Pro/i }).first(),
    ).toBeVisible();

    await page.getByRole("link", { name: /Start for free/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("pricing is linked from footer", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Pricing" })
      .first()
      .click();
    await expect(page).toHaveURL(/\/pricing/);
  });
});
