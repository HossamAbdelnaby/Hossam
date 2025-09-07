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
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        _count: {
          select: {
            members: true,
            applications: true
          }
        }
      }
    })

    if (!clan) {
      return NextResponse.json({ error: 'Clan not found' }, { status: 404 })
    }

    return NextResponse.json({
      clan: {
        id: clan.id,
        name: clan.name,
        tag: clan.tag,
        leagueLevel: clan.leagueLevel,
        membersNeeded: clan.membersNeeded,
        offeredPayment: clan.offeredPayment,
        terms: clan.terms,
        isActive: clan.isActive,
        createdAt: clan.createdAt.toISOString(),
        updatedAt: clan.updatedAt.toISOString(),
        owner: clan.owner
      }
    })
  } catch (error) {
    console.error('Error fetching clan details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clan details' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, tag, leagueLevel, membersNeeded, offeredPayment, terms, isActive } = body

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

    // Update the clan
    const updatedClan = await db.clan.update({
      where: { id: existingClan.id },
      data: {
        ...(name && { name }),
        ...(tag && { tag }),
        ...(leagueLevel !== undefined && { leagueLevel }),
        ...(membersNeeded !== undefined && { membersNeeded }),
        ...(offeredPayment !== undefined && { offeredPayment }),
        ...(terms !== undefined && { terms }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Clan updated successfully',
      clan: {
        id: updatedClan.id,
        name: updatedClan.name,
        tag: updatedClan.tag,
        leagueLevel: updatedClan.leagueLevel,
        membersNeeded: updatedClan.membersNeeded,
        offeredPayment: updatedClan.offeredPayment,
        terms: updatedClan.terms,
        isActive: updatedClan.isActive,
        createdAt: updatedClan.createdAt.toISOString(),
        updatedAt: updatedClan.updatedAt.toISOString(),
        owner: updatedClan.owner
      }
    })
  } catch (error) {
    console.error('Error updating clan:', error)
    return NextResponse.json(
      { error: 'Failed to update clan' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    // Check if there are related records that might prevent deletion
    if (existingClan._count.members > 0 || existingClan._count.applications > 0) {
      // Delete related records first
      try {
        // Delete all clan applications
        await db.clanApplication.deleteMany({
          where: {
            clanId: existingClan.id
          }
        })

        // Delete all clan members
        await db.clanMember.deleteMany({
          where: {
            clanId: existingClan.id
          }
        })
      } catch (error) {
        console.error('Error deleting related records:', error)
        return NextResponse.json(
          { error: 'Failed to delete clan: Could not remove related records' },
          { status: 500 }
        )
      }
    }

    // Now delete the clan
    try {
      await db.clan.delete({
        where: { id: existingClan.id }
      })
    } catch (error) {
      console.error('Error deleting clan:', error)
      return NextResponse.json(
        { error: 'Failed to delete clan: Database constraint error' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Clan deleted successfully'
    })
  } catch (error) {
    console.error('Error in clan deletion process:', error)
    return NextResponse.json(
      { error: 'Failed to delete clan: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}