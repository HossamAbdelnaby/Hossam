import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get activity settings from admin configs
    const settings = await db.adminConfig.findMany({
      where: {
        key: {
          startsWith: 'activity_'
        }
      }
    })

    const settingsMap = settings.reduce((acc, setting) => {
      const key = setting.key.replace('activity_', '')
      acc[key] = setting.value
      return acc
    }, {} as Record<string, string>)

    // Default values if not found
    const defaultSettings = {
      autoRefresh: '30', // seconds
      retentionPeriod: '90', // days
      emailNotifications: 'true',
      realTimeUpdates: 'true',
      maxActivities: '1000'
    }

    const finalSettings = { ...defaultSettings, ...settingsMap }

    return NextResponse.json({
      success: true,
      data: finalSettings
    })
  } catch (error) {
    console.error('Error fetching activity settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { autoRefresh, retentionPeriod, emailNotifications, realTimeUpdates, maxActivities } = body

    const settings = [
      { key: 'activity_autoRefresh', value: autoRefresh.toString() },
      { key: 'activity_retentionPeriod', value: retentionPeriod.toString() },
      { key: 'activity_emailNotifications', value: emailNotifications.toString() },
      { key: 'activity_realTimeUpdates', value: realTimeUpdates.toString() },
      { key: 'activity_maxActivities', value: maxActivities.toString() }
    ]

    // Update or create each setting
    for (const setting of settings) {
      await db.adminConfig.upsert({
        where: {
          key: setting.key
        },
        update: {
          value: setting.value,
          updatedAt: new Date()
        },
        create: {
          key: setting.key,
          value: setting.value,
          description: `Activity setting: ${setting.key}`,
          updatedBy: 'admin' // In real app, get from session
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Activity settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating activity settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update activity settings' },
      { status: 500 }
    )
  }
}