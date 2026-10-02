#!/usr/bin/env node
/* ============================================================
   make-icons.js — 由 design/*.svg 產生 assets/ 全部圖示（可重現）
   用法（一次性安裝；刻意唔入 package.json，保持零依賴＋Vercel 建置不變肥）：
     npm i --no-save --package-lock=false @napi-rs/image     # 測試版本 1.15.0
     node scripts/make-icons.js            # 產生並寫入 assets/
     node scripts/make-icons.js --dry      # 只量度大小／跑守門，唔寫檔
   產出：
     assets/logo-512.png       manifest any＋maskable   （Chrome 只收 PNG／WebP／SVG，唔收 AVIF）
     assets/logo-192.png       manifest any／apple-touch-icon／<picture> 回退
     assets/logo-192.avif      header <picture> 主來源
     assets/favicon-32.avif    favicon 主（要 32×32：Chrome 按 16／32px 計分，同分先宣告者贏）
     assets/favicon-32.png     favicon 回退
   守門（任何一項失敗即中止，唔寫任何檔）：
     ① maskable 安全圈：全部圖案落在中心半徑 0.40×邊長內
     ② logo-*.png 必須不透明（iOS 會將透明填黑）
     ③ AVIF 解碼回讀 PSNR 不低於門檻（防編碼參數誤調）
   規則／量度數據見 docs/部署瘦身與防增肥規範.md §2
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

let napi;
try { napi = require("@napi-rs/image"); } catch (e) {
  console.error("缺少 @napi-rs/image，先執行：npm i --no-save --package-lock=false @napi-rs/image");
  process.exit(2);
}
const { Transformer, pngQuantize, losslessCompressPng } = napi;

const ROOT = path.join(__dirname, "..");
const DRY = process.argv.includes("--dry");
const YUV444 = 0;     // ChromaSubsampling.Yuv444：細圖用 4:2:0 會令顏色滲邊

/* ── 編碼參數（以 docs §2 嘅實測數據揀；改前先 --dry 睇大小同 PSNR）──
   PNG-8：色數＝量化調色盤大小（24 色肉眼已同無損原圖無分別）；AVIF：ravif 質量 0–100 */
const PNG_COLORS = { "logo-512.png": 24, "logo-192.png": 24, "favicon-32.png": 32 };
const AVIF_OPTS = {
  "logo-192.avif":   { quality: 50, alphaQuality: 100, minPsnr: 37 },  // header 只顯示 54 CSS px；q45 金面開始起斑，q50 乾淨
  "favicon-32.avif": { quality: 60, alphaQuality: 90,  minPsnr: 34 },  // 32px 1:1 顯示，畫質要求較高
};
const SAFE_RADIUS = 0.40;   // W3C maskable 安全圈：半徑 40%

const fail = (msg) => { console.error("✘ " + msg); process.exit(1); };
const svgOf = (f) => fs.readFileSync(path.join(ROOT, "design", f), "utf8");

/* 面積平均（箱形濾鏡）縮細：冇振鈴、邊緣雜色最少 → PNG／AVIF 都最細（實測比 Lanczos3 細 15–20%）。
   resvg 輸出係直通 alpha，所以先 premultiply 再平均，最後還原，透明角先唔會發黑邊 */
