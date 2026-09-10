/* 快速 DOM 渲染測試（無瀏覽器環境下用 jsdom） */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const dataJs = fs.readFileSync(path.join(root, "data.js"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
const { window } = dom;
let errors = [];
window.addEventListener("error", (e) => errors.push(e.message));
try { window.eval(dataJs + "\n;" + appJs); } catch (e) { errors.push("eval error: " + e.message); }
window.document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));

function has(id) { return !!window.document.getElementById(id); }
function innerLen(id) { const el = window.document.getElementById(id); return el ? el.innerHTML.length : -1; }

const checks = [];
function ok(name, cond) { checks.push([!!cond, name]); }

// 功能1 轉入
ok("TI 有內容", innerLen("ti-inner") > 150);
ok("TI 3 級別 chip", window.document.querySelectorAll("#ti-inner [data-lv]").length === 3);
ok("TI 剔科 chip >=4", window.document.querySelectorAll("#ti-inner [data-sec]").length >= 4);
ok("TI 顯示缺失科", /仲要完成|Still to complete/.test(window.document.getElementById("ti-inner").textContent));
ok("TI steps 有內容", innerLen("ti-steps") > 40);

// 功能2 兌換
ok("sync 有內容", innerLen("convert-sync") > 60);
ok("sync 含高級獎章", /童軍高級獎章|Scout Advanced Award/.test(window.document.getElementById("convert-sync").textContent));
ok("map 有內容", innerLen("convert-map") > 60);
ok("map 含服務科", /服務科|Service Section/.test(window.document.getElementById("convert-map").textContent));

// 功能3 升團
ok("paths 有內容", innerLen("paths") > 60);
ok("paths 含童軍深資樂行", (/深資童軍|Venture Scout/.test(window.document.getElementById("paths").textContent)) && (/樂行童軍|Rover Scout/.test(window.document.getElementById("paths").textContent)));

// 功能4 流程
ok("join flow 有內容", innerLen("join-flow") > 60);

// 功能5 其他
ok("extra-list 有 6+ 卡", window.document.querySelectorAll("#extra-list .part").length >= 5);
ok("extra-list-2 有卡", window.document.querySelectorAll("#extra-list-2 .part").length >= 2);

// 互動：剔一科後缺失數減少
{
  const secs = window.document.querySelectorAll("#ti-inner [data-sec]");
  const before = (window.document.getElementById("ti-inner").querySelectorAll(".gap").length);
  secs[0].click();
  const after = (window.document.getElementById("ti-inner").querySelectorAll(".gap").length);
  ok("剔一科後缺失減少", after < before);
}

// 其他區塊
ok("faq 有內容", innerLen("faq-list") > 50);
ok("glossary 有內容", innerLen("glossary-list") > 50);
ok("timeline 有內容", innerLen("timeline") > 50);
ok("disclaimer 有內容", innerLen("disclaimer") > 50);
ok("complete 有內容", innerLen("complete-steps") > 40);
ok("sources 有內容", innerLen("sources") > 40);
ok("baseline", window.document.getElementById("baseline-foot").textContent.length > 0);

// ⚡ 5分鐘精靈
ok("精靈 6 身份", window.document.querySelectorAll("#wizard [data-wz-role]").length === 6);
ok("精靈 6 情況", window.document.querySelectorAll("#wizard [data-wz-status]").length === 6);

// 🌱 零基礎 3 Check
ok("零基礎 3 卡", window.document.querySelectorAll("#beginner-list .part").length === 3);
ok("零基礎有對白", /照讀對白|Script to ask/.test(window.document.getElementById("beginner-list").textContent));
ok("零基礎教查支部", /AYP\/10/.test(window.document.getElementById("beginner-list").textContent));
ok("零基礎教查組長", /AYP\/14/.test(window.document.getElementById("beginner-list").textContent));

// 30秒睇懂 + 版權
ok("TLDR 5 段有內容", window.document.querySelectorAll("[data-tldr]").length === 5 &&
  Array.from(window.document.querySelectorAll("[data-tldr]")).every(el => el.textContent.length > 10));
ok("版權 Scout System", /Scout System/.test(window.document.getElementById("copyright-line").textContent));
ok("版權只出現一次 Scout System", (window.document.getElementById("copyright-line").textContent.match(/Scout System/g) || []).length === 1);
ok("置底列＋返頂掣存在", has("bottombar") && has("fab-top"));
ok("fab-lang 喺 header 入面（頂部）", !!window.document.querySelector("header #fab-lang"));
ok("fab-lang 唔喺底部浮動掣區", !window.document.querySelector("#fab-top ~ #fab-lang, #fab-wizard ~ #fab-lang"));

// 🧭 置頂分類列（常駐）
ok("置頂分類列有 9 個分類", window.document.querySelectorAll("nav.toc a").length === 9);
ok("置頂分類列喺 header 下面", (() => {
  const header = window.document.querySelector("header");
  const toc = window.document.querySelector("nav.toc");
  return header && toc && (header.nextElementSibling === toc);
})());

// 📌 置底工具列（常駐）：5 分鐘精靈／轉入試算／兌換／升團／快速工具
ok("置底列有 4-5 個掣", window.document.querySelectorAll("#bottombar .bb-btn").length >= 4 &&
  window.document.querySelectorAll("#bottombar .bb-btn").length <= 5);
ok("置底列掣可撳唔報錯", (() => {
  const btn = window.document.querySelector("#bottombar [data-bb='f1']");
  if (!btn) return false;
  btn.click();
  return true;
})());

