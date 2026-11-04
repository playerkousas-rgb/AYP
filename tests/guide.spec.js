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
  await page.click("#home-nav");
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


test("首次使用精靈、導覽焦點及待辦跨重載保留", async ({ page }) => {
  await expect(page.locator("body")).toHaveAttribute("data-view", "quick");
  await page.click("[data-wz-role='scout']");
  await page.click("[data-wz-status='doing']");
  const checked = page.locator("#wz-result [data-todo]").first();
  await checked.check();
  await expect(page.locator("#wz-result [data-todo]").first()).toBeFocused();
  await page.reload();
  await page.click("#topbar [data-tt='quick']");
  await page.click("[data-wz-role='scout']");
  await page.click("[data-wz-status='doing']");
  await expect(page.locator("#wz-result [data-todo]").first()).toBeChecked();
  await page.click("#home-nav");
  await expect(page.locator("#overview-title")).toBeFocused();
});

test("章級資料獨立保存及曆月估算", async ({ page }) => {
  await page.click("#home-nav");
  await page.locator("#calc-h-service").fill("13");
  await page.locator("#calc-h-service").blur();
  await page.click("[data-calc-path='directGold']");
  await expect(page.locator("#calc-h-service")).toHaveValue("0");
  await page.locator("#calc-gold-date").fill("2024-04-30");
  await expect(page.locator(".gold-dl")).toContainText("2024-02-29");
  await page.locator("#calc-h-service").fill("21");
  await page.locator("#calc-h-service").blur();
  await page.click("[data-calc-path='bronze']");
  await expect(page.locator("#calc-h-service")).toHaveValue("13");
  await page.reload();
  await page.click("[data-calc-path='directGold']");
  await expect(page.locator("#calc-h-service")).toHaveValue("21");
  await expect(page.locator("#calc-gold-date")).toHaveValue("2024-04-30");
});

test("搜尋已取消徽章只顯示符合項目和組別", async ({ page }) => {
  await page.click("#bottombar [data-tv='bt-conv']");
  await page.locator("#conv-search-inp").fill("營地管理");
  const items = page.locator(".badge-cancel-alert li");
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText("營地管理");
  await expect(page.locator(".badge-cancel-alert")).toContainText("其他組別");
});

test("英語版分類、返回總覽與資料提示", async ({ page }) => {
  await page.click("#fab-lang");
  await page.click("#bottombar [data-tv='bt-forms']");
  await expect(page.locator("#bt-forms-summary")).toHaveText("Forms & comment drafts");
  await page.click("[data-form-cat='章級完成']");
  await expect(page.locator("#bt-forms-body table.forms")).toContainText("Award completion");
  await page.click("#view-bt-forms [data-tv-home]");
  await expect(page.locator("#privacy-note")).toContainText("Vercel Web Analytics");
  await expect(page.locator("#overview-title")).toBeFocused();
});

test("安裝快取後離線可開啟，非頁面資源不回傳 HTML", async ({ page, context }) => {
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 15000 });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#app-title")).toHaveText("AYP 童軍接駁指南");
  const result = await page.evaluate(async () => {
    const response = await fetch("./missing-resource.js");
    return { status: response.status, type: response.headers.get("content-type"), body: await response.text() };
  });
  expect(result.status).toBe(503);
  expect(result.type).toMatch(/^text\/plain/);
  expect(result.body).not.toMatch(/<html/i);
});

test("開合狀態在重繪及重新載入後保留", async ({ page }) => {
  await page.click("#home-nav");
  const beginner = page.locator("details[data-key='beg-sworn']");
  const timeline = page.locator("details[data-key='res-tl']");
  await beginner.locator("summary").click();
  await timeline.locator("summary").click();
  await expect.poll(async () => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("ayp-guide-open-v2") || "{}");
    return Boolean(state["beg-sworn"] && state["res-tl"]);
  })).toBe(true);
  await page.click("#fab-lang");
  await expect(page.locator("details[data-key='beg-sworn']")).toHaveAttribute("open", "");
  await expect(page.locator("details[data-key='res-tl']")).toHaveAttribute("open", "");
  await page.reload();
  await expect(page.locator("details[data-key='beg-sworn']")).toHaveAttribute("open", "");
  await expect(page.locator("details[data-key='res-tl']")).toHaveAttribute("open", "");
});

test("私隱清除會移除進度與考驗人員資料", async ({ page }) => {
  page.on("dialog", dialog => dialog.accept());
  await page.click("#home-nav");
  await page.locator("#calc-h-service").fill("12");
  await page.locator("#calc-h-service").blur();
  await page.click("#bottombar [data-tv='bt-sync']");
  await page.locator("#ea-assessorName").fill("Example assessor");
  await page.click("#home-nav");
  await page.click("#privacy-clear");
  await expect(page.locator("#privacy-result")).toContainText("已清除");
  await page.reload();
  await expect(page.locator("#calc-h-service")).toHaveValue("0");
  await page.click("#bottombar [data-tv='bt-sync']");
  await expect(page.locator("#ea-assessorName")).toHaveValue("");
});

test("手機、平板、桌面與英文介面無橫向溢出", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const selector of ["#topbar [data-tt='quick']", "#home-nav", "#bottombar [data-tv='bt-forms']", "#bottombar [data-tv='bt-conv']"]) {
      await page.click(selector);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.click("#fab-lang");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
