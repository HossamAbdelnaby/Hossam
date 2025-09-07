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
      }
    })

    if (!existingClan) {
      return NextResponse.json({ error: 'Clan not found' }, { status: 404 })
    }

    // Use a transaction to ensure all operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Step 1: Delete all clan applications
      try {
        await tx.clanApplication.deleteMany({
          where: {
            clanId: existingClan.id
          }
        })
        console.log(`Deleted all applications for clan ${existingClan.id}`)
      } catch (error) {
        console.error('Error deleting clan applications:', error)
        throw new Error('Failed to delete clan applications')
      }

      // Step 2: Delete all clan members
      try {
        await tx.clanMember.deleteMany({
          where: {
            clanId: existingClan.id
          }
        })
        console.log(`Deleted all members for clan ${existingClan.id}`)
      } catch (error) {
        console.error('Error deleting clan members:', error)
        throw new Error('Failed to delete clan members')
      }

      // Step 3: Finally delete the clan
      try {
        const deletedClan = await tx.clan.delete({
          where: { id: existingClan.id }
        })
        console.log(`Deleted clan ${existingClan.id}`)
        return deletedClan
      } catch (error) {
        console.error('Error deleting clan:', error)
        throw new Error('Failed to delete clan')
      }
    })

    return NextResponse.json({
      message: 'Clan and all related data deleted successfully',
      deletedClan: {
        id: result.id,
        name: result.name
      }
    })
  } catch (error) {
    console.error('Error in force clan deletion:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to force delete clan' },
      { status: 500 }
    )
  }
}