@echo off
echo ═══════════════════════════════════════════════════════════════
echo                   🔧 ERROR FIX SCRIPT
echo ═══════════════════════════════════════════════════════════════
echo.

echo [1] Prisma 캐시 삭제 중...
rmdir /s /q node_modules\.prisma 2>nul
echo ✅ 완료

echo.
echo [2] 데이터베이스 초기화 중...
del prisma\dev.db 2>nul
del prisma\dev.db-journal 2>nul
echo ✅ 완료

echo.
echo [3] Prisma Client 재생성 중...
call npx prisma generate
echo ✅ 완료

echo.
echo [4] Database 마이그레이션 중...
call npx prisma migrate dev --name init
echo ✅ 완료

echo.
echo [5] Prisma Studio 실행 (DB 확인용)...
echo 브라우저가 열리면 User 테이블을 확인하세요.
echo.
start http://localhost:5555
call npx prisma studio
