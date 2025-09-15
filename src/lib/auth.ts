import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
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
        
        // Allow only specific user
        if (githubUsername === allowedUsername) {
          // Set admin flag when signing in
          try {
            await prisma.user.update({
              where: { email: user.email! },
              data: { isAdmin: true }
            });
          } catch (error) {
            // User might not exist yet, that's ok
            console.log('User will be created with admin rights');
          }
          return true;
        }
        
        // Block other users
        return false;
      }
      return false;
    },
    async jwt({ token, user, account, profile }) {
      // First time JWT creation
      if (account && user) {
        // Find or create user in database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });
        
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.isAdmin = dbUser.isAdmin;
        } else {
          // If user doesn't exist, use the user object id
          token.id = user.id;
          token.email = user.email;
          token.isAdmin = true;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      // Pass token info to session
      if (session?.user) {
        session.user.id = token.id || token.sub; // Use token.sub as fallback
        session.user.email = token.email;
        session.user.isAdmin = token.isAdmin !== false; // Default to true for logged in users
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