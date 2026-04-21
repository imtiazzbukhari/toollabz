import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home loads and skip link is focusable", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Toollabz/i);
    const skip = page.getByRole("link", { name: /skip to main content/i });
    await skip.focus();
    await expect(skip).toBeFocused();
  });

  test("tools directory search input is available", async ({ page }) => {
    await page.goto("/tools");
    await expect(page.getByRole("searchbox", { name: /search tools/i })).toBeVisible();
  });

  test("ROI calculator produces a result", async ({ page }) => {
    await page.goto("/tools/roi-calculator", { waitUntil: "domcontentloaded" });
    const gain = page.getByLabel("Gain", { exact: true });
    const cost = page.getByLabel("Cost", { exact: true });
    await expect(gain).toBeVisible();
    await gain.click();
    await gain.fill("");
    await gain.pressSequentially("150");
    await cost.click();
    await cost.fill("");
    await cost.pressSequentially("50");
    await expect(gain).toHaveValue("150");
    await expect(cost).toHaveValue("50");
    await page.getByRole("button", { name: "Calculate" }).click();
    const resultsPanel = page.getByRole("complementary", { name: /your results/i });
    await expect(resultsPanel.getByText("300.00%").first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: /copy result/i })).toBeVisible();
  });
});
