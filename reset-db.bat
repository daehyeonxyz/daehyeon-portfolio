@echo off
chcp 65001 >nul
cls
echo ================================================================
echo                     FIX DATABASE ERROR
echo ================================================================
echo.

echo [1] Stopping any running processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo OK

echo.
echo [2] Cleaning Prisma cache...
rmdir /s /q node_modules\.prisma 2>nul
echo OK

echo.
echo [3] Resetting database...
del prisma\dev.db 2>nul
del prisma\dev.db-journal 2>nul
echo OK

echo.
echo [4] Regenerating Prisma Client...
call npx prisma generate
echo OK

echo.
echo [5] Creating new database...
call npx prisma migrate dev --name init --skip-seed
echo OK

echo.
echo ================================================================
echo                    DATABASE RESET COMPLETE
echo ================================================================
echo.
echo Starting server...
echo.
timeout /t 3 >nul

call npm run dev
