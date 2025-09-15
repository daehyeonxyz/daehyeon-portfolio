@echo off
title Portfolio Admin Setup - Complete Installation
color 0A
cls

echo ================================================
echo     PORTFOLIO ADMIN SETUP - COMPLETE
echo ================================================
echo.
echo This script will:
echo  1. Install dependencies
echo  2. Setup database
echo  3. Configure GitHub OAuth
echo  4. Start the development server
echo.
echo ================================================
echo.
pause

REM Check if Node.js is installed
echo [CHECKING] Node.js installation...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed
echo.

REM Check if npm modules are installed
echo [CHECKING] Dependencies...
if not exist node_modules (
    echo [INSTALLING] npm dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies are installed
)
echo.

REM Check environment files
echo [CHECKING] Environment configuration...
if not exist .env.local (
    echo ERROR: .env.local file is missing!
    echo Creating template .env.local file...
    
    (
        echo # GitHub OAuth
        echo GITHUB_ID=YOUR_GITHUB_CLIENT_ID
        echo GITHUB_SECRET=YOUR_GITHUB_CLIENT_SECRET
        echo.
        echo # NextAuth
        echo NEXTAUTH_URL=http://localhost:3000
        echo NEXTAUTH_SECRET=your-secret-key-here
        echo.
        echo # Database
        echo DATABASE_URL="file:./dev.db"
        echo.
        echo # Admin GitHub Username
        echo ADMIN_GITHUB_USERNAME=daehyeonxyz
    ) > .env.local
    
    echo.
    echo IMPORTANT: Please edit .env.local with your GitHub OAuth credentials!
    echo.
    echo Steps to get GitHub OAuth:
    echo 1. Go to https://github.com/settings/developers
    echo 2. Click "New OAuth App"
    echo 3. Fill in:
    echo    - Application name: Portfolio Admin
    echo    - Homepage URL: http://localhost:3000
    echo    - Authorization callback URL: http://localhost:3000/api/auth/callback/github
    echo 4. Copy Client ID and Client Secret to .env.local
    echo.
    notepad .env.local
    pause
    exit /b 1
) else (
    echo [OK] Environment file exists
)
echo.

REM Clean and setup database
echo [DATABASE] Setting up Prisma database...
echo.

REM Backup existing database if exists
if exist prisma\dev.db (
    echo Backing up existing database...
    copy prisma\dev.db prisma\dev.db.backup.%date:~10,4%%date:~4,2%%date:~7,2% >nul 2>&1
    del prisma\dev.db
)
if exist prisma\dev.db-journal del prisma\dev.db-journal

REM Generate Prisma client
echo Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client!
    pause
    exit /b 1
)

REM Push database schema
echo Creating database schema...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Failed to create database!
    pause
    exit /b 1
)

echo [OK] Database setup complete
echo.

REM Display current configuration
echo ================================================
echo     CURRENT CONFIGURATION
echo ================================================
echo.
type .env.local | findstr "GITHUB_ID"
type .env.local | findstr "ADMIN_GITHUB_USERNAME"
type .env.local | findstr "NEXTAUTH_URL"
echo.
echo ================================================
echo.

REM Build the project
echo [BUILD] Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo Warning: Build failed, but development server may still work
    echo.
)

REM Final instructions
echo ================================================
echo     SETUP COMPLETE!
echo ================================================
echo.
echo Starting development server...
echo.
echo Once the server starts:
echo.
echo 1. Open your browser to: http://localhost:3000
echo.
echo 2. Navigate to Portfolio page: http://localhost:3000/portfolio
echo.
echo 3. Click "Admin Login" at the bottom
echo.
echo 4. Sign in with GitHub (username must be: daehyeonxyz)
echo.
echo 5. After login, you can:
echo    - Create new projects
echo    - Edit existing projects
echo    - Manage publication status
echo.
echo ================================================
echo.
echo Press Ctrl+C to stop the server
echo.
timeout /t 3 /nobreak >nul

REM Start the development server
call npm run dev
