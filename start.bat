@echo off
chcp 65001 >nul
cls
echo ================================================================
echo                    PORTFOLIO SETUP AND RUN
echo ================================================================
echo.
echo GitHub OAuth Configuration:
echo - Client ID: Ov23liYd4f58kBe1IaQV
echo - Admin Username: daehyeonxyz
echo.
echo ================================================================
echo.

:: Check packages
echo [1/4] Checking packages...
if not exist node_modules (
    echo Installing packages...
    call npm install
) else (
    echo OK - Packages already installed
)
echo.

:: Setup Prisma
echo [2/4] Setting up database...
call npx prisma generate >nul 2>&1
echo OK - Prisma Client generated

:: Check database
if not exist prisma\dev.db (
    echo Running database migration...
    call npx prisma migrate dev --name init --skip-seed >nul 2>&1
    echo OK - Database created
) else (
    echo OK - Database already exists
)
echo.

:: Check env
echo [3/4] Checking environment variables...
if exist .env.local (
    echo OK - Environment variables configured
) else (
    echo WARNING - .env.local file not found!
    pause
    exit /b 1
)
echo.

:: Start server
echo [4/4] Starting development server...
echo.
echo ================================================================
echo.
echo   Server URL: http://localhost:3000
echo   Login: Click Login button with GitHub
echo   Admin Page: http://localhost:3000/admin
echo.
echo   Login with GitHub to create projects!
echo.
echo   Stop server: Ctrl + C
echo.
echo ================================================================
echo.

:: Run dev server
call npm run dev
