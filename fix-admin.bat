@echo off
echo ================================================================
echo                  FIX ADMIN ACCESS ISSUE
echo ================================================================
echo.

:: Stop server
echo [1] Stopping server...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

:: Clear caches
echo [2] Clearing caches...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul

:: Regenerate Prisma
echo [3] Regenerating Prisma Client...
call npx prisma generate

:: Start server
echo.
echo [4] Starting server...
echo.
echo ================================================================
echo   IMPORTANT TEST STEPS:
echo ================================================================
echo.
echo   1. Go to: http://localhost:3000/debug
echo      - Check if "Is Admin: Yes" shows after login
echo.
echo   2. If not admin, try:
echo      - Sign Out
echo      - Sign In again with GitHub
echo.
echo   3. Test these URLs:
echo      - /admin (should work if admin)
echo      - /admin/projects/new (should work if admin)
echo.
echo ================================================================
echo.

call npm run dev
