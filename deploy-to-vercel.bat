@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================================
echo   AYP Scout Guide (v10) - Direct Deploy to Vercel
echo ========================================================
echo.
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js LTS from https://nodejs.org first.
    pause
    exit /b 1
)
echo [Step 1/2] Checking Vercel login...
call npx vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    call npx vercel login
)
echo.
echo [Step 2/2] Deploying to https://ayp-eight.vercel.app/ ...
echo IMPORTANT: When asked "Link to existing project?", type Y and enter project name: ayp
echo.
call npx vercel --prod
echo.
echo ========================================================
echo   Deploy Finished! Open https://ayp-eight.vercel.app/
echo ========================================================
pause
