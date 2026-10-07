#!/usr/bin/env node
/* ============================================================
   build.js — 產生 dist/（只含部署產物）＋逐檔校驗（零依賴）
   Vercel：buildCommand="npm run build"、outputDirectory="dist"
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const CORE = ["index.html", "app.js", "data.js", "sw.js", "manifest.webmanifest", "analytics.js"];
const assets = fs.readdirSync(path.join(ROOT, "assets")).filter((f) => !f.startsWith("."));
const DEPLOY = [...CORE, ...assets.map((f) => "assets/" + f)];

const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

/* 1. 清空 dist */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

/* 2. 複製 */
for (const f of DEPLOY) {
  const dest = path.join(DIST, f);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(ROOT, f), dest);
}

/* 3. 逐檔校驗（sha256 必須與來源一致） */
let bad = 0;
console.log("\n[build] 逐檔校驗 dist/：");
for (const f of DEPLOY) {
  const same = sha(path.join(ROOT, f)) === sha(path.join(DIST, f));
  console.log(`  ${same ? "✔" : "✘"} ${f}`);
  if (!same) bad++;
}

/* 4. dist 不可有多餘檔案 */
const listed = [];
(function walk(d, rel) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const r = rel ? rel + "/" + e.name : e.name;
    if (e.isDirectory()) walk(path.join(d, e.name), r); else listed.push(r);
  }
})(DIST, "");
const extra = listed.filter((f) => !DEPLOY.includes(f));
if (extra.length) { console.log("  ✘ dist 有多餘檔案：" + extra.join(", ")); bad++; }

/* 5. 體積報告 */
console.log("\n[build] 部署體積：");
let total = 0;
for (const f of [...DEPLOY].sort()) {
  const s = fs.statSync(path.join(DIST, f)).size;
  total += s;
  console.log(`  ${(s / 1024).toFixed(1).padStart(8)} KB  ${f}`);
}
console.log(`  ─────────────────────\n  ${(total / 1024).toFixed(1).padStart(8)} KB  總和（上限 390.6KB）`);

if (bad) { console.log("\n✘ build 校驗失敗：" + bad + " 項"); process.exit(1); }
console.log("\n✔ build 完成：dist/ 與來源逐檔一致，無多餘檔案。\n");
