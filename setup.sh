#!/bin/bash

echo "🚀 Setting up Daehyeon Portfolio..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Setup Prisma
echo "💾 Setting up database..."
npx prisma generate
npx prisma db push

# 3. Create .env.local if not exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOL
# GitHub OAuth
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# Admin GitHub Username (당신의 GitHub 유저네임)
ADMIN_GITHUB_USERNAME=daehyeonxyz
EOL
    echo "⚠️  Please update .env.local with your GitHub OAuth credentials"
fi

echo "✅ Setup complete! Run 'npm run dev' to start the development server."