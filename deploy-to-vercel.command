#!/bin/bash
cd "$(dirname "$0")"
echo "========================================================"
echo "  AYP 童軍接駁指南 (v10 強化版) — 免 Git 直傳 Vercel 工具"
echo "========================================================"
echo ""
if ! command -v node >/dev/null 2>&1; then
  echo "[錯誤] 找不到 Node.js！請先前往 https://nodejs.org 下載並安裝 LTS 版本。"
  read -p "按 Enter 結束..."
  exit 1
fi
echo "[步驟 1/2] 正在檢查 Vercel 登入狀態..."
if ! npx vercel whoami >/dev/null 2>&1; then
  npx vercel login
fi
echo ""
echo "[步驟 2/2] 準備發布更新到正式網站 (https://ayp-eight.vercel.app/)..."
echo "提示：如首次詢問 Link to existing project? 請輸入 Y，專案名稱輸入 ayp"
echo ""
npx vercel --prod
echo ""
echo "========================================================"
echo "  更新完成！請打開 https://ayp-eight.vercel.app/ 檢查"
echo "========================================================"
read -p "按 Enter 結束..."
