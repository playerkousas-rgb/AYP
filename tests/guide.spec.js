/* Playwright 回歸測試（需瀏覽器；本機可用 jsdom dom-test.js 替代） */
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.TEST_BASE_URL || "http://localhost:8000/index.html");
});

test("標題同基準日顯示", async ({ page }) => {
  await expect(page).toHaveTitle(/AYP 童軍接駁指南/);
  await expect(page.locator("#baseline-foot")).toContainText("2026");
});

test("五科速查：切級別出對應要求", async ({ page }) => {
  await page.click("#level-chooser .chip[data-level='gold']");
  await expect(page.locator("#req-table")).toContainText("團體生活科");
  await expect(page.locator("#req-table")).toContainText("4 日 3 夜");
});

test("同步方案 2 階段顯示", async ({ page }) => {
  await expect(page.locator("#sync-plan")).toContainText("童軍高級獎章");
  await expect(page.locator("#sync-plan")).toContainText("漸進銀章");
});

test("接駁指南有 5 個場景", async ({ page }) => {
  await expect(page.locator("#transfer-list .transfer")).toHaveCount(5);
});

test("FAQ 可開合", async ({ page }) => {
  const first = page.locator("#faq-list .faq").first();
  await first.click();
  await expect(first.locator(".part-body")).toBeVisible();
});

test("手機排版：窄螢幕無橫向溢出", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
