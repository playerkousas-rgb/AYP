#!/usr/bin/env bash
# ============================================================
# make-icons.sh — 由配方重製全套 icon／favicon（AVIF 優先＋PNG 回退）
# 設計：童軍綠漸變圓角底＋金色晉階 chevron＋白色 AYP 字標＋銅/銀/金三條
# 依賴：ImageMagick（含 AVIF delegate）。字體：DejaVu Sans Bold（OFL，經 matplotlib wheel 抽取）
# 用法：FONT=/path/DejaVuSans-Bold.ttf scripts/make-icons.sh
#       （唔傳 FONT 會自動經 pip 下載 matplotlib wheel 抽取字體到 /tmp）
# 注意：1024 原稿唔入倉（見 docs/部署瘦身與防增肥規範.md）；改設計＝改本腳本＋落 changelog。
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${FONT:-}" ]; then
  FONT=/tmp/DejaVuSans-Bold.ttf
  if [ ! -f "$FONT" ]; then
    echo "[make-icons] 下載字體（matplotlib wheel 抽取 DejaVu Sans Bold）…"
    rm -rf /tmp/mw && mkdir -p /tmp/mw
    pip download matplotlib --no-deps -d /tmp/mw -q
    python3 - "$FONT" <<'EOF'
import sys, os, zipfile
out = sys.argv[1]
whl = [f for f in os.listdir("/tmp/mw") if f.endswith(".whl")][0]
z = zipfile.ZipFile(os.path.join("/tmp/mw", whl))
open(out, "wb").write(z.read("matplotlib/mpl-data/fonts/ttf/DejaVuSans-Bold.ttf"))
EOF
  fi
fi

M=/tmp/ayp-icon-master.png
R=/tmp/ayp-icon-rounded.png

# ── 1024 母稿（方角、不透明；maskable／apple-touch 用）──
convert -size 1024x1024 gradient:#0a5c36-#064020 \
  -fill none -draw "stroke #d4af37 stroke-width 70 stroke-linecap round stroke-linejoin round polyline 376,278 512,200 648,278" \
  -fill white -font "$FONT" -pointsize 330 -kerning -8 -gravity center -annotate +0+60 "AYP" \
  -fill '#b87333' -draw "roundrectangle 217,730 387,810 40,40" \
  -fill '#8a9199' -draw "roundrectangle 427,730 597,810 40,40" \
  -fill '#d4af37' -draw "roundrectangle 637,730 807,810 40,40" \
  "$M"

# ── 圓角透明版（favicon／頁內展示用）──
convert "$M" \( -size 1024x1024 xc:none -fill white -draw "roundrectangle 0,0 1023,1023 225,225" \) \
  -compose DstIn -composite "$R"

# ── 衍生資產（守門預算：單一≤120KB、assets 總和≤200KB）──
convert "$M" -resize 512x512 -strip -colors 256 +dither -define png:compression-level=9 assets/logo-512.png
convert "$M" -resize 180x180 -strip -colors 256 +dither -define png:compression-level=9 assets/apple-touch-icon.png
convert "$R" -resize 192x192 -strip -depth 8 -define png:compression-level=9 -define png:filter=5 assets/logo-192.png
convert "$R" -resize 32x32   -strip -depth 8 -colors 256 +dither -define png:compression-level=9 assets/favicon-32.png
convert "$R" -resize 192x192 -strip -quality 60 assets/logo-192.avif
convert "$R" -resize 32x32   -strip -quality 60 assets/favicon-32.avif

echo "[make-icons] 完成。記得：新增／刪除資產要同步 index.html／manifest／sw.js 並遞增 CACHE 版本。"
ls -la assets/
