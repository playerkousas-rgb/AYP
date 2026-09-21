/* 快速 DOM 渲染測試（無瀏覽器環境下用 jsdom） */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const dataJs = fs.readFileSync(path.join(root, "data.js"), "utf8");
const appJs = fs.readFileSync(path.join(root, "app.js"), "utf8");

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: "http://localhost/" });
const { window } = dom;
let errors = [];
window.addEventListener("error", (e) => errors.push(e.message));
try { window.eval(dataJs + "\n;" + appJs); } catch (e) { errors.push("eval error: " + e.message); }
window.scrollTo = function () {};
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

// 🚫 不可追溯（No Backdating）警告
ok("轉入頁頂有不可追溯警告", /不可追溯|No Backdating/i.test(window.document.getElementById("f1-backdate").textContent));
ok("銜接頁頂有不可追溯警告", /不可追溯|No Backdating/i.test(window.document.getElementById("f2-backdate").textContent));
ok("轉入計數機內有不可追溯警告", /不可追溯|No Backdating/i.test(window.document.getElementById("ti-inner").textContent));
ok("同步方案工具有不可追溯警告", /不可追溯|No Backdating/i.test(window.document.getElementById("bt-sync-body").textContent));
ok("單項銜接表工具有不可追溯警告", /不可追溯|No Backdating/i.test(window.document.getElementById("bt-conv-body").textContent));
ok("單項銜接表強調須評核員核實", /評核員|Assessor/.test(window.document.getElementById("bt-conv-body").textContent));
ok("升團警告區分轉執行處手續（AYP/09）", /FORM AYP\/09/.test(window.document.getElementById("f3-warn").textContent));
ok("官方來源有總會通告一覽連結", window.document.querySelectorAll("#sources a[href*='circulars-forms/circulars']").length >= 1);
ok("FAQ 有不可追溯條目", /追溯/.test(window.document.getElementById("faq-list").textContent));
ok("辭典有開展日條目", /開展日|Start Date/.test(window.document.getElementById("glossary-list").textContent));
ok("辭典有銜接（認可）條目", /銜接（認可）|Bridging \(Recognition\)/.test(window.document.getElementById("glossary-list").textContent));

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

// 📱 APP：置頂 5 情景＋置底 5 工具，預設正常流程
ok("置頂 5 格情景", window.document.querySelectorAll("#topbar .tb-btn").length === 5);
ok("置底 5 格工具", window.document.querySelectorAll("#bottombar .bb-btn").length === 5);
ok("置頂 5 格圖示上文字下（與置底對齊）", window.document.querySelectorAll("#topbar .tb-btn .tb-ico").length === 5);
ok("置底 5 格圖示上文字下", window.document.querySelectorAll("#bottombar .bb-btn .bb-ico").length === 5);
ok("首次進入自動進精靈", window.document.body.dataset.view === "quick");
ok("精靈再撳一次返正常流程", (() => {
  const btn = window.document.querySelector("#topbar [data-tt='quick']");
  if (!btn) return false;
  btn.click();
  return window.document.body.dataset.view === "normal" && !btn.classList.contains("active");
})());
ok("正常流程有行動卡", !!window.document.querySelector("#normal-card .plan-card"));
ok("正常流程齊料（Check/步驟/時間表/領獎/來源）", ["beginner", "f4", "comp", "sources-sec"].every(id =>
  !!window.document.querySelector("#view-normal #" + id)) &&
  !!window.document.querySelector('#view-normal [data-key="res-tl"]') &&
  !!window.document.querySelector("#view-normal #disclaimer"));
ok("詳情預設收埋（中間唔長）", ["f4-1", "res-tl", "comp"].every(k =>
  !!window.document.querySelector('.part[data-key="' + k + '"]') && !window.document.querySelector('.part[data-key="' + k + '"]').open) &&
  window.document.querySelectorAll("#beginner-list .part[open]").length === 0);
