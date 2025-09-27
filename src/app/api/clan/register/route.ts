import { NextRequest, NextResponse } from 'next/server';
import { addRegisteredClan } from '@/lib/clan-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract form data
    const {
      clanName,
      clanTag,
      description,
      region,
      language,
      type,
      trophies,
      warWins,
      warWinStreak,
      currentMembers,
      terms,
      pricingTiers,
      requirements,
      userId,
      userEmail,
      userName
    } = body;

    // Validate required fields
    if (!clanName || !clanTag || !region || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate clan tag format
    if (!clanTag.startsWith('#')) {
      return NextResponse.json(
        { error: 'Clan tag must start with #' },
        { status: 400 }
      );
    }

    // Process pricing tiers to extract standard prices
    let topPlayerPrice = 100;
    let coLeaderPrice = 75;
    let memberPrice = 50;

    pricingTiers.forEach((tier: any) => {
      const price = parseInt(tier.price) || 0;
      const position = tier.position.toLowerCase();
      
      if (position.includes('top') || position.includes('leader')) {
        topPlayerPrice = price;
      } else if (position.includes('co') || position.includes('elder')) {
        coLeaderPrice = price;
      } else {
        memberPrice = price;
      }
    });

    // Process requirements
    const processedRequirements = {
      required: requirements
        .filter((req: any) => req.isRequired && req.title)
        .map((req: any) => req.title),
      preferred: requirements
        .filter((req: any) => !req.isRequired && req.title)
        .map((req: any) => req.title)
    };

    // Create new clan object
    const newClan = {
      id: `clan${Date.now()}`,
      name: clanName,
      tag: clanTag,
      description: description || '',
      region: region,
      language: language || 'English',
      type: type,
      trophies: parseInt(trophies) || 0,
      warWins: parseInt(warWins) || 0,
      warWinStreak: parseInt(warWinStreak) || 0,
      memberCount: parseInt(currentMembers) || 0,
      topPlayerPrice,
      coLeaderPrice,
      memberPrice,
      requirements: processedRequirements,
      terms: terms || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: userId || 'unknown',
        email: userEmail || 'unknown@example.com',
        name: userName || 'Unknown User',
      },
      contracts: []
    };

    // Save clan to file storage
    await addRegisteredClan(newClan);

    console.log('New clan registered:', newClan);

    return NextResponse.json({
      success: true,
      clan: newClan,
      message: 'Clan registered successfully'
    });

  } catch (error) {
    console.error('Error registering clan:', error);
    return NextResponse.json(
      { error: 'Failed to register clan' },
      { status: 500 }
    );
  }
}