import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the clan owned by the current user
    const clan = await db.clan.findFirst({
      where: {
        ownerId: session.user.id,
        isActive: true
      }
    })

    if (!clan) {
      return NextResponse.json({ error: 'Clan not found' }, { status: 404 })
    }

    // Get related records count
    const membersCount = await db.clanMember.count({
      where: {
        clanId: clan.id
      }
    })

    const applicationsCount = await db.clanApplication.count({
      where: {
        clanId: clan.id
      }
    })

    // Get sample related records for debugging
    const members = await db.clanMember.findMany({
      where: {
        clanId: clan.id
      },
      take: 5,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    const applications = await db.clanApplication.findMany({
      where: {
        clanId: clan.id
      },
      take: 5,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      clan: {
        id: clan.id,
        name: clan.name,
        tag: clan.tag
      },
      relations: {
        members: {
          count: membersCount,
          sample: members
        },
        applications: {
          count: applicationsCount,
          sample: applications
        }
      },
      message: 'Clan relations retrieved successfully'
    })
  } catch (error) {
    console.error('Error checking clan relations:', error)
    return NextResponse.json(
      { error: 'Failed to check clan relations' },
      { status: 500 }
    )
  }
}