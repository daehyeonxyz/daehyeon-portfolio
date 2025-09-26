import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  const debugInfo = {
    session: session || null,
    env: {
      GITHUB_ID: process.env.GITHUB_ID ? 'Set' : 'Not set',
      GITHUB_SECRET: process.env.GITHUB_SECRET ? 'Set' : 'Not set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
      ADMIN_USERNAME: process.env.ADMIN_GITHUB_USERNAME || 'Not set',
    },
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(debugInfo);
}
