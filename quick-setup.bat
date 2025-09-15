@echo off
echo 🚀 Setting up Daehyeon Portfolio...
echo.

REM 1. Install required packages
echo 📦 Installing required packages...
call npm install next-auth@^4.24.7 @auth/prisma-adapter framer-motion lucide-react react-hot-toast date-fns @prisma/client
call npm install -D prisma

echo.
echo 🔧 Fixing Tailwind color issues...
node fix-colors.js

echo.
echo 💾 Setting up database...
call npx prisma generate
call npx prisma db push

echo.
echo ✅ All done! Run 'npm run dev' to start the development server.
pause