function areaResize(src, sw, dw) {
  const r = sw / dw;
  const pre = new Float64Array(sw * sw * 4);
  for (let i = 0; i < sw * sw; i++) {
    const a = src[i * 4 + 3] / 255;
    for (let c = 0; c < 3; c++) pre[i * 4 + c] = src[i * 4 + c] * a;
    pre[i * 4 + 3] = src[i * 4 + 3];
  }
  const weights = (d) => {
    const a = d * r, b = (d + 1) * r, w = [];
    for (let s = Math.floor(a); s < Math.ceil(b); s++) w.push([s, (Math.min(b, s + 1) - Math.max(a, s)) / r]);
    return w;
  };
  const tmp = new Float64Array(dw * sw * 4);   // 橫向：sw×sw → dw×sw
  for (let y = 0; y < sw; y++) for (let x = 0; x < dw; x++) for (const [s, w] of weights(x)) for (let c = 0; c < 4; c++) tmp[(y * dw + x) * 4 + c] += pre[(y * sw + s) * 4 + c] * w;
  const out = new Uint8Array(dw * dw * 4);     // 縱向：dw×sw → dw×dw
  for (let y = 0; y < dw; y++) for (let x = 0; x < dw; x++) {
    const acc = [0, 0, 0, 0];
    for (const [s, w] of weights(y)) for (let c = 0; c < 4; c++) acc[c] += tmp[(s * dw + x) * 4 + c] * w;
    const a = acc[3] / 255;
    for (let c = 0; c < 3; c++) out[(y * dw + x) * 4 + c] = a > 0 ? Math.round(acc[c] / a) : 0;
    out[(y * dw + x) * 4 + 3] = Math.round(acc[3]);
  }
  return out;
}
/* SVG → size×size 嘅 RGBA 像素（resvg 先以 1024px 超採樣，再面積平均） */
async function raster(svg, size) {
  const buf = Buffer.from(svg);
  const { width } = await Transformer.fromSvg(buf).metadata();
  const raw = await Transformer.fromSvg(buf).rawPixels();
  if (raw.length !== width * width * 4) fail("SVG 渲染結果唔係方形 RGBA");
  if (width < size) fail(`SVG 渲染尺寸 ${width}px 細過目標 ${size}px`);
  return areaResize(raw, width, size);
}
const toPng = (rgba, size) => Transformer.fromRgbaPixels(Buffer.from(rgba), size, size).png();

/* 解碼成「疊落中灰」嘅 RGB，令透明邊緣都有得比較 */
async function rgbOf(buf) {
  const t = new Transformer(buf);
  const { width, height } = await t.metadata();
  const raw = await new Transformer(buf).rawPixels();
  const ch = raw.length / (width * height);
  if (ch !== 3 && ch !== 4) fail("未預期嘅像素格式（" + ch + " 通道）");
  const out = new Uint8Array(width * height * 3);
  for (let i = 0, j = 0; i < raw.length; i += ch, j += 3) {
    const a = ch === 4 ? raw[i + 3] / 255 : 1;
    for (let k = 0; k < 3; k++) out[j + k] = raw[i + k] * a + 128 * (1 - a);
  }
  return { w: width, h: height, rgb: out };
}
const psnr = (a, b) => {
  let se = 0;
  for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; se += d * d; }
  return se === 0 ? 99 : 10 * Math.log10(65025 / (se / a.length));
};

/* PNG 結構：IHDR 尺寸／色型，及是否真係用到 alpha（RGBA，或調色盤有 tRNS 非 255 嘅項） */
function pngInfo(buf) {
  let alpha = false;
  const colorType = buf[25];
  if (colorType === 4 || colorType === 6) alpha = true;
  for (let o = 8; o < buf.length;) {
    const len = buf.readUInt32BE(o), type = buf.toString("latin1", o + 4, o + 8);
    if (type === "tRNS" && buf.subarray(o + 8, o + 8 + len).some((v) => v !== 255)) alpha = true;
    o += 12 + len;
  }
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), colorType, alpha };
}

const png8 = async (ref, name) =>
  losslessCompressPng(await pngQuantize(ref, { colors: PNG_COLORS[name], minQuality: 0, maxQuality: 100, speed: 1 }), { strip: true });
const avif = (ref, name) => {
  const { quality, alphaQuality } = AVIF_OPTS[name];
  return new Transformer(ref).avif({ quality, alphaQuality, speed: 1, threads: 1, chromaSubsampling: YUV444 });
};

