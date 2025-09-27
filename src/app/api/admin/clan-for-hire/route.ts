import { NextRequest, NextResponse } from 'next/server';
import { getRegisteredClans } from '@/lib/clan-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const region = searchParams.get('region') || 'all';
    const type = searchParams.get('type') || 'all';
    const minTrophies = searchParams.get('minTrophies') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const isActive = searchParams.get('isActive') || 'all';

    // Get only registered clans from the file storage
    let clans = await getRegisteredClans();

    // Filter clans based on criteria
    let filteredClans = clans;

    if (search) {
      filteredClans = filteredClans.filter(clan => 
        clan.name.toLowerCase().includes(search.toLowerCase()) ||
        clan.tag.toLowerCase().includes(search.toLowerCase()) ||
        clan.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (region !== 'all') {
      filteredClans = filteredClans.filter(clan => clan.region === region);
    }

    if (type !== 'all') {
      filteredClans = filteredClans.filter(clan => clan.type === type);
    }

    if (minTrophies) {
      const minTroph = parseInt(minTrophies);
      filteredClans = filteredClans.filter(clan => clan.trophies >= minTroph);
    }

    if (maxPrice) {
      const maxPri = parseInt(maxPrice);
      filteredClans = filteredClans.filter(clan => clan.topPlayerPrice <= maxPri);
    }

    if (isActive !== 'all') {
      const active = isActive === 'true';
      filteredClans = filteredClans.filter(clan => clan.isActive === active);
    }

    // Sort clans by creation date (newest first)
    filteredClans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate statistics
    const stats = {
      totalClans: clans.length,
      activeClans: clans.filter(clan => clan.isActive).length,
      totalMembers: clans.reduce((sum, clan) => sum + clan.memberCount, 0),
      averageTopPlayerPrice: clans.length > 0 ? Math.round(clans.reduce((sum, clan) => sum + clan.topPlayerPrice, 0) / clans.length) : 0,
      totalContracts: clans.reduce((sum, clan) => sum + (clan.contracts?.length || 0), 0)
    };

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClans = filteredClans.slice(startIndex, endIndex);

    return NextResponse.json({
      clans: paginatedClans,
      total: filteredClans.length,
      page,
      limit,
      totalPages: Math.ceil(filteredClans.length / limit),
      stats
    });
  } catch (error) {
    console.error('Error fetching clans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clans' },
      { status: 500 }
    );
  }
}