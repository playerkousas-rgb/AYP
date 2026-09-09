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
ok("TI 顯示缺失科", /仲要完成/.test(window.document.getElementById("ti-inner").textContent));
ok("TI steps 有內容", innerLen("ti-steps") > 40);

// 功能2 兌換
ok("sync 有內容", innerLen("convert-sync") > 60);
ok("sync 含高級獎章", /童軍高級獎章/.test(window.document.getElementById("convert-sync").textContent));
ok("map 有內容", innerLen("convert-map") > 60);
ok("map 含服務科", /服務科/.test(window.document.getElementById("convert-map").textContent));

// 功能3 升團
ok("paths 有內容", innerLen("paths") > 60);
ok("paths 含童軍深資樂行", /深資童軍/.test(window.document.getElementById("paths").textContent) && /樂行童軍/.test(window.document.getElementById("paths").textContent));

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
ok("零基礎有對白", /照讀對白/.test(window.document.getElementById("beginner-list").textContent));
ok("零基礎教查支部", /AYP\/10/.test(window.document.getElementById("beginner-list").textContent));
ok("零基礎教查組長", /AYP\/14/.test(window.document.getElementById("beginner-list").textContent));

// 30秒睇懂 + 版權
ok("TLDR 5 段有內容", window.document.querySelectorAll("[data-tldr]").length === 5 &&
  Array.from(window.document.querySelectorAll("[data-tldr]")).every(el => el.textContent.length > 10));
ok("版權 Scout System", /Scout System/.test(window.document.getElementById("copyright-line").textContent));
ok("浮動掣存在", has("fab-wizard") && has("fab-top"));

// 互動：精靈揀身份+情況 → 出行動卡
{
  window.document.querySelector("#wizard [data-wz-role='scout']").click();
  window.document.querySelector("#wizard [data-wz-status='doing']").click();
  const res = window.document.getElementById("wz-result");
  ok("行動卡出現", !!res.querySelector(".plan-card"));
  ok("行動卡 3 步待辦", res.querySelectorAll(".todo li").length === 3);
  ok("行動卡有搵邊個", /搵邊個/.test(res.textContent));
  const box = res.querySelector("[data-todo]");
  box.checked = true;
  box.dispatchEvent(new window.Event("change", { bubbles: true }));
  ok("剔待辦後行動卡仍在", !!window.document.getElementById("wz-result").querySelector(".plan-card"));
}

let pass = 0, fail = 0;
checks.forEach(([c, n]) => { if (c) pass++; else { fail++; console.log("✗ FAIL:", n); } });
console.log(`\n${pass} 通過 / ${fail} 失敗`);
if (errors.length) console.log("JS 錯誤:", errors);
process.exit(fail === 0 && errors.length === 0 ? 0 : 1);
