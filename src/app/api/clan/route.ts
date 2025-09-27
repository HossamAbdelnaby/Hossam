import { NextRequest, NextResponse } from 'next/server';
import { getRegisteredClans } from '@/lib/clan-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const region = searchParams.get('region') || 'all';
    const type = searchParams.get('type') || 'all';
    const sortBy = searchParams.get('sortBy') || 'trophies';

    // Get registered clans from the file storage
    let clans = await getRegisteredClans();

    // Filter clans based on criteria
    let filteredClans = clans;

    if (region !== 'all') {
      filteredClans = filteredClans.filter(clan => clan.region === region);
    }

    if (type !== 'all') {
      filteredClans = filteredClans.filter(clan => clan.type === type);
    }

    // Sort clans
    filteredClans.sort((a, b) => {
      switch (sortBy) {
        case 'trophies':
          return b.trophies - a.trophies;
        case 'warWins':
          return b.warWins - a.warWins;
        case 'members':
          return b.memberCount - a.memberCount;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClans = filteredClans.slice(startIndex, endIndex);

    return NextResponse.json({
      clans: paginatedClans,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredClans.length / limit),
        totalItems: filteredClans.length,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching clans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clans' },
      { status: 500 }
    );
  }
}