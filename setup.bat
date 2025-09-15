@echo off
echo 🚀 Setting up Daehyeon Portfolio...

REM 1. Install dependencies
echo 📦 Installing dependencies...
call npm install

REM 2. Setup Prisma
echo 💾 Setting up database...
call npx prisma generate
call npx prisma db push

REM 3. Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local file...
    (
        echo # GitHub OAuth
        echo GITHUB_ID=your_github_oauth_app_id
        echo GITHUB_SECRET=your_github_oauth_app_secret
        echo.
        echo # NextAuth
        echo NEXTAUTH_URL=http://localhost:3000
        echo NEXTAUTH_SECRET=generate_a_random_secret_here
        echo.
        echo # Database ^(SQLite for development^)
        echo DATABASE_URL="file:./dev.db"
        echo.
        echo # Admin GitHub Username
        echo ADMIN_GITHUB_USERNAME=daehyeonxyz
    ) > .env.local
    echo ⚠️  Please update .env.local with your GitHub OAuth credentials
)

echo ✅ Setup complete! Run 'npm run dev' to start the development server.
pause