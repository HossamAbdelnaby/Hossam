import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const timeRange = searchParams.get('timeRange')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let whereClause: any = {}
    
    // Filter by type
    if (type && type !== 'all') {
      whereClause.type = type.toUpperCase()
    }

    // Filter by time range
    if (timeRange) {
      const now = new Date()
      let startDate: Date

      switch (timeRange) {
        case '1h':
          startDate = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      }

      whereClause.createdAt = {
        gte: startDate
      }
    }

    const activities = await db.activityLog.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true
          }
        }
      }
    })

    const total = await db.activityLog.count({
      where: whereClause
    })

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userName, action, target, type, details, userId } = body

    const activity = await db.activityLog.create({
      data: {
        userName,
        action,
        target,
        type: type.toUpperCase(),
        details: details ? JSON.stringify(details) : null,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: activity
    })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'all') {
      // Clear all activities
      await db.activityLog.deleteMany()
      return NextResponse.json({
        success: true,
        message: 'All activities cleared successfully'
      })
    } else if (action === 'read') {
      // Mark all as read
      await db.activityLog.updateMany({
        where: {
          isRead: false
        },
        data: {
          isRead: true
        }
      })
      return NextResponse.json({
        success: true,
        message: 'All activities marked as read'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform action' },
      { status: 500 }
    )
  }
}