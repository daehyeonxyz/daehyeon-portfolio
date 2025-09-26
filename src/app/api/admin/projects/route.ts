import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all projects (admin view - includes unpublished)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Ensure we always return an array
    return NextResponse.json(projects || [])
  } catch (error) {
    console.error('Error fetching projects:', error)
    // Return empty array on error instead of error object
    return NextResponse.json([], { status: 200 })
  }
}
