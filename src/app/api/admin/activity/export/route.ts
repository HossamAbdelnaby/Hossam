import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const type = searchParams.get('type')
    const timeRange = searchParams.get('timeRange')
    const includeDetails = searchParams.get('includeDetails') === 'true'
    const includeTimestamp = searchParams.get('includeTimestamp') === 'true'
    const includeUserInfo = searchParams.get('includeUserInfo') === 'true'

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
      include: {
        user: includeUserInfo ? {
          select: {
            id: true,
            username: true,
            name: true,
            email: true
          }
        } : false
      }
    })

    if (format === 'csv') {
      const csvData = generateCSV(activities, {
        includeDetails,
        includeTimestamp,
        includeUserInfo
      })
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="activity-log-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else if (format === 'json') {
      const jsonData = generateJSON(activities, {
        includeDetails,
        includeTimestamp,
        includeUserInfo
      })
      
      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="activity-log-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    } else if (format === 'pdf') {
      // For PDF, we'll return a simple text format for now
      // In a real implementation, you would use a PDF library like jsPDF
      const pdfData = generateText(activities, {
        includeDetails,
        includeTimestamp,
        includeUserInfo
      })
      
      return new NextResponse(pdfData, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="activity-log-${new Date().toISOString().split('T')[0]}.txt"`
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error exporting activities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export activities' },
      { status: 500 }
    )
  }
}

function generateCSV(activities: any[], options: any) {
  const headers = []
  
  if (options.includeTimestamp) headers.push('Timestamp')
  headers.push('User', 'Action', 'Target', 'Type', 'Status')
  if (options.includeDetails) headers.push('Details')
  if (options.includeUserInfo) headers.push('User ID', 'User Email')
  
  const csvRows = [headers.join(',')]
  
  activities.forEach(activity => {
    const row = []
    
    if (options.includeTimestamp) {
      row.push(`"${activity.createdAt.toISOString()}"`)
    }
    
    row.push(`"${activity.userName || 'System'}"`)
    row.push(`"${activity.action}"`)
    row.push(`"${activity.target || ''}"`)
    row.push(`"${activity.type}"`)
    row.push(`"${activity.isRead ? 'Read' : 'Unread'}"`)
    
    if (options.includeDetails) {
      const details = activity.details ? JSON.stringify(JSON.parse(activity.details)) : ''
      row.push(`"${details.replace(/"/g, '""')}"`)
    }
    
    if (options.includeUserInfo && activity.user) {
      row.push(`"${activity.user.id}"`)
      row.push(`"${activity.user.email}"`)
    }
    
    csvRows.push(row.join(','))
  })
  
  return csvRows.join('\n')
}

function generateJSON(activities: any[], options: any) {
  return activities.map(activity => {
    const result: any = {
      id: activity.id,
      user: activity.userName || 'System',
      action: activity.action,
      target: activity.target,
      type: activity.type,
      status: activity.isRead ? 'Read' : 'Unread'
    }
    
    if (options.includeTimestamp) {
      result.timestamp = activity.createdAt
    }
    
    if (options.includeDetails && activity.details) {
      result.details = JSON.parse(activity.details)
    }
    
    if (options.includeUserInfo && activity.user) {
      result.userInfo = activity.user
    }
    
    return result
  })
}

function generateText(activities: any[], options: any) {
  let text = 'ACTIVITY LOG REPORT\n'
  text += '=' .repeat(50) + '\n\n'
  
  activities.forEach((activity, index) => {
    text += `${index + 1}. `
    
    if (options.includeTimestamp) {
      text += `[${activity.createdAt.toLocaleString()}] `
    }
    
    text += `${activity.userName || 'System'} ${activity.action}`
    
    if (activity.target) {
      text += ` - ${activity.target}`
    }
    
    text += ` (${activity.type})`
    text += ` [${activity.isRead ? 'Read' : 'Unread'}]\n`
    
    if (options.includeDetails && activity.details) {
      try {
        const details = JSON.parse(activity.details)
        text += `   Details: ${JSON.stringify(details, null, 2)}\n`
      } catch (e) {
        text += `   Details: ${activity.details}\n`
      }
    }
    
    if (options.includeUserInfo && activity.user) {
      text += `   User: ${activity.user.name} (${activity.user.email})\n`
    }
    
    text += '\n'
  })
  
  return text
}