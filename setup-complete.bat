@echo off
echo ========================================
echo   Portfolio Complete Setup Script
echo ========================================
echo.

:: 1. NPM 패키지 설치
echo [1/5] Installing NPM packages...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install NPM packages
    pause
    exit /b 1
)
echo ✓ NPM packages installed
echo.

:: 2. Prisma Client 생성
echo [2/5] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo Error: Failed to generate Prisma client
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

:: 3. 기존 DB 백업 및 삭제
echo [3/5] Resetting database...
if exist prisma\dev.db (
    echo Backing up existing database...
    copy prisma\dev.db prisma\dev.db.backup >nul 2>&1
    del prisma\dev.db
)
echo ✓ Database reset
echo.

:: 4. DB 마이그레이션
echo [4/5] Running database migrations...
call npx prisma migrate dev --name init --skip-seed
if %errorlevel% neq 0 (
    echo Error: Failed to run migrations
    pause
    exit /b 1
)
echo ✓ Database migrated
echo.

:: 5. 서버 시작
echo [5/5] Starting development server...
echo.
echo ========================================
echo   Setup Complete! Starting server...
echo ========================================
echo.
echo Server will start at: http://localhost:3000
echo Admin login: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

:: 개발 서버 실행
call npm run dev
