#!/usr/bin/env node
/* ============================================================
   check.js — 部署完整性／防增肥守門（零依賴，Vercel 建置亦會跑）
   規則見 docs/部署瘦身與防增肥規範.md
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));

let fails = 0, warns = 0;
const ok = (cond, name, extra) => {
  console.log(`  ${cond ? "✔" : "✘"} ${name}${extra ? " — " + extra : ""}`);
  if (!cond) fails++;
};
const warn = (name, extra) => { console.log(`  ⚠ ${name}${extra ? " — " + extra : ""}`); warns++; };

/* ── 防增肥預算（byte）── */
const BUDGET_TOTAL = 400000;   // 部署產物總和上限
const BUDGET_ASSETS_TOTAL = 200000; // assets/ 總和上限
const BUDGET_ASSET_SINGLE = 120000; // 單一資產上限

/* ── 0. 必備檔案 ── */
console.log("\n[0] 必備部署檔案");
const CORE = ["index.html", "app.js", "data.js", "sw.js", "manifest.webmanifest"];
for (const f of CORE) ok(exists(f), `存在 ${f}`);

/* ── 1. 資產清單 ── */
const assetFiles = fs.existsSync(path.join(ROOT, "assets"))
  ? fs.readdirSync(path.join(ROOT, "assets")).filter((f) => !f.startsWith("."))
  : [];
console.log("\n[1] assets/ 清單（" + assetFiles.length + " 個）");

/* ── 2. 引用完整性：被引用的必須存在 ── */
console.log("\n[2] 資產引用完整性");
const html = exists("index.html") ? read("index.html") : "";
const manifest = exists("manifest.webmanifest") ? read("manifest.webmanifest") : "";
const swJs = exists("sw.js") ? read("sw.js") : "";
const refsFrom = (text) => new Set([...text.matchAll(/assets\/[A-Za-z0-9._-]+/g)].map((m) => m[0].replace("assets/", "")));
const refHtml = refsFrom(html), refMan = refsFrom(manifest);
const refSw = new Set([...swJs.matchAll(/"\.\/assets\/([A-Za-z0-9._-]+)"/g)].map((m) => m[1]));
const allRefs = new Set([...refHtml, ...refMan, ...refSw]);
for (const r of allRefs) ok(assetFiles.includes(r), `被引用且存在：assets/${r}`);

/* ── 3. 防死重：assets/ 內每個檔案都被引用 ── */
console.log("\n[3] 防死重（無引用資產＝死重）");
for (const f of assetFiles) ok(allRefs.has(f), `assets/${f} 被 index.html／manifest／sw.js 引用`);

/* ── 4. Service Worker 預快取必須＝根檔案＋全部資產 ── */
console.log("\n[4] sw.js 預快取清單一致性");
const swAssets = [...new Set([...swJs.matchAll(/"\.\/(assets\/[A-Za-z0-9._-]+|index\.html|data\.js|app\.js|manifest\.webmanifest|)"/g)].map((m) => "./" + m[1]))];
const expectedSw = ["./", "./index.html", "./data.js", "./app.js", "./manifest.webmanifest",
  ...assetFiles.map((f) => "./assets/" + f)].sort();
ok(JSON.stringify([...swAssets].sort()) === JSON.stringify(expectedSw),
  "sw.js ASSETS ＝ 根檔案 ＋ 全部 assets/", `sw=${swAssets.length} 項 / 應=${expectedSw.length} 項`);

/* ── 5. 雙語資料一致（zh-HK vs en 鍵完全相同）── */
console.log("\n[5] 雙語資料一致性");
let LOCALES = null;
try { LOCALES = new Function(read("data.js") + "\n;return LOCALES;")(); } catch (e) { ok(false, "data.js 可執行", e.message); }
if (LOCALES) {
  const leaf = (o, p, out) => { for (const k of Object.keys(o)) { const v = o[k], np = p ? p + "." + k : k; (v && typeof v === "object" && !Array.isArray(v)) ? leaf(v, np, out) : out.push(np); } return out; };
  const langs = Object.keys(LOCALES);
  ok(langs.includes("zh-HK") && langs.includes("en"), "語言集為 zh-HK＋en", langs.join(","));
  const sets = langs.map((l) => new Set(leaf(LOCALES[l], "", [])));
  const onlyZh = [...sets[0]].filter((k) => !sets[1].has(k));
  const onlyEn = [...sets[1]].filter((k) => !sets[0].has(k));
  ok(onlyZh.length === 0 && onlyEn.length === 0, "zh-HK／en 鍵完全一致", `${sets[0].size} vs ${sets[1].size} 鍵`);
  if (onlyZh.length) console.log("    只在 zh-HK：", onlyZh.join(", "));
  if (onlyEn.length) console.log("    只在 en：", onlyEn.join(", "));

  /* ── 6. app.js 用到的 UI／頂層鍵必須存在 ── */
  console.log("\n[6] app.js 引用的 i18n 鍵");
  const appJs = read("app.js");
  const tKeys = new Set([...appJs.matchAll(/[^A-Za-z0-9_$]t\.([A-Za-z_$][A-Za-z0-9_$]*)/g)].map((m) => m[1]));
  const missingT = [...tKeys].filter((k) => !langs.every((l) => LOCALES[l].UI && k in LOCALES[l].UI));
  ok(missingT.length === 0, `app.js 的 ${tKeys.size} 個 UI 鍵於所有語言存在`, missingT.join(",") || undefined);
  const lKeys = new Set([...appJs.matchAll(/L\(\)\.([A-Za-z_$][A-Za-z0-9_$]*)/g)].map((m) => m[1]));
  const missingL = [...lKeys].filter((k) => !langs.every((l) => k in LOCALES[l]));
  ok(missingL.length === 0, `app.js 的 ${lKeys.size} 個頂層鍵於所有語言存在`, missingL.join(",") || undefined);
  /* 未使用頂層鍵＝潛在必刪內容（只警告） */
  const srcAll = read("app.js") + html;
  for (const k of Object.keys(LOCALES["zh-HK"])) {
    if (!new RegExp("\\b" + k + "\\b").test(srcAll)) warn(`未使用頂層鍵（可考慮刪）：${k}`);
  }
}