// 🧰 快速工具彈層：一㩒彈 4 選項
ok("工具彈層有 4 個選項", window.document.querySelectorAll("#tool-sheet .sheet-opt").length === 4);
ok("撳置底「快速工具」會彈層", (() => {
  const btn = window.document.querySelector("#bottombar [data-bb='bottom-tools']");
  if (!btn) return false;
  btn.click();
  return window.document.getElementById("tool-sheet").classList.contains("open");
})());
ok("撳彈層選項會閂層＋閃目標卡", (() => {
  const opt = window.document.querySelector("#tool-sheet [data-sheet-target='bt-sync']");
  const target = window.document.querySelector(".part[data-key='bt-sync']");
  if (!opt || !target) return false;
  opt.click();
  return !window.document.getElementById("tool-sheet").classList.contains("open") && target.classList.contains("flash");
})());
ok("撳 Esc 會閂彈層", (() => {
  window.document.querySelector("#bottombar [data-bb='bottom-tools']").click();
  const sheet = window.document.getElementById("tool-sheet");
  if (!sheet.classList.contains("open")) return false;
  window.document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  return !sheet.classList.contains("open");
})());

// 🧰 快速工具內容卡（同步方案／單項兌換表／開展表格／查執行處；頁身跳轉掣已抽走）
ok("快速工具 4 張內容卡", window.document.querySelectorAll("#bottom-tools .part").length === 4);
ok("同步方案有試行字眼", /試行|trial/i.test(window.document.getElementById("bt-sync-body").textContent));
ok("同步方案有通知組長警語", /通知.*組長|inform.*Unit Leader/i.test(window.document.getElementById("bt-sync-body").textContent));
ok("單項兌換表有非官方標籤", /非官方整理|Unofficial compilation/.test(window.document.getElementById("bt-conv-body").textContent));
ok("單項兌換表已剔除取消徽章", /愛護動物章|Animal Care Badge/.test(window.document.getElementById("bt-conv-body").textContent));
ok("單項兌換表無列出已取消嘅獨木舟國際賽艇章項目（表格內容），只喺剔除說明中提及", (() => {
  const txt = window.document.getElementById("bt-conv-body").textContent;
  const tables = Array.from(window.document.querySelectorAll("#bt-conv-body table.conv")).map(t => t.textContent).join(" ");
  return /獨木舟國際賽艇/.test(txt) && !/獨木舟國際賽艇/.test(tables);
})());
ok("AYP開展表格含 AYP/01", /AYP\/01/.test(window.document.getElementById("bt-forms-body").textContent));
ok("AYP開展表格有下載連結", window.document.querySelectorAll("#bt-forms-body a[href*='form01.pdf']").length >= 1);
ok("查執行處有 uul_list.pdf 連結", window.document.querySelectorAll("#bt-oa-body a[href*='uul_list.pdf']").length >= 1);
ok("4 張工具卡齊全（sync/conv/forms/oa）", ["bt-sync", "bt-conv", "bt-forms", "bt-oa"].every(k =>
  !!window.document.querySelector(".part[data-key='" + k + "']")));

// 互動：精靈揀身份+情況 → 出行動卡
{
  window.document.querySelector("#wizard [data-wz-role='scout']").click();
  window.document.querySelector("#wizard [data-wz-status='doing']").click();
  const res = window.document.getElementById("wz-result");
  ok("行動卡出現", !!res.querySelector(".plan-card"));
  ok("行動卡 3 步待辦", res.querySelectorAll(".todo li").length === 3);
  ok("行動卡有搵邊個", /搵邊個|Who to ask/.test(res.textContent));
  const box = res.querySelector("[data-todo]");
  box.checked = true;
  box.dispatchEvent(new window.Event("change", { bubbles: true }));
  ok("剔待辦後行動卡仍在", !!window.document.getElementById("wz-result").querySelector(".plan-card"));
}

// 雙語切換
{
  const langBtn = window.document.getElementById("fab-lang");
  ok("語言掣存在", !!langBtn);
  langBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  ok("切去英文後標題變英文", /AYP Scout Bridging Guide/.test(window.document.title));
  ok("切去英文後 html lang=en", window.document.documentElement.lang === "en");
  ok("切去英文後置底列變短標籤", (() => {
    const txt = window.document.getElementById("bottombar").textContent;
    return /Wizard/.test(txt) && /Calc/.test(txt) && /Convert/.test(txt) && /Bridge/.test(txt) && !/5-Min Wizard/.test(txt);
  })());
  ok("切去英文後彈層標題變英文", /Quick Tools/.test(window.document.getElementById("sheet-title").textContent));
  ok("切去英文後 TI 有內容", innerLen("ti-inner") > 150);
  ok("切去英文後 FAQ 有內容", innerLen("faq-list") > 50);
  ok("切去英文後 disclaimer 有內容", innerLen("disclaimer") > 50);
  ok("切去英文後同步方案變英文", /Simultaneous Completion Scheme/.test(window.document.getElementById("bt-sync-summary").textContent));
  ok("切去英文後兌換表變英文", /Unofficial compilation/.test(window.document.getElementById("bt-conv-body").textContent));
  ok("切去英文後查執行處變英文", /Find Your Operating Authority/.test(window.document.getElementById("bt-oa-summary").textContent));
  langBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  ok("切返中文後標題變回中文", /AYP 童軍接駁指南/.test(window.document.title));
  ok("切返中文後同步方案變回中文", /同步完成方案/.test(window.document.getElementById("bt-sync-summary").textContent));
  ok("切返中文後置底列變回中文", /5分鐘精靈/.test(window.document.getElementById("bottombar").textContent));
}

let pass = 0, fail = 0;
checks.forEach(([c, n]) => { if (c) pass++; else { fail++; console.log("✗ FAIL:", n); } });
console.log(`\n${pass} 通過 / ${fail} 失敗`);
if (errors.length) console.log("JS 錯誤:", errors);
process.exit(fail === 0 && errors.length === 0 ? 0 : 1);
