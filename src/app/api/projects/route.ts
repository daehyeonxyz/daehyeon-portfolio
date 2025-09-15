import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: 프로젝트 목록 조회
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST: 새 프로젝트 생성 (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })
    
    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: session.user.email!,
          name: session.user.name || 'Admin',
          image: session.user.image,
          isAdmin: true,
        }
      })
    }
    
    const project = await prisma.project.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description,
        content: body.content || '',
        image: body.image || '',
        thumbnailImage: body.thumbnailImage || null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        link: body.link || '',
        github: body.github || '',
        tech: body.tech || '[]',
        featured: body.featured || false,
        published: body.published !== false,
        order: body.order || 0,
        userId: user.id, // Use the actual database user id
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
