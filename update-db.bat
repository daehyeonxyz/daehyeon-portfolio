@echo off
echo Updating database schema...
npx prisma db push
echo Database updated!
pause
