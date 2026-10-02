#!/usr/bin/env node
/* ============================================================
   lint.js — 語法＋風格守門（零依賴）
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));

let fails = 0;
const ok = (cond, name, extra) => {
  console.log(`  ${cond ? "✔" : "✘"} ${name}${extra ? " — " + extra : ""}`);
  if (!cond) fails++;
};

/* ── 1. JS 語法（node --check）── */
console.log("\n[1] JS 語法");
const jsFiles = ["app.js", "data.js", "sw.js", "scripts/check.js", "scripts/lint.js", "scripts/build.js", "scripts/make-icons.js",
  "tests/dom-test.js", "tests/guide.spec.js"].filter(exists);
for (const f of jsFiles) {
  const r = cp.spawnSync(process.execPath, ["--check", path.join(ROOT, f)], { encoding: "utf8" });
  ok(r.status === 0, `語法 OK：${f}`, r.status ? (r.stderr || "").trim().split("\n")[0] : undefined);
}

/* ── 2. JSON 可解析 ── */
console.log("\n[2] JSON 可解析");
for (const f of ["package.json", "manifest.webmanifest", "vercel.json"]) {
  if (!exists(f)) { ok(false, `存在 ${f}`); continue; }
  try { JSON.parse(read(f)); ok(true, `JSON OK：${f}`); }
  catch (e) { ok(false, `JSON OK：${f}`, e.message); }
}

/* ── 3. 生產檔禁用項 ── */
console.log("\n[3] 生產檔禁用項");
for (const f of ["app.js", "data.js", "sw.js"]) {
  const s = read(f);
  ok(!/console\.log\s*\(/.test(s), `${f} 無 console.log`);
  ok(!/debugger\b/.test(s), `${f} 無 debugger`);
  ok(!/(\/\/|\/\*)\s*(TODO|FIXME|XXX)\b|(TODO|FIXME|XXX)\s*[:：]/.test(s), `${f} 無 TODO/FIXME/XXX 標記`);
  ok(!/http:\/\//.test(s), `${f} 無明文 http://`);
}
ok(!/http:\/\//.test(read("index.html")), "index.html 無明文 http://");
ok(!/http:\/\//.test(read("manifest.webmanifest")), "manifest 無明文 http://");

/* ── 4. 文字檔衛生：無 BOM／無 CRLF／結尾換行 ── */
console.log("\n[4] 文字檔衛生");
const textFiles = ["index.html", "app.js", "data.js", "sw.js", "manifest.webmanifest", "package.json",
  "vercel.json", ".vercelignore", ".gitignore", "README.md",
  "scripts/check.js", "scripts/lint.js", "scripts/build.js", "scripts/make-icons.js"];
for (const f of textFiles.filter(exists)) {
  const b = fs.readFileSync(path.join(ROOT, f));
  ok(!b.slice(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])), `${f} 無 BOM`);
  ok(!b.includes(Buffer.from("\r\n")), `${f} 無 CRLF`);
  ok(b.length === 0 || b[b.length - 1] === 0x0a, `${f} 結尾有換行`);
}

console.log(`\n══ lint 結果：${fails === 0 ? "全部通過" : fails + " 項失敗"}══\n`);
process.exit(fails ? 1 : 0);
