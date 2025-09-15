@echo off
echo 📦 Installing required dependencies...

echo Installing authentication packages...
call npm install next-auth@^4.24.7 @auth/prisma-adapter

echo Installing UI and animation packages...
call npm install framer-motion lucide-react react-hot-toast date-fns

echo Installing Prisma...
call npm install @prisma/client
call npm install -D prisma

echo Generating Prisma client...
call npx prisma generate
call npx prisma db push

echo ✅ All dependencies installed successfully!
pause