ok("5 個情景 view", ["quick", "f1", "f2", "f3", "f5"].every(id => !!window.document.getElementById(id)));
ok("5 個工具 view", ["view-bt-sync", "view-bt-conv", "view-bt-forms", "view-bt-oa", "view-bt-faq"].every(id => !!window.document.getElementById(id)));
ok("撳置頂格切情景", (() => {
  const btn = window.document.querySelector("#topbar [data-tt='f1']");
  if (!btn) return false;
  btn.click();
  return window.document.body.dataset.view === "f1" && btn.classList.contains("active");
})());
ok("撳返置頂同一格返正常流程", (() => {
  const btn = window.document.querySelector("#topbar [data-tt='f1']");
  btn.click();
  return window.document.body.dataset.view === "normal" && !btn.classList.contains("active");
})());
ok("行動卡待辦可剔", (() => {
  const box = window.document.querySelector("#normal-card [data-todo]");
  if (!box) return false;
  box.checked = true;
  box.dispatchEvent(new window.Event("change", { bubbles: true }));
  const box2 = window.document.querySelector("#normal-card [data-todo]");
  return box2 && box2.checked === true;
})());
ok("行動卡詳情掣展開步驟", (() => {
  const det = window.document.querySelector("#normal-card [data-normal-detail]");
  const target = window.document.querySelector('.part[data-key="f4-1"]');
  if (!det || !target) return false;
  det.click();
  return target.open === true;
})());

// 📌 置底 4 格工具：㩒即成版切換
ok("撳置底格切到工具 view", (() => {
  const btn = window.document.querySelector("#bottombar [data-tv='bt-conv']");
  if (!btn) return false;
  btn.click();
  return window.document.body.dataset.view === "bt-conv" && btn.classList.contains("active");
})());
ok("撳返置底同一格返正常流程", (() => {
  const btn = window.document.querySelector("#bottombar [data-tv='bt-conv']");
  btn.click();
  return window.document.body.dataset.view === "normal" && !btn.classList.contains("active");
})());
ok("工具 view 內返正常流程掣", (() => {
  window.document.querySelector("#bottombar [data-tv='bt-oa']").click();
  const back = window.document.querySelector("#view-bt-oa [data-tv-home]");
  if (!back) return false;
  back.click();
  return window.document.body.dataset.view === "normal";
})());

// 🧰 4 工具 view 內容（同步方案／單項兌換表／開展表格／查執行處）
ok("5 工具 view 標題齊全", ["bt-sync-summary", "bt-conv-summary", "bt-forms-summary", "bt-oa-summary", "bt-faq-summary"].every(id => {
  const el = window.document.getElementById(id); return el && el.textContent.length > 2;
}));
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
ok("5 工具 view 返正常流程掣齊全", ["view-bt-sync", "view-bt-conv", "view-bt-forms", "view-bt-oa", "view-bt-faq"].every(id =>
  !!window.document.querySelector("#" + id + " [data-tv-home]")));

