import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the clan owned by the current user
    const existingClan = await db.clan.findFirst({
      where: {
        ownerId: session.user.id,
        isActive: true
      },
      include: {
        _count: {
          select: {
            members: true,
            applications: true
          }
        }
      }
    })

    if (!existingClan) {
      return NextResponse.json({ error: 'Clan not found' }, { status: 404 })
    }

    console.log(`Starting reset process for clan: ${existingClan.name} (${existingClan.id})`)
    console.log(`Related records - Members: ${existingClan._count.members}, Applications: ${existingClan._count.applications}`)

    // Use a transaction to ensure all operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Step 1: Delete all clan applications
      if (existingClan._count.applications > 0) {
        try {
          const deletedApplications = await tx.clanApplication.deleteMany({
            where: {
              clanId: existingClan.id
            }
          })
          console.log(`Deleted ${deletedApplications.count} applications for clan ${existingClan.id}`)
        } catch (error) {
          console.error('Error deleting clan applications:', error)
          throw new Error('Failed to delete clan applications')
        }
      }

      // Step 2: Delete all clan members
      if (existingClan._count.members > 0) {
        try {
          const deletedMembers = await tx.clanMember.deleteMany({
            where: {
              clanId: existingClan.id
            }
          })
          console.log(`Deleted ${deletedMembers.count} members for clan ${existingClan.id}`)
        } catch (error) {
          console.error('Error deleting clan members:', error)
          throw new Error('Failed to delete clan members')
        }
      }

      // Step 3: Reset clan to default values (instead of deleting)
      try {
        const resetClan = await tx.clan.update({
          where: { id: existingClan.id },
          data: {
            name: `${existingClan.name} (Reset)`,
            offeredPayment: 0,
            membersNeeded: 1,
            terms: 'Clan reset - please update terms',
            isActive: false // Deactivate instead of delete
          }
        })
        console.log(`Reset clan ${existingClan.id}`)
        return resetClan
      } catch (error) {
        console.error('Error resetting clan:', error)
        throw new Error('Failed to reset clan')
      }
    })

    console.log(`Clan reset completed successfully for: ${result.name}`)

    return NextResponse.json({
      message: 'Clan reset successfully - all members and applications removed, clan deactivated',
      resetClan: {
        id: result.id,
        name: result.name,
        isActive: result.isActive
      }
    })
  } catch (error) {
    console.error('Error in clan reset process:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reset clan' },
      { status: 500 }
    )
  }
}