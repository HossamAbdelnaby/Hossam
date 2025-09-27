import { NextRequest, NextResponse } from 'next/server';
import { getRegisteredClans, updateRegisteredClan } from '@/lib/clan-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clanId = params.id;
    console.log('Fetching clan with ID:', clanId);

    // Get registered clans from the file storage
    const clans = await getRegisteredClans();
    
    // Find the specific clan by ID
    const clan = clans.find(c => c.id === clanId);

    if (!clan) {
      return NextResponse.json(
        { error: 'Clan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      clan: clan,
    });
  } catch (error) {
    console.error('Error fetching clan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clan' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clanId = params.id;
    console.log('Updating clan with ID:', clanId);

    const body = await request.json();
    
    // Get registered clans from the file storage
    const clans = await getRegisteredClans();
    
    // Find the specific clan by ID
    const clanIndex = clans.findIndex(c => c.id === clanId);

    if (clanIndex === -1) {
      return NextResponse.json(
        { error: 'Clan not found' },
        { status: 404 }
      );
    }

    // Update the clan with new data
    const updatedClan = {
      ...clans[clanIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    clans[clanIndex] = updatedClan;
    
    // Save the updated clans
    await updateRegisteredClan(clanId, updatedClan);

    return NextResponse.json({
      clan: updatedClan,
      message: 'Clan updated successfully'
    });
  } catch (error) {
    console.error('Error updating clan:', error);
    return NextResponse.json(
      { error: 'Failed to update clan' },
      { status: 500 }
    );
  }
}