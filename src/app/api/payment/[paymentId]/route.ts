import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentId } = await params
    const body = await request.json()
    const { status, transactionId, failureReason, paymentDetails } = body

    // Find the payment
    const payment = await db.payment.findFirst({
      where: {
        id: paymentId,
        userId: session.user.id
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Update payment
    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (transactionId) {
      updateData.transactionId = transactionId
    }

    if (failureReason) {
      updateData.failureReason = failureReason
    }

    if (paymentDetails) {
      updateData.paymentDetails = JSON.stringify(paymentDetails)
    }

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date()
    }

    const updatedPayment = await db.payment.update({
      where: { id: paymentId },
      data: updateData
    })

    // If payment is completed and it's for a clan application, update the application status
    if (status === 'COMPLETED' && payment.clanApplicationId) {
      await db.clanApplication.update({
        where: { id: payment.clanApplicationId },
        data: {
          paymentStatus: 'COMPLETED',
          paymentAmount: payment.amount
        }
      })
    }

    return NextResponse.json({
      message: 'Payment updated successfully',
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status,
        transactionId: updatedPayment.transactionId,
        completedAt: updatedPayment.completedAt
      }
    })

  } catch (error) {
    console.error('Payment update error:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentId } = await params

    const payment = await db.payment.findFirst({
      where: {
        id: paymentId,
        userId: session.user.id
      },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            url: true
          }
        },
        clan: {
          select: {
            id: true,
            name: true,
            tag: true
          }
        },
        clanApplication: {
          select: {
            id: true,
            name: true,
            playerTag: true,
            status: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json({
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        type: payment.type,
        method: payment.method,
        status: payment.status,
        description: payment.description,
        transactionId: payment.transactionId,
        paymentDetails: payment.paymentDetails ? JSON.parse(payment.paymentDetails) : null,
        metadata: payment.metadata ? JSON.parse(payment.metadata) : null,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt,
        failureReason: payment.failureReason,
        tournament: payment.tournament,
        clan: payment.clan,
        clanApplication: payment.clanApplication
      }
    })

  } catch (error) {
    console.error('Payment fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    )
  }
}