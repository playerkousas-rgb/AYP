/* Behavioural regression tests for dates, persistence, search, privacy and copy. */
process.env.TZ = "Asia/Hong_Kong";
const { JSDOM } = require("jsdom");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const source = fs.readFileSync(path.join(root, "data.js"), "utf8") + "\n;" + fs.readFileSync(path.join(root, "app.js"), "utf8");
const tick = () => new Promise(resolve => setTimeout(resolve, 10));
let passed = 0;

async function boot({ data = {}, storage } = {}) {
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: "https://guide.example/" });
  const w = dom.window;
  await new Promise(resolve => w.addEventListener("load", resolve, { once: true }));
  const NativeDate = w.Date;
  class FixedDate extends NativeDate {
    constructor(...args) { super(...(args.length ? args : ["2026-11-04T04:00:00Z"])); }
    static now() { return new NativeDate("2026-11-04T04:00:00Z").getTime(); }
  }
  w.Date = FixedDate;
  w.scrollTo = () => {};
  w.confirm = () => true;
  if (storage) Object.defineProperty(w, "localStorage", { configurable: true, value: storage });
  else Object.entries(data).forEach(([k, v]) => w.localStorage.setItem(k, v));
  const errors = [];
  w.addEventListener("error", e => errors.push(e.message));
  w.eval(source);
  w.document.dispatchEvent(new w.Event("DOMContentLoaded", { bubbles: true }));
  await tick();
  return { dom, w, errors };
}
function $(w, selector) {
  const el = w.document.querySelector(selector);
  assert.ok(el, `missing element ${selector}`);
  return el;
}
function change(w, selector, value) {
  const el = $(w, selector);
  el.value = value;
  el.dispatchEvent(new w.Event("change", { bubbles: true }));
}
function input(w, selector, value) {
  const el = $(w, selector);
  el.value = value;
  el.dispatchEvent(new w.Event("input", { bubbles: true }));
}
function checked(w, selector, value = true) {
  const el = $(w, selector);
  el.checked = value;
  el.dispatchEvent(new w.Event("change", { bubbles: true }));
}
function test(name, fn) {
  try { fn(); passed++; }
  catch (error) { error.message = `${name}: ${error.message}`; throw error; }
}

