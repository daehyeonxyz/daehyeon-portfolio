@echo off
echo ======================================
echo Portfolio Admin Setup Script
echo ======================================
echo.

REM 1. 기존 데이터베이스 백업 및 삭제
echo [1/6] Cleaning up old database...
if exist prisma\dev.db (
    echo Backing up existing database...
    copy prisma\dev.db prisma\dev.db.backup >nul 2>&1
    del prisma\dev.db
)
if exist prisma\dev.db-journal del prisma\dev.db-journal

REM 2. Prisma 클라이언트 재생성
echo [2/6] Regenerating Prisma client...
call npx prisma generate

REM 3. 데이터베이스 마이그레이션
echo [3/6] Running database migrations...
call npx prisma db push

REM 4. 환경 변수 확인
echo [4/6] Checking environment variables...
if not exist .env.local (
    echo ERROR: .env.local file not found!
    echo Please create .env.local with GitHub OAuth credentials
    pause
    exit /b 1
)

REM 5. GitHub OAuth 정보 표시
echo.
echo [5/6] Current GitHub OAuth Configuration:
echo ======================================
findstr "GITHUB_ID" .env.local
findstr "ADMIN_GITHUB_USERNAME" .env.local
echo ======================================
echo.

REM 6. 서버 시작 안내
echo [6/6] Setup Complete!
echo.
echo To start the server:
echo   npm run dev
echo.
echo To login as admin:
echo   1. Go to http://localhost:3000/portfolio
echo   2. Click "Admin Login" 
echo   3. Sign in with GitHub (username: daehyeonxyz)
echo.
pause