(async () => {
  const iconSvg = svgOf("icon.svg"), favSvg = svgOf("favicon.svg");

  /* ① maskable 安全圈：去掉 #bg 後量度圖案離中心最遠嘅像素 */
  const art = iconSvg.replace(/<rect id="bg"[^>]*\/>/, "");
  if (art === iconSvg) fail('design/icon.svg 缺少 <rect id="bg">，無法驗證安全圈');
  const S = 512;
  const px = await raster(art, S);
  let maxR = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (px[(y * S + x) * 4 + 3] > 24) maxR = Math.max(maxR, Math.hypot(x + 0.5 - S / 2, y + 0.5 - S / 2));
  }
  console.log(`[安全圈] 圖案最遠 ${maxR.toFixed(1)}px／安全半徑 ${(SAFE_RADIUS * S).toFixed(1)}px（用咗 ${(100 * maxR / (SAFE_RADIUS * S)).toFixed(0)}%）`);
  if (maxR > SAFE_RADIUS * S) fail("圖案超出 maskable 安全圈，Android 圓形遮罩會切走內容");

  /* 渲染（resvg 超採樣後面積平均縮細，邊緣最乾淨） */
  const ref512 = await toPng(await raster(iconSvg, 512), 512);
  const ref192 = await toPng(await raster(iconSvg, 192), 192);
  const ref32 = await toPng(await raster(favSvg, 32), 32);

  const out = {
    "logo-512.png": await png8(ref512, "logo-512.png"),
    "logo-192.png": await png8(ref192, "logo-192.png"),
    "logo-192.avif": await avif(ref192, "logo-192.avif"),
    "favicon-32.avif": await avif(ref32, "favicon-32.avif"),
    "favicon-32.png": await png8(ref32, "favicon-32.png"),
  };

  /* ② PNG 尺寸／不透明 ③ AVIF 回讀 PSNR */
  const dims = { "logo-512.png": 512, "logo-192.png": 192, "favicon-32.png": 32 };
  const refs = { "logo-192.avif": ref192, "favicon-32.avif": ref32 };
  let total = 0;
  for (const [name, buf] of Object.entries(out)) {
    let note = "";
    if (name.endsWith(".png")) {
      const info = pngInfo(buf);
      if (info.w !== dims[name] || info.h !== dims[name]) fail(`${name} 尺寸 ${info.w}×${info.h} ≠ ${dims[name]}`);
      if (name.startsWith("logo-") && info.alpha) fail(`${name} 帶透明；icon 必須不透明（iOS 填黑、maskable 需要全出血）`);
      note = `PNG-8 ${PNG_COLORS[name]} 色${info.alpha ? "＋alpha" : "，不透明"}`;
    } else {
      if (buf.subarray(4, 12).toString("latin1") !== "ftypavif") fail(`${name} 唔係有效 AVIF（缺 ftypavif）`);
      const a = await rgbOf(refs[name]), b = await rgbOf(buf);
      const p = psnr(a.rgb, b.rgb);
      if (b.w !== a.w || b.h !== a.h) fail(`${name} 解碼尺寸 ${b.w}×${b.h} ≠ ${a.w}×${a.h}`);
      if (p < AVIF_OPTS[name].minPsnr) fail(`${name} 回讀 PSNR ${p.toFixed(1)}dB 低於門檻 ${AVIF_OPTS[name].minPsnr}dB`);
      note = `AVIF q${AVIF_OPTS[name].quality}，回讀 PSNR ${p.toFixed(1)}dB`;
    }
    total += buf.length;
    console.log(`  ${String(buf.length).padStart(6)} B  ${name.padEnd(16)} ${note}`);
  }
  console.log(`  ${String(total).padStart(6)} B  合計（${Object.keys(out).length} 檔）`);

  if (DRY) { console.log("\n--dry：未寫入任何檔案。"); return; }
  for (const [name, buf] of Object.entries(out)) fs.writeFileSync(path.join(ROOT, "assets", name), buf);
  console.log("\n✔ 已寫入 assets/。記得：改過資產要遞增 sw.js 嘅 CACHE 版本，再跑 npm run build。");
})().catch((e) => { console.error(e); process.exit(1); });
