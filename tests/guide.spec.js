/* Playwright 回歸測試（需瀏覽器；本機可用 jsdom dom-test.js 替代） */
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.TEST_BASE_URL || "http://localhost:8000/index.html");
});

test("標題同基準日顯示", async ({ page }) => {
  await expect(page).toHaveTitle(/AYP 童軍接駁指南/);
  await expect(page.locator("#baseline-foot")).toContainText("2026");
});

test("正常流程：行動卡可以剔", async ({ page }) => {
  const box = page.locator("#normal-card [data-todo]").first();
  await box.click();
  await expect(box).toBeChecked();
});

test("同步方案 2 階段＋不可追溯警告", async ({ page }) => {
  await page.click("#bottombar [data-tv='bt-sync']");
  const body = page.locator("#bt-sync-body");
  await expect(body).toContainText("童軍高級獎章");
  await expect(body).toContainText("漸進銀章");
  await expect(body).toContainText("不可追溯");
});

test("單項銜接表有非官方標籤＋追溯警告＋評核員核實", async ({ page }) => {
  await page.click("#bottombar [data-tv='bt-conv']");
  const body = page.locator("#bt-conv-body");
  await expect(body).toContainText("非官方整理");
  await expect(body).toContainText("不可追溯");
  await expect(body).toContainText("評核員");
});

test("轉入計數機：剔一科後缺失減少", async ({ page }) => {
  await page.click("#topbar [data-tt='f1']");
  const gaps = page.locator("#ti-inner .gap");
  const before = await gaps.count();
  await page.locator("#ti-inner [data-sec]").first().click();
  const after = await gaps.count();
  expect(after).toBeLessThan(before);
});

test("轉入頁頂有不可追溯警告", async ({ page }) => {
  await page.click("#topbar [data-tt='f1']");
  await expect(page.locator("#f1-backdate")).toContainText("不可追溯");
});

test("銜接頁頂有不可追溯警告", async ({ page }) => {
  await page.click("#topbar [data-tt='f2']");
  await expect(page.locator("#f2-backdate")).toContainText("不可追溯");
});

test("升團警告提醒轉執行處要辦 AYP/09", async ({ page }) => {
  await page.click("#topbar [data-tt='f3']");
  await expect(page.locator("#f3-warn")).toContainText("AYP/09");
});

test("FAQ 可開合", async ({ page }) => {
  await page.click("#bottombar [data-tv='bt-faq']");
  const first = page.locator("#faq-list details.part").first();
  await first.locator("summary").click();
  await expect(first.locator(".part-body")).toBeVisible();
});

test("官方來源有總會通告一覽連結", async ({ page }) => {
  await expect(page.locator("#sources a[href*='circulars-forms/circulars']")).toHaveCount(1);
});

test("手機排版：窄螢幕無橫向溢出", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