// 互動：精靈揀身份+情況 → 出行動卡
{
  window.document.querySelector("#wizard [data-wz-role='scout']").click();
  window.document.querySelector("#wizard [data-wz-status='doing']").click();
  const res = window.document.getElementById("wz-result");
  ok("行動卡出現", !!res.querySelector(".plan-card"));
  ok("行動卡 3 步待辦", res.querySelectorAll(".todo li").length === 3);
  ok("行動卡有搵邊個", /搵邊個|Who to ask/.test(res.textContent));
  const plink = res.querySelector(".plan-actions a");
  plink.click();
  ok("行動卡連結跨 view 跳轉", window.document.body.dataset.view === "f1");
  window.document.querySelector("#wizard [data-wz-status='fresh']").click();
  const plink2 = window.document.getElementById("wz-result").querySelector(".plan-actions a");
  plink2.click();
  ok("fresh 行動卡去正常流程＋開詳情", window.document.body.dataset.view === "normal" &&
    !!window.document.querySelector('.part[data-key="f4-1"]').open);
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
  ok("切去英文後置底變 5 工具英文標籤", (() => {
    const txt = window.document.getElementById("bottombar").textContent;
    return /Sync Plan/.test(txt) && /Recognition/.test(txt) && /Start Forms/.test(txt) && /Find OA/.test(txt) && /FAQ/.test(txt);
  })());
  ok("切去英文後置頂變 5 情景英文標籤", (() => {
    const txt = window.document.getElementById("topbar").textContent;
    return /Wizard/.test(txt) && /Transfer/.test(txt) && /Bridging/.test(txt) && /Advance/.test(txt) && /More/.test(txt);
  })());
  ok("切去英文後行動卡＋FAQ＋返正常流程變英文", /You're at the starting point/.test(window.document.getElementById("normal-card").textContent) &&
    /FAQ & Glossary/.test(window.document.getElementById("bt-faq-summary").textContent) &&
    /Normal Flow/.test(window.document.querySelector("#view-bt-sync .tv-back-label").textContent));
  ok("切去英文後 TI 有內容", innerLen("ti-inner") > 150);
  ok("切去英文後 FAQ 有內容", innerLen("faq-list") > 50);
  ok("切去英文後 disclaimer 有內容", innerLen("disclaimer") > 50);
  ok("切去英文後同步方案變英文", /Simultaneous Completion Scheme/.test(window.document.getElementById("bt-sync-summary").textContent));
  ok("切去英文後兌換表變英文", /Unofficial compilation/.test(window.document.getElementById("bt-conv-body").textContent));
  ok("切去英文後查執行處變英文", /Find Your Operating Authority/.test(window.document.getElementById("bt-oa-summary").textContent));
  ok("切去英文後不可追溯警告變英文", /official start date/i.test(window.document.getElementById("f1-backdate").textContent));
  langBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  ok("切返中文後標題變回中文", /AYP 童軍接駁指南/.test(window.document.title));
  ok("切返中文後同步方案變回中文", /同步完成方案/.test(window.document.getElementById("bt-sync-summary").textContent));
  ok("切返中文後置底變回 5 工具中文標籤", (() => {
    const txt = window.document.getElementById("bottombar").textContent;
    return /同步方案/.test(txt) && /單項銜接表/.test(txt) && /開展表格/.test(txt) && /查執行處/.test(txt) && /FAQ/.test(txt);
  })());
  ok("切返中文後置頂變回情景中文標籤", (() => {
    const txt = window.document.getElementById("topbar").textContent;
    return /精靈/.test(txt) && /轉入/.test(txt) && /銜接/.test(txt) && /升團/.test(txt) && /其他/.test(txt);
  })());
  ok("切返中文後返正常流程變回中文", /返正常流程/.test(window.document.querySelector("#view-bt-sync .tv-back-label").textContent));
}

// 🐛 回歸守護：開合卡必須全部係 <details>（div.part 係舊 bug：唔可以收合／唔記狀態）
ok("無 div.part 殘留（全部可收合卡均為 details）",
  window.document.querySelectorAll("div.part").length === 0 &&
  window.document.querySelectorAll("details.part").length >= 10);
ok("預設展開嘅靜態卡保持展開（零倒退）",
  ["ti-1", "ti-2", "c2a", "c2b", "f3-1", "res-faq", "res-gl"].every(k => {
    const d = window.document.querySelector(`details.part[data-key="${k}"]`);
    return !!d && d.open;
  }));
ok("預設收埋兼未被測試開啟嘅卡保持收埋", ["res-tl", "comp"].every(k => {
  const d = window.document.querySelector(`details.part[data-key="${k}"]`);
  return !!d && !d.open;
}));
ok("openDetail 可以打開 f4-1（收合機制正常）",
  window.document.querySelector('details.part[data-key="f4-1"]').open === true);
// 🖼️ 頭像 AVIF＋PNG 雙重來源（支援 AVIF 用 AVIF，否則回退 PNG）
ok("header 標誌有 AVIF source＋PNG 回退",
  !!window.document.querySelector("header picture source[type='image/avif'][srcset*='logo-192.avif']") &&
  !!window.document.querySelector("header picture img[src='assets/logo-192.png']"));

let pass = 0, fail = 0;
checks.forEach(([c, n]) => { if (c) pass++; else { fail++; console.log("✗ FAIL:", n); } });
console.log(`\n${pass} 通過 / ${fail} 失敗`);
if (errors.length) console.log("JS 錯誤:", errors);
process.exit(fail === 0 && errors.length === 0 ? 0 : 1);
