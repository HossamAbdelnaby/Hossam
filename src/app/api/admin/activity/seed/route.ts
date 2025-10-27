import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const sampleActivities = [
      {
        userName: 'John Doe',
        action: 'Registered for tournament',
        target: 'Fortnite Championship',
        type: 'TOURNAMENT',
        details: JSON.stringify({
          tournamentId: 'tournament_1',
          registrationFee: 50,
          currency: 'USD'
        })
      },
      {
        userName: 'Jane Smith',
        action: 'Created new clan',
        target: 'Elite Squad',
        type: 'CLAN',
        details: JSON.stringify({
          clanId: 'clan_1',
          memberCount: 15,
          paymentRequired: true
        })
      },
      {
        userName: 'System',
        action: 'Payment received',
        target: '$50 from user@example.com',
        type: 'PAYMENT',
        details: JSON.stringify({
          amount: 50,
          currency: 'USD',
          method: 'PAYPAL',
          transactionId: 'txn_123456'
        })
      },
      {
        userName: 'Admin',
        action: 'Updated tournament',
        target: 'CS:GO Championship',
        type: 'TOURNAMENT',
        details: JSON.stringify({
          tournamentId: 'tournament_2',
          changes: ['prize pool updated', 'registration extended']
        })
      },
      {
        userName: 'Mike Johnson',
        action: 'Purchased package',
        target: 'Premium Graphics',
        type: 'PAYMENT',
        details: JSON.stringify({
          packageType: 'PAID_GRAPHICS',
          amount: 200,
          currency: 'USD'
        })
      },
      {
        userName: 'Sarah Wilson',
        action: 'Joined clan',
        target: 'Elite Squad',
        type: 'CLAN',
        details: JSON.stringify({
          clanId: 'clan_1',
          playerId: 'player_123',
          role: 'Member'
        })
      },
      {
        userName: 'System',
        action: 'Tournament started',
        target: 'Valorant Championship',
        type: 'TOURNAMENT',
        details: JSON.stringify({
          tournamentId: 'tournament_3',
          participantCount: 16,
          status: 'IN_PROGRESS'
        })
      },
      {
        userName: 'Tom Brown',
        action: 'Contract accepted',
        target: 'Pusher Service for CWL',
        type: 'CONTRACT',
        details: JSON.stringify({
          contractId: 'contract_1',
          pusherId: 'pusher_1',
          amount: 100,
          duration: '7 days'
        })
      }
    ]

    // Clear existing activities
    await db.activityLog.deleteMany()

    // Insert sample activities
    for (const activity of sampleActivities) {
      await db.activityLog.create({
        data: {
          ...activity,
          isRead: Math.random() > 0.5 // Randomly mark some as read
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Sample activities created successfully',
      count: sampleActivities.length
    })
  } catch (error) {
    console.error('Error seeding activities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed activities' },
      { status: 500 }
    )
  }
}