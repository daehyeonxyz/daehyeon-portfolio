@echo off
echo Fixing authentication and database issues...

echo Stopping server...
taskkill /F /IM node.exe 2>nul

echo Deleting old database...
del prisma\dev.db 2>nul
del prisma\dev.db-journal 2>nul

echo Creating new database...
npx prisma db push --force-reset

echo Database reset complete!
echo.
echo Please follow these steps:
echo 1. Run: npm run dev
echo 2. Go to http://localhost:3000
echo 3. Click "Admin Login" to sign in with GitHub
echo 4. Try creating a new project
echo.
pause
