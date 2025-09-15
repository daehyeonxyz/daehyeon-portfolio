@echo off
echo ================================================================
echo                    RESTART AND DEBUG
echo ================================================================
echo.

:: Kill all Node processes
echo Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

:: Clear Next.js cache
echo Clearing Next.js cache...
rmdir /s /q .next 2>nul
del /q /s .next 2>nul

:: Clear node_modules cache if needed
echo Clearing module cache...
rmdir /s /q node_modules\.cache 2>nul

:: Install dependencies
echo Checking dependencies...
call npm install

:: Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate

:: Start dev server
echo.
echo Starting development server...
echo.
echo ================================================================
echo.
echo   URLs to test:
echo   - Home: http://localhost:3000
echo   - Portfolio: http://localhost:3000/portfolio  
echo   - Admin: http://localhost:3000/admin
echo.
echo   Login with GitHub (daehyeonxyz) to access Admin features
echo.
echo ================================================================
echo.

call npm run dev