(async () => {
  const session = await boot();
  const { w } = session;
  test("first visit and global context", () => {
    assert.equal(w.document.body.dataset.view, "quick");
    assert.match($(w, "#header-note").textContent, /非官方/);
    assert.ok($(w, "#global-source").href.startsWith("https://www.ayp.org.hk"));
    assert.equal($(w, "#topbar [data-tt='quick']").getAttribute("aria-current"), "page");
  });
  $(w, "#wizard [data-wz-status='fresh']").click();
  test("wizard does not produce a plan until both questions are answered", () => {
    assert.equal(w.document.querySelector("#wz-result .plan-card"), null);
    assert.equal($(w, "#wizard [data-wz-status='fresh']").getAttribute("aria-pressed"), "true");
    assert.match($(w, ".wz-step-label").textContent, /第 1 步/);
  });
  $(w, "#wizard [data-wz-role='scout']").click();
  test("wizard selection and focus survive rerender", () => {
    assert.ok($(w, "#wz-result .plan-card"));
    assert.equal(w.document.activeElement.dataset.wzRole, "scout");
  });
  $(w, "#home-nav").click();
  test("overview navigation focuses its heading", () => {
    assert.equal(w.document.body.dataset.view, "normal");
    assert.equal(w.document.activeElement.id, "overview-title");
    assert.equal($(w, "#home-nav").getAttribute("aria-current"), "page");
  });

  test("reduced-motion preferences disable smooth scrolling", () => {
    let behavior;
    w.matchMedia = () => ({ matches: true });
    w.Element.prototype.scrollIntoView = function (options) { behavior = options.behavior; };
    $(w, "[data-pw-jump='calc']").click();
    assert.equal(behavior, "auto");
    delete w.Element.prototype.scrollIntoView;
    delete w.matchMedia;
  });

  change(w, "#calc-start-date", "2026-01-01");
  test("date estimates use calendar days in Hong Kong without timezone drift", () => {
    assert.match($(w, "#calc-box .sec-date-badge").textContent, /2026-07-02/);
    assert.equal($(w, "#calc-start-date").value, "2026-01-01");
  });
  change(w, "#calc-birth-date", "2010-11-05");
  test("age before birthday is not rounded up", () => {
    assert.match($(w, ".diag-box.age").textContent, /15 歲 11 個月/);
  });
  change(w, "#calc-birth-date", "2000-11-04");
  test("age over 25 does not imply eligibility", () => {
    assert.match($(w, ".diag-box.age").textContent, /25 歲生日前/);
  });
  change(w, "#calc-birth-date", "2028-01-01");
  test("future birth dates show a validation warning", () => {
    assert.match($(w, "#calc-box [role='alert']").textContent, /不是未來/);
  });
  change(w, "#calc-birth-date", "2004-02-29");
  test("leap birthdays require official confirmation", () => {
    assert.match($(w, ".diag-box.age").textContent, /2 月 29 日/);
    assert.doesNotMatch($(w, ".diag-box.age").textContent, /2027-02-28|2029-02-28/);
  });
  change(w, "#calc-h-service", "13");
  change(w, "#calc-w-service", "7");
  $(w, "[data-calc-path='directGold']").click();
  test("different Award paths start with independent progress", () => {
    assert.equal($(w, "#calc-h-service").value, "0");
    assert.equal($(w, "#calc-start-date").value, "");
    assert.equal($(w, "#calc-birth-date").value, "2004-02-29");
  });
  change(w, "#calc-gold-date", "2024-04-30");
  test("Gold estimate uses calendar months and leap-year month ends", () => {
    assert.match($(w, ".diag-box.gold-dl").textContent, /2024-02-29/);
    assert.match($(w, ".diag-box.gold-dl").textContent, /2024-02-14/);
    assert.match($(w, ".diag-box.gold-dl").textContent, /核實/);
  });
  change(w, "#calc-h-service", "21");
  $(w, "[data-calc-main='skill']").click();
  $(w, "[data-calc-path='bronze']").click();
  test("switching paths restores hours, weeks and main section", () => {
    assert.equal($(w, "#calc-h-service").value, "13");
    assert.equal($(w, "#calc-w-service").value, "7");
    assert.equal($(w, "#calc-start-date").value, "2026-01-01");
    assert.equal($(w, "[data-calc-main='service']").getAttribute("aria-pressed"), "true");
  });
  $(w, "[data-calc-path='directGold']").click();
  test("each path retains its own main section and progress", () => {
    assert.equal($(w, "#calc-h-service").value, "21");
    assert.equal($(w, "[data-calc-main='skill']").getAttribute("aria-pressed"), "true");
    assert.equal(w.document.activeElement.dataset.calcPath, "directGold");
  });
  $(w, "#calc-reset-btn").click();
  test("calculator reset clears all paths and dates", () => {
    assert.equal($(w, "#calc-start-date").value, "");
    assert.equal($(w, "#calc-birth-date").value, "");
    assert.equal($(w, "#calc-h-service").value, "0");
    $(w, "[data-calc-path='directGold']").click();
    assert.equal($(w, "#calc-h-service").value, "0");
  });

  $(w, "#bottombar [data-tv='bt-conv']").click();
  input(w, "#conv-search-inp", "營地管理");
  test("cancelled-badge matching only shows the relevant badge", () => {
    assert.equal($(w, "#conv-clear-btn").getAttribute("aria-label"), "清除徽章搜尋");
    const items = w.document.querySelectorAll(".badge-cancel-alert li");
    assert.equal(items.length, 1);
    assert.match($(w, "#bt-conv-body .reference-notice").textContent, /歷史參考/);
    assert.match($(w, "#bt-conv-body .reference-notice").textContent, /可能已過時/);
    assert.match(items[0].textContent, /營地管理/);
    assert.doesNotMatch(items[0].textContent, /愛護動物/);
  });
  $(w, "#conv-clear-btn").click();
  test("clearing search keeps keyboard focus", () => {
    assert.equal(w.document.activeElement.id, "conv-search-inp");
  });
  $(w, "#bottombar [data-tv='bt-forms']").click();
  test("assessor draft starts without invented hours or weeks", () => {
    assert.equal($(w, "#cmt-h-inp").value, "");
    assert.equal($(w, "#cmt-w-inp").value, "");
    assert.match($(w, "#cmt-zh-out").textContent, /填寫時數/);
    assert.match($(w, "#cmt-zh-out").textContent, /按紀錄填寫/);
  });
  input(w, "#cmt-act-inp", "<img src=x onerror=alert(1)>");
  test("comment drafts treat user text as plain text", () => {
    assert.match($(w, "#cmt-zh-out").textContent, /<img/);
    assert.equal(w.document.querySelector("#cmt-zh-out img"), null);
  });
  Object.defineProperty(w.navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("denied"); } } });
  w.document.execCommand = () => false;
  $(w, "#cmt-copy-zh").click();
  await tick();
  test("failed copy reports an error rather than success", () => {
    assert.match($(w, "#cmt-toast").textContent, /無法複製/);
  });
  w.document.execCommand = () => true;
  $(w, "#cmt-copy-zh").click();
  await tick();
  test("copy uses the fallback when clipboard access fails", () => {
    assert.match($(w, "#cmt-toast").textContent, /已複製/);
  });
  input(w, "#form-search-inp", "no-such-form-123");
  test("form search has an empty state", () => {
    assert.match($(w, "#bt-forms-body").textContent, /找不到符合條件/);
  });
  input(w, "#form-search-inp", "");
  test("form links use the verified current directory paths", () => {
    assert.ok(w.document.querySelector("#bt-forms-body a[href$='/7025/form11.pdf']"));
    assert.ok(w.document.querySelector("#bt-forms-body a[href$='/7027/form13.pdf']"));
  });

  test("the linked activity forms explain their applicable scope and lead time", () => {
    const rows = [...w.document.querySelectorAll("#bt-forms-body table.forms tr")];
    for (const code of ["AYP/02", "AYP/03", "AYP/04", "AYP/05", "AYP/06"]) {
      const row = rows.find(el => el.textContent.includes(code));
      assert.ok(row, `missing ${code}`);
      assert.match(row.textContent, /兩個月前/);
      if (code === "AYP/04" || code === "AYP/05") assert.match(row.textContent, /只適用金章/);
    }
  });

  $(w, "#fab-lang").click();
  test("English overview and privacy labels are translated", () => {
    assert.equal(w.document.documentElement.lang, "en");
    assert.match($(w, "#overview-plan-title").textContent, /checklist/i);
    assert.match($(w, "#quick-note").textContent, /reference/i);
    assert.match($(w, "#privacy-note").textContent, /Vercel Web Analytics/);
    assert.match($(w, "#cmt-act-inp").placeholder, /community service/);
    assert.match($(w, "#cmt-en-out").textContent, /Section: Service/);
  });
  $(w, "[data-form-cat='章級完成']").click();
  test("English forms categories and filters work", () => {
    assert.match($(w, "[data-form-cat='章級完成']").textContent, /Award completion/);
    assert.match($(w, "#bt-forms-body table.forms").textContent, /Award completion/);
    assert.equal($(w, "[data-form-cat='章級完成']").getAttribute("aria-pressed"), "true");
  });
  $(w, "#bottombar [data-tv='bt-conv']").click();
  $(w, "[data-conv-sec='服務科']").click();
  test("English Section labels and filters work", () => {
    assert.equal($(w, "[data-conv-sec='服務科']").textContent, "Service");
    const rows = [...w.document.querySelectorAll("#bt-conv-body table.conv .ayp-col")];
    assert.ok(rows.length > 0);
    assert.ok(rows.every(row => /Service/.test(row.textContent)));
  });
  $(w, "#bottombar [data-tv='bt-sync']").click();
  test("assessor records start empty and disclose local storage", () => {
    assert.equal($(w, "#ea-examResult").value, "");
    assert.equal($(w, "#ea-examItems").value, "");
    assert.match($(w, ".privacy-inline").textContent, /browser/);
  });
  input(w, "#ea-assessorName", "Test assessor");
  $(w, "[data-sync-route='silver']").click();
  test("assessor details persist through tool rerenders", () => {
    assert.equal($(w, "#ea-assessorName").value, "Test assessor");
    assert.equal(w.document.activeElement.dataset.syncRoute, "silver");
  });
  $(w, "#ea-clear-btn").click();
  test("assessor details can be cleared", () => {
    assert.equal($(w, "#ea-assessorName").value, "");
    assert.equal(w.localStorage.getItem("ayp-ea-log-v1"), null);
    assert.match($(w, "#ea-toast").textContent, /cleared/i);
  });
  test("unverified trial mappings have a visible warning", () => {
    assert.match($(w, "#bt-sync-body .reference-notice").textContent, /have not been verified/);
    assert.match($(w, "#bt-sync-body").textContent, /does not guarantee a place/);
  });
  for (const box of [...w.document.querySelectorAll("#bt-sync-body [data-sync-chk]")]) {
    checked(w, `[data-sync-chk='${box.dataset.syncChk}']`);
  }
  test("checking every trial item does not imply approval", () => {
    assert.match($(w, "#bt-sync-body .ok-box").textContent, /does not confirm eligibility or completion/);
  });
  checked(w, "[data-sync-chk]", true);
  test("checklist rerender preserves keyboard focus", () => {
    assert.ok(w.document.activeElement.matches("[data-sync-chk]"));
    assert.equal(w.document.activeElement.checked, true);
  });

  // A details toggle from one render must merge with the current saved state.
  const first = $(w, "details[data-key='beg-sworn']");
  first.open = true;
  first.dispatchEvent(new w.Event("toggle"));
  const second = $(w, "details[data-key='f4-1']");
  second.open = true;
  second.dispatchEvent(new w.Event("toggle"));
  $(w, "#fab-lang").click();
  test("multiple details state changes survive a full rerender", () => {
    assert.equal($(w, "details[data-key='beg-sworn']").open, true);
    assert.equal($(w, "details[data-key='f4-1']").open, true);
  });
  $(w, "#home-nav").click();
  $(w, "#privacy-clear").click();
  test("privacy control clears progress while preserving language preference", () => {
    assert.equal(w.localStorage.getItem("ayp-calc-v1"), null);
    assert.equal(w.localStorage.getItem("ayp-sync-chk-v1"), null);
    assert.equal(w.localStorage.getItem("ayp-guide-lang-v1"), "zh-HK");
    assert.match($(w, "#privacy-result").textContent, /清除/);
    assert.equal($(w, "#calc-h-service").value, "0");
    assert.equal($(w, "#cmt-act-inp").value, "");
    assert.equal($(w, "#cmt-h-inp").value, "");
  });
  test("normal interaction has no script errors", () => assert.deepEqual(session.errors, []));
  session.dom.window.close();

  const oldState = JSON.stringify({ path: "bronze", startDate: "2025-01-01", sec: { service: { h: 12, w: 4 } } });
  const legacy = await boot({ data: { "ayp-calc-v1": oldState, "ayp-guide-visited-v1": "1" } });
  test("legacy calculator progress migrates without losing data", () => {
    assert.equal($(legacy.w, "#calc-h-service").value, "12");
    $(legacy.w, "[data-calc-path='directSilver']").click();
    assert.equal($(legacy.w, "#calc-h-service").value, "0");
    $(legacy.w, "[data-calc-path='bronze']").click();
    assert.equal($(legacy.w, "#calc-h-service").value, "12");
    assert.equal($(legacy.w, "#calc-start-date").value, "2025-01-01");
  });
  legacy.dom.window.close();

  const corrupt = await boot({ data: { "ayp-guide-todo-v1": JSON.stringify({ "wz-fresh": true }), "ayp-guide-visited-v1": "1" } });
  checked(corrupt.w, "#normal-card [data-todo]");
  test("malformed saved checklist entries are recovered", () => {
    assert.equal($(corrupt.w, "#normal-card [data-todo]").checked, true);
    assert.deepEqual(corrupt.errors, []);
  });
  corrupt.dom.window.close();

  const stored = new Map([["ayp-calc-v1", oldState], ["ayp-guide-visited-v1", "1"]]);
  const blockedStorage = {
    getItem(k) { return stored.has(k) ? stored.get(k) : null; },
    setItem() { throw new Error("quota exceeded"); },
    removeItem() { throw new Error("storage locked"); }
  };
  const blocked = await boot({ storage: blockedStorage });
  change(blocked.w, "#calc-h-service", "18");
  test("failed writes use the newer in-memory value instead of stale localStorage", () => {
    assert.equal($(blocked.w, "#calc-h-service").value, "18");
    assert.equal($(blocked.w, "#storage-warning").hidden, false);
  });
  $(blocked.w, "#privacy-clear").click();
  test("failed removal does not falsely claim persistent data was deleted", () => {
    assert.match($(blocked.w, "#privacy-result").textContent, /瀏覽器設定/);
    assert.equal($(blocked.w, "#calc-h-service").value, "0");
    assert.ok(stored.has("ayp-calc-v1"));
  });
  test("blocked storage does not cause script errors", () => assert.deepEqual(blocked.errors, []));
  blocked.dom.window.close();

  console.log(`Interaction regressions：${passed} checks passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
