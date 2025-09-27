import { NextRequest, NextResponse } from 'next/server';
import { getRegisteredClans, updateRegisteredClan, deleteRegisteredClan } from '@/lib/clan-storage';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Get registered clans from the file storage
    const clans = await getRegisteredClans();
    const clan = clans.find(c => c.id === id);

    if (!clan) {
      return NextResponse.json(
        { error: 'Clan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(clan);
  } catch (error) {
    console.error('Error fetching clan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clan' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate input
    const { isActive } = body;
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
        { status: 400 }
      );
    }

    // Update clan in file storage
    const updatedClan = await updateRegisteredClan(id, {
      isActive,
      updatedAt: new Date().toISOString()
    });

    if (!updatedClan) {
      return NextResponse.json(
        { error: 'Clan not found' },
        { status: 404 }
      );
    }

    console.log(`Updated clan ${id} isActive to ${isActive}`);

    return NextResponse.json({
      id,
      isActive,
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Delete clan from file storage
    const deleted = await deleteRegisteredClan(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Clan not found' },
        { status: 404 }
      );
    }

    console.log(`Deleted clan ${id}`);

    return NextResponse.json({
      id,
      message: 'Clan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting clan:', error);
    return NextResponse.json(
      { error: 'Failed to delete clan' },
      { status: 500 }
    );
  }
}