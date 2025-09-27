import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getRegisteredClans, updateRegisteredClan } from '@/lib/clan-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('=== CLAN CONTRACT REQUEST START ===');
    
    const token = request.cookies.get('auth-token')?.value;
    console.log('Token found:', !!token);

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('User authenticated:', decoded.userId);

    const body = await request.json();
    const { clanId, message, playerTag, requestedPosition } = body;

    console.log('Clan contract request:', { clanId, playerTag, requestedPosition, userId: decoded.userId });

    // Validate required fields
    if (!clanId || !message || !playerTag || !requestedPosition) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate player tag format (starts with #)
    if (!playerTag.startsWith('#')) {
      return NextResponse.json(
        { error: 'Player tag must start with #' },
        { status: 400 }
      );
    }

    // Get registered clans from the file storage
    const clans = await getRegisteredClans();
    const clan = clans.find(c => c.id === clanId);

    if (!clan) {
      console.log('Clan not found:', clanId);
      return NextResponse.json(
        { error: 'Clan not found' },
        { status: 404 }
      );
    }

    if (!clan.isActive) {
      console.log('Clan not active:', clanId);
      return NextResponse.json(
        { error: 'This clan is not currently accepting applications' },
        { status: 400 }
      );
    }

    console.log('All validations passed, creating clan contract...');

    // Create contract and add to clan's contracts array
    const contract = {
      id: 'contract_' + Date.now(),
      clanId,
      userId: decoded.userId,
      playerTag,
      requestedPosition,
      message: message.trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      clan: {
        id: clan.id,
        name: clan.name,
      },
      user: {
        id: decoded.userId,
        name: 'Applicant User',
      },
    };

    // Add contract to clan's contracts array
    if (!clan.contracts) {
      clan.contracts = [];
    }
    clan.contracts.push(contract);

    // Update the clan in file storage
    await updateRegisteredClan(clanId, { contracts: clan.contracts });

    console.log('Created clan contract:', contract.id);

    // TODO: Send notification to clan leader about new contract application
    console.log('Would send notification to clan leader:', clan.user.id);

    console.log('=== CLAN CONTRACT REQUEST SUCCESS ===');
    return NextResponse.json({
      message: 'Clan contract request sent successfully',
      contract: {
        id: contract.id,
        playerTag,
        requestedPosition,
        message: message.trim(),
        clan: {
          id: clan.id,
          name: clan.name,
        },
        createdAt: contract.createdAt,
      },
    });
  } catch (error) {
    console.error('=== CLAN CONTRACT REQUEST ERROR ===', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send clan contract request' },
      { status: 500 }
    );
  }
}