/* ── 7. index.html 結構 ── */
console.log("\n[7] index.html 結構");
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
ok(dup.length === 0, "無重複 id", dup.join(",") || undefined);
ok(/src="data\.js"/.test(html) && /src="app\.js"/.test(html), "載入 data.js＋app.js");
ok(/manifest\.webmanifest/.test(html), "連結 manifest");
ok(/serviceWorker/.test(html) && /sw\.js/.test(html), "註冊 service worker");
const appJs = read("app.js");
const idRefs = new Set();
for (const m of appJs.matchAll(/getElementById\("([^"]+)"\)/g)) idRefs.add(m[1]);
for (const m of appJs.matchAll(/\$\$\?\("#([A-Za-z0-9_-]+)"/g)) idRefs.add(m[1]);
const GEN_IDS = new Set(["forms-list", "wz-reset", "wz-result"]); // 已知：wz-* 由精靈產生；forms-list 為保留相容
const missingIds = [...idRefs].filter((r) => !ids.includes(r) && !GEN_IDS.has(r));
ok(missingIds.length === 0, "app.js 引用的 id 均存在（或為動態產生）", missingIds.join(",") || undefined);

/* ── 8. 禁入倉庫的死重副檔名／資料夾 ── */
console.log("\n[8] 死重副檔名／資料夾掃描");
const junk = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if ([".git", "node_modules", "dist", ".vercel"].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/(\.bak|\.tmp|\.old|\.orig|\.log|~)$/.test(e.name) || e.name === ".DS_Store") junk.push(path.relative(ROOT, p));
    if (e.isDirectory() && (e.name === "uploads" || e.name === "coverage")) junk.push(path.relative(ROOT, p) + "/");
  }
})(ROOT);
ok(junk.length === 0, "無 *.bak／*.tmp／*.old／*.log／.DS_Store／uploads", junk.join(", ") || undefined);

/* ── 9. 防增肥預算 ── */
console.log("\n[9] 體積預算（防增肥）");
const size = (p) => fs.statSync(path.join(ROOT, p)).size;
const deploy = [...CORE, ...assetFiles.map((f) => "assets/" + f)];
let total = 0;
for (const f of deploy) total += size(f);
ok(total <= BUDGET_TOTAL, `部署總和 ≤ ${(BUDGET_TOTAL / 1000).toFixed(0)}KB`, `${(total / 1000).toFixed(1)}KB`);
let assetsTotal = 0;
for (const f of assetFiles) {
  const s = size("assets/" + f);
  assetsTotal += s;
  ok(s <= BUDGET_ASSET_SINGLE, `assets/${f} ≤ ${(BUDGET_ASSET_SINGLE / 1000).toFixed(0)}KB`, `${(s / 1000).toFixed(1)}KB`);
}
ok(assetsTotal <= BUDGET_ASSETS_TOTAL, `assets 總和 ≤ ${(BUDGET_ASSETS_TOTAL / 1000).toFixed(0)}KB`, `${(assetsTotal / 1000).toFixed(1)}KB`);

/* ── 10. package.json 無執行期依賴 ── */
console.log("\n[10] 依賴政策");
const pkg = JSON.parse(read("package.json"));
ok(!pkg.dependencies || Object.keys(pkg.dependencies).length === 0, "無執行期 dependencies（靜態站零運行依賴）");

/* ── 總結 ── */
console.log(`\n══ check 結果：${fails === 0 ? "全部通過" : fails + " 項失敗"}（警告 ${warns}）══\n`);
process.exit(fails ? 1 : 0);
