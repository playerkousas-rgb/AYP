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

// 避免 location.origin 問題唔影響（唔用 fetch）
window.addEventListener = window.addEventListener.bind(window);

let errors = [];
window.addEventListener("error", (e) => errors.push(e.message));

try {
  // 同一 eval scope 內合併執行（模擬瀏覽器共享 global lexical scope）
  window.eval(dataJs + "\n;" + appJs);
} catch (e) {
  errors.push("eval error: " + e.message);
}

// 觸發 DOMContentLoaded
window.document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));

function has(id) { return !!window.document.getElementById(id); }
function innerLen(id) { const el = window.document.getElementById(id); return el ? el.innerHTML.length : -1; }

const checks = [];
function ok(name, cond) { checks.push([!!cond, name]); }

ok("level chooser", has("level-chooser") && innerLen("level-chooser") > 0);
ok("req table 有內容", innerLen("req-table") > 200);
ok("sync plan 有內容", innerLen("sync-plan") > 50);
ok("member paths 有內容", innerLen("member-paths") > 50);
ok("transfer list 有 5 場景", (window.document.querySelectorAll("#transfer-list .transfer").length) === 5);
ok("forms 有內容", innerLen("forms-list") > 50);
ok("glossary 有內容", innerLen("glossary-list") > 50);
ok("faq 有內容", innerLen("faq-list") > 50);
ok("timeline 有內容", innerLen("timeline") > 50);
ok("disclaimer 有內容", innerLen("disclaimer") > 50);
ok("baseline foot 有字", window.document.getElementById("baseline-foot").textContent.length > 0);

// 切換級別測試
const chips = window.document.querySelectorAll("#level-chooser .chip");
ok("有 3 個級別 chip", chips.length === 3);
if (chips.length === 3) {
  chips[1].click();
  const t = window.document.getElementById("req-table").textContent;
  ok("切到銀章顯示銀", /銀章級/.test(t));
  chips[2].click();
  const t2 = window.document.getElementById("req-table").textContent;
  ok("切到金章含團體生活", /團體生活科/.test(t2));
}

// 輸出
let pass = 0, fail = 0;
checks.forEach(([c, n]) => { if (c) { pass++; } else { fail++; console.log("✗ FAIL:", n); } });
console.log(`\n${pass} 通過 / ${fail} 失敗`);
if (errors.length) { console.log("JS 錯誤:", errors); }
process.exit(fail === 0 && errors.length === 0 ? 0 : 1);
