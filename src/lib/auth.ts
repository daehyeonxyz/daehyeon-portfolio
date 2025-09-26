import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  // Remove adapter to use JWT only (no database sessions)
  // adapter: PrismaAdapter(prisma) as any,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check GitHub username
      if (account?.provider === 'github') {
        const githubUsername = (profile as any)?.login;
        const allowedUsername = process.env.ADMIN_GITHUB_USERNAME || 'daehyeonxyz';
        
        console.log('GitHub login attempt:', {
          username: githubUsername,
          allowed: allowedUsername,
          match: githubUsername === allowedUsername
        });
        
        // Allow only specific user
        return githubUsername === allowedUsername;
      }
      return false;
    },
    async jwt({ token, user, account, profile }) {
      // First time JWT creation
      if (account && profile && account.provider === 'github') {
        token.id = (profile as any).id;
        token.email = user?.email;
        token.name = user?.name;
        token.image = user?.image;
        token.username = (profile as any).login;
        token.isAdmin = (profile as any).login === process.env.ADMIN_GITHUB_USERNAME;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Pass token info to session
      if (session?.user) {
        session.user.id = token.id || token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.username = token.username;
        session.user.isAdmin = token.isAdmin === true;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};