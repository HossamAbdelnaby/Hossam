import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean up existing data (in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning up existing data...');
    await prisma.adminLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.serviceOrder.deleteMany();
    await prisma.clanApplication.deleteMany();
    await prisma.clanMember.deleteMany();
    await prisma.pusher.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
    await prisma.registrationLog.deleteMany();
    await prisma.match.deleteMany();
    await prisma.tournamentStage.deleteMany();
    await prisma.pendingTournament.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.clan.deleteMany();
    await prisma.service.deleteMany();
    await prisma.news.deleteMany();
    await prisma.packagePrice.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminConfig.deleteMany();
  }

  // 1. Create Admin Configurations
  console.log('⚙️ Creating admin configurations...');
  const adminConfigs = await Promise.all([
    prisma.adminConfig.create({
      data: {
        key: 'SITE_NAME',
        value: 'Clash of Clans Tournament Platform',
        description: 'Site name displayed in header and meta tags',
        updatedBy: 'system'
      }
    }),
    prisma.adminConfig.create({
      data: {
        key: 'SITE_DESCRIPTION',
        value: 'Professional platform for organizing Clash of Clans tournaments and finding skilled players',
        description: 'Site description for SEO and meta tags',
        updatedBy: 'system'
      }
    }),
    prisma.adminConfig.create({
      data: {
        key: 'CONTACT_EMAIL',
        value: 'support@clashtournaments.com',
        description: 'Main contact email for support',
        updatedBy: 'system'
      }
    }),
    prisma.adminConfig.create({
      data: {
        key: 'MAX_FREE_TOURNAMENTS_PER_WEEK',
        value: '1',
        description: 'Maximum number of free tournaments per user per week',
        updatedBy: 'system'
      }
    })
  ]);

  // 2. Create Package Prices
  console.log('💰 Creating tournament packages...');
  const packages = await Promise.all([
    prisma.packagePrice.create({
      data: {
        packageType: 'FREE',
        name: 'Free Package',
        description: 'Perfect for beginners and small tournaments',
        price: 0,
        currency: 'USD',
        features: JSON.stringify([
          '1 tournament per week',
          'Basic bracket types (Single Elimination)',
          'Team registration',
          'Basic tournament management',
          'Standard support'
        ]),
        color: '#10B981',
        isActive: true,
        isEditable: false,
        updatedBy: 'system'
      }
    }),
    prisma.packagePrice.create({
      data: {
        packageType: 'PAID_GRAPHICS',
        name: 'Graphics Package',
        description: 'Professional tournaments with custom graphics',
        price: 29,
        currency: 'USD',
        features: JSON.stringify([
          'All free features',
          'Unlimited tournaments',
          'Logo creation',
          'Graphic design',
          'Multiple stages',
          'Custom graphics',
          'Advanced bracket types (Double Elimination, Swiss, Group Stage)',
          'Priority support'
        ]),
        color: '#3B82F6',
        isActive: true,
        isEditable: true,
        updatedBy: 'system'
      }
    }),
    prisma.packagePrice.create({
      data: {
        packageType: 'PAID_DISCORD_BOT',
        name: 'Discord Package',
        description: 'Complete solution with Discord integration',
        price: 49,
        currency: 'USD',
        features: JSON.stringify([
          'All graphics features',
          'Discord bot integration',
          'Server setup assistance',
          'Chat integration',
          'Automated notifications',
          'Live scoring display',
          'Registration management'
        ]),
        color: '#8B5CF6',
        isActive: true,
        isEditable: true,
        updatedBy: 'system'
      }
    }),
    prisma.packagePrice.create({
      data: {
        packageType: 'FULL_MANAGEMENT',
        name: 'Full Management',
        description: 'Premium experience with complete support',
        price: 99,
        currency: 'USD',
        features: JSON.stringify([
          'All features',
          'Dedicated admin support',
          'Social media management',
          'Video editing & highlights',
          'Advertising promotion',
          '24/7 priority support',
          'Full tournament management',
          'Custom branding',
          'Analytics dashboard'
        ]),
        color: '#F59E0B',
        isActive: true,
        isEditable: true,
        updatedBy: 'system'
      }
    })
  ]);

  // 3. Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    // Admin users
    prisma.user.create({
      data: {
        email: 'admin@clashtournaments.com',
        username: 'admin',
        password: hashedPassword,
        name: 'Super Admin User',
        role: 'SUPER_ADMIN',
        language: 'en',
        avatar: '/uploads/avatars/admin-avatar.jpg'
      }
    }),
    prisma.user.create({
      data: {
        email: 'administrator@clashtournaments.com',
        username: 'administrator',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        language: 'en',
        avatar: '/uploads/avatars/administrator-avatar.jpg'
      }
    }),
    prisma.user.create({
      data: {
        email: 'moderator@clashtournaments.com',
        username: 'moderator',
        password: hashedPassword,
        name: 'Moderator User',
        role: 'MODERATOR',
        language: 'en'
      }
    }),
    // Regular users
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: hashedPassword,
        name: 'John Doe',
        phone: '+1234567890',
        role: 'USER',
        language: 'en',
        description: 'Passionate Clash of Clans player and tournament organizer'
      }
    }),
    prisma.user.create({
      data: {
        email: 'sarah.smith@example.com',
        username: 'sarahsmith',
        password: hashedPassword,
        name: 'Sarah Smith',
        phone: '+1234567891',
        role: 'USER',
        language: 'en',
        description: 'Professional clan leader and tournament host'
      }
    }),
    prisma.user.create({
      data: {
        email: 'mike.wilson@example.com',
        username: 'mikewilson',
        password: hashedPassword,
        name: 'Mike Wilson',
        phone: '+1234567892',
        role: 'USER',
        language: 'en',
        description: 'Experienced pusher available for hire'
      }
    }),
    prisma.user.create({
      data: {
        email: 'emma.brown@example.com',
        username: 'emmabrown',
        password: hashedPassword,
        name: 'Emma Brown',
        phone: '+1234567893',
        role: 'USER',
        language: 'en',
        description: 'CWL clan manager and strategist'
      }
    }),
    prisma.user.create({
      data: {
        email: 'alex.johnson@example.com',
        username: 'alexjohnson',
        password: hashedPassword,
        name: 'Alex Johnson',
        phone: '+1234567894',
        role: 'USER',
        language: 'en',
        description: 'Tournament participant and team captain'
      }
    }),
    prisma.user.create({
      data: {
        email: 'lisa.davis@example.com',
        username: 'lisadavis',
        password: hashedPassword,
        name: 'Lisa Davis',
        phone: '+1234567895',
        role: 'USER',
        language: 'en',
        description: 'Base design specialist and coach'
      }
    })
  ]);

  // 4. Create Pushers (Players for Hire)
  console.log('⚔️ Creating pushers...');
  const pushers = await Promise.all([
    prisma.pusher.create({
      data: {
        userId: users[4].id, // Mike Wilson
        trophies: 5400,
        realName: 'Mike Wilson',
        profilePicture: '/uploads/avatars/pusher-mike.jpg',
        description: 'Experienced TH15 player, maxed heroes, excellent attacker',
        tagPlayer: '#PQR89XYZ',
        price: 50,
        paymentMethod: 'PAYPAL',
        negotiation: true,
        availability: 'STAY',
        status: 'AVAILABLE'
      }
    }),
    prisma.pusher.create({
      data: {
        userId: users[5].id, // Emma Brown
        trophies: 6200,
        realName: 'Emma Brown',
        profilePicture: '/uploads/avatars/pusher-emma.jpg',
        description: 'Professional CWL player, Legend League, all troops maxed',
        tagPlayer: '#ABC123DEF',
        price: 75,
        paymentMethod: 'PAYPAL',
        negotiation: false,
        availability: 'STAY',
        status: 'AVAILABLE'
      }
    }),
    prisma.pusher.create({
      data: {
        userId: users[7].id, // Lisa Davis
        trophies: 4800,
        realName: 'Lisa Davis',
        profilePicture: '/uploads/avatars/pusher-lisa.jpg',
        description: 'TH14 maxed, great at war attacks, available for weekends',
        tagPlayer: '#XYZ789ABC',
        price: 40,
        paymentMethod: 'WESTERN_UNION',
        negotiation: true,
        availability: 'EOS',
        status: 'AVAILABLE'
      }
    })
  ]);

  // 5. Create Services
  console.log('🛠️ Creating services...');
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Base Analysis & Review',
        description: 'Professional analysis of your base layout with improvement suggestions',
        price: 25,
        type: 'BASE_ANALYSIS'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Custom Base Design',
        description: 'Personalized base design for your specific needs (war, farming, trophy pushing)',
        price: 45,
        type: 'CUSTOM_BASE_DESIGN'
      }
    }),
    prisma.service.create({
      data: {
        name: 'Attack Strategy Training',
        description: '1-on-1 coaching session to improve your attack skills',
        price: 35,
        type: 'TRAINING'
      }
    }),
    prisma.service.create({
      data: {
        name: 'War League Strategy',
        description: 'Complete CWL strategy planning and coordination',
        price: 100,
        type: 'TRAINING'
      }
    })
  ]);

  // 6. Create Clans
  console.log('🏰 Creating clans...');
  const clans = await Promise.all([
    prisma.clan.create({
      data: {
        name: 'Elite Warriors',
        tag: 'ELITEW',
        playerCount: 15,
        offeredPayment: 20,
        paymentCurrency: 'USD',
        paymentMethods: JSON.stringify(['PAYPAL', 'WESTERN_UNION']),
        paymentTerms: 'Payment due within 24 hours of CWL start',
        paymentDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        terms: 'Must be active in wars, use both attacks, communicate in clan chat',
        leagueLevel: 3,
        membersNeeded: 2,
        ownerId: users[2].id, // John Doe
        isActive: true
      }
    }),
    prisma.clan.create({
      data: {
        name: 'Dragon Legends',
        tag: 'DRAGL',
        playerCount: 12,
        offeredPayment: 15,
        paymentCurrency: 'USD',
        paymentMethods: JSON.stringify(['PAYPAL']),
        paymentTerms: 'Payment required before CWL registration',
        paymentDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        terms: 'TH13+ required, must participate in clan games',
        leagueLevel: 2,
        membersNeeded: 3,
        ownerId: users[3].id, // Sarah Smith
        isActive: true
      }
    }),
    prisma.clan.create({
      data: {
        name: 'Phoenix Rising',
        tag: 'PHNXR',
        playerCount: 10,
        offeredPayment: 25,
        paymentCurrency: 'USD',
        paymentMethods: JSON.stringify(['BINANCE', 'CRYPTOCURRENCY']),
        paymentTerms: 'Crypto payments accepted, flexible schedule',
        paymentDueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        terms: 'Professional players only, Legend League preferred',
        leagueLevel: 4,
        membersNeeded: 5,
        ownerId: users[5].id, // Emma Brown
        isActive: true
      }
    })
  ]);

  // 7. Create Clan Members
  console.log('👥 Adding clan members...');
  await Promise.all([
    // Elite Warriors members
    prisma.clanMember.create({
      data: {
        clanId: clans[0].id,
        userId: users[2].id, // John Doe (owner)
        playerId: '#ABC123',
        playerTag: '#ABC123'
      }
    }),
    prisma.clanMember.create({
      data: {
        clanId: clans[0].id,
        userId: users[6].id, // Alex Johnson
        playerId: '#DEF456',
        playerTag: '#DEF456'
      }
    }),
    // Dragon Legends members
    prisma.clanMember.create({
      data: {
        clanId: clans[1].id,
        userId: users[3].id, // Sarah Smith (owner)
        playerId: '#GHI789',
        playerTag: '#GHI789'
      }
    }),
    // Phoenix Rising members
    prisma.clanMember.create({
      data: {
        clanId: clans[2].id,
        userId: users[5].id, // Emma Brown (owner)
        playerId: '#JKL012',
        playerTag: '#JKL012'
      }
    })
  ]);

  // 8. Create Tournaments
  console.log('🏆 Creating tournaments...');
  const tournaments = await Promise.all([
    prisma.tournament.create({
      data: {
        name: 'Weekend Warriors Championship',
        description: 'Exciting weekend tournament for players of all levels. Great prizes and fun competition!',
        host: 'Elite Warriors Clan',
        prizeAmount: 500,
        currency: 'USD',
        paymentMethods: JSON.stringify(['PAYPAL', 'CASH']),
        paymentTerms: 'Prizes paid within 48 hours of tournament completion',
        earlyBirdPrice: 10,
        regularPrice: 15,
        latePrice: 20,
        maxTeams: 16,
        registrationStart: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        registrationEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        tournamentStart: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        tournamentEnd: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        status: 'REGISTRATION_OPEN',
        bracketType: 'SINGLE_ELIMINATION',
        packageType: 'PAID_GRAPHICS',
        graphicRequests: 'Tournament logo and bracket graphics',
        rules: 'Standard tournament rules. No modded accounts. Both attacks must be used in war-style attacks.',
        organizerId: users[2].id, // John Doe
        isActive: true
      }
    }),
    prisma.tournament.create({
      data: {
        name: 'Pro League Spring Split',
        description: 'Professional tournament for experienced players and teams. High-level competition with significant prizes.',
        host: 'Dragon Legends',
        prizeAmount: 2000,
        currency: 'USD',
        paymentMethods: JSON.stringify(['PAYPAL', 'BANK_TRANSFER']),
        paymentTerms: '50% advance payment required for registration',
        regularPrice: 50,
        maxTeams: 32,
        registrationStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        registrationEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        tournamentStart: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        tournamentEnd: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        status: 'REGISTRATION_OPEN',
        bracketType: 'DOUBLE_ELIMINATION',
        packageType: 'FULL_MANAGEMENT',
        rules: 'Strict rules for professional play. Replay recording required. No account sharing.',
        organizerId: users[3].id, // Sarah Smith
        isActive: true
      }
    }),
    prisma.tournament.create({
      data: {
        name: 'Community Cup',
        description: 'Fun community tournament for everyone. Free to enter and great for practice!',
        host: 'Clash Tournaments Platform',
        prizeAmount: 100,
        currency: 'USD',
        paymentMethods: JSON.stringify(['CASH']),
        regularPrice: 0,
        maxTeams: 8,
        registrationStart: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        registrationEnd: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        tournamentStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        tournamentEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'REGISTRATION_OPEN',
        bracketType: 'GROUP_STAGE',
        packageType: 'FREE',
        rules: 'Casual tournament rules. All skill levels welcome. Have fun and be respectful!',
        organizerId: users[0].id, // Admin
        isActive: true
      }
    }),
    prisma.tournament.create({
      data: {
        name: 'Masters Invitational',
        description: 'Exclusive tournament for top-tier players only. Invitation required.',
        host: 'Phoenix Rising',
        prizeAmount: 5000,
        currency: 'USD',
        paymentMethods: JSON.stringify(['CRYPTOCURRENCY', 'BANK_TRANSFER']),
        paymentTerms: 'Professional tournament terms apply',
        regularPrice: 100,
        maxTeams: 16,
        registrationStart: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        registrationEnd: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (closed)
        tournamentStart: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        tournamentEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'IN_PROGRESS',
        bracketType: 'SWISS',
        packageType: 'FULL_MANAGEMENT',
        rules: 'Invitational tournament rules. Professional conduct required.',
        organizerId: users[5].id, // Emma Brown
        isActive: true
      }
    })
  ]);

  // 9. Create Tournament Stages
  console.log('📊 Creating tournament stages...');
  await Promise.all([
    // Weekend Warriors stages
    prisma.tournamentStage.create({
      data: {
        name: 'Group Stage',
        type: 'GROUP_STAGE',
        order: 1,
        tournamentId: tournaments[0].id
      }
    }),
    prisma.tournamentStage.create({
      data: {
        name: 'Playoffs',
        type: 'SINGLE_ELIMINATION',
        order: 2,
        tournamentId: tournaments[0].id
      }
    }),
    // Pro League stages
    prisma.tournamentStage.create({
      data: {
        name: 'Group Stage',
        type: 'GROUP_STAGE',
        order: 1,
        tournamentId: tournaments[1].id
      }
    }),
    prisma.tournamentStage.create({
      data: {
        name: 'Winners Bracket',
        type: 'SINGLE_ELIMINATION',
        order: 2,
        tournamentId: tournaments[1].id
      }
    }),
    prisma.tournamentStage.create({
      data: {
        name: 'Losers Bracket',
        type: 'SINGLE_ELIMINATION',
        order: 2,
        tournamentId: tournaments[1].id
      }
    }),
    prisma.tournamentStage.create({
      data: {
        name: 'Grand Finals',
        type: 'SINGLE_ELIMINATION',
        order: 3,
        tournamentId: tournaments[1].id
      }
    })
  ]);

  // 10. Create Teams and Players
  console.log('👨‍👩‍👧‍👦 Creating teams and players...');
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'Elite Squad',
        clanTag: 'ELITEW',
        logo: '/uploads/logos/elite-squad.jpg',
        nationality: 'US',
        userId: users[2].id, // John Doe
        tournamentId: tournaments[0].id
      }
    }),
    prisma.team.create({
      data: {
        name: 'Dragon Force',
        clanTag: 'DRAGL',
        logo: '/uploads/logos/dragon-force.jpg',
        nationality: 'UK',
        userId: users[3].id, // Sarah Smith
        tournamentId: tournaments[0].id
      }
    }),
    prisma.team.create({
      data: {
        name: 'Phoenix Team',
        clanTag: 'PHNXR',
        logo: '/uploads/logos/phoenix-team.jpg',
        nationality: 'CA',
        userId: users[5].id, // Emma Brown
        tournamentId: tournaments[0].id
      }
    }),
    prisma.team.create({
      data: {
        name: 'Warriors United',
        clanTag: 'WARRU',
        logo: '/uploads/logos/warriors-united.jpg',
        nationality: 'AU',
        userId: users[6].id, // Alex Johnson
        tournamentId: tournaments[1].id
      }
    })
  ]);

  // Create players for each team
  await Promise.all([
    // Elite Squad players
    prisma.player.create({
      data: {
        name: 'John Doe',
        username: 'johndoe',
        tag: '#ABC123',
        nationality: 'US',
        teamId: teams[0].id
      }
    }),
    prisma.player.create({
      data: {
        name: 'Mike Ross',
        username: 'mikeross',
        tag: '#DEF456',
        nationality: 'US',
        teamId: teams[0].id
      }
    }),
    // Dragon Force players
    prisma.player.create({
      data: {
        name: 'Sarah Smith',
        username: 'sarahsmith',
        tag: '#GHI789',
        nationality: 'UK',
        teamId: teams[1].id
      }
    }),
    prisma.player.create({
      data: {
        name: 'Tom Wilson',
        username: 'tomwilson',
        tag: '#JKL012',
        nationality: 'UK',
        teamId: teams[1].id
      }
    }),
    // Phoenix Team players
    prisma.player.create({
      data: {
        name: 'Emma Brown',
        username: 'emmabrown',
        tag: '#MNO345',
        nationality: 'CA',
        teamId: teams[2].id
      }
    }),
    prisma.player.create({
      data: {
        name: 'Alex Chen',
        username: 'alexchen',
        tag: '#PQR678',
        nationality: 'CA',
        teamId: teams[2].id
      }
    })
  ]);

  // 11. Create Registration Logs
  console.log('📝 Creating registration logs...');
  await Promise.all([
    prisma.registrationLog.create({
      data: {
        action: 'TEAM_REGISTERED',
        details: JSON.stringify({ registrationType: 'EARLY_BIRD', paymentStatus: 'COMPLETED' }),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        tournamentId: tournaments[0].id,
        teamId: teams[0].id,
        userId: users[2].id
      }
    }),
    prisma.registrationLog.create({
      data: {
        action: 'TEAM_REGISTERED',
        details: JSON.stringify({ registrationType: 'REGULAR', paymentStatus: 'COMPLETED' }),
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        tournamentId: tournaments[0].id,
        teamId: teams[1].id,
        userId: users[3].id
      }
    })
  ]);

  // 12. Create Contracts
  console.log('📄 Creating contracts...');
  await Promise.all([
    prisma.contract.create({
      data: {
        message: 'Looking for a strong TH15 player for our CWL roster. Must be active and use both attacks.',
        clanTag: 'ELITEW',
        status: 'PENDING',
        pusherId: pushers[0].id, // Mike Wilson
        clientId: users[2].id // John Doe
      }
    }),
    prisma.contract.create({
      data: {
        message: 'Need experienced player for weekend tournament. Legend League preferred.',
        clanTag: 'DRAGL',
        status: 'ACCEPTED',
        pusherId: pushers[1].id, // Emma Brown
        clientId: users[3].id // Sarah Smith
      }
    })
  ]);

  // 13. Create Service Orders
  console.log('🛒 Creating service orders...');
  await Promise.all([
    prisma.serviceOrder.create({
      data: {
        requirements: 'Please analyze my war base and suggest improvements for TH15',
        status: 'COMPLETED',
        serviceId: services[0].id, // Base Analysis
        userId: users[6].id // Alex Johnson
      }
    }),
    prisma.serviceOrder.create({
      data: {
        requirements: 'Need a custom farming base design for TH14 that protects resources well',
        status: 'IN_PROGRESS',
        serviceId: services[1].id, // Custom Base Design
        userId: users[7].id // Lisa Davis
      }
    })
  ]);

  // 14. Create Payments
  console.log('💳 Creating payments...');
  await Promise.all([
    prisma.payment.create({
      data: {
        amount: 10,
        type: 'TOURNAMENT_FEE',
        method: 'PAYPAL',
        status: 'COMPLETED',
        transactionId: 'TXN123456789',
        currency: 'USD',
        description: 'Early bird registration for Weekend Warriors Championship',
        completedAt: new Date(),
        userId: users[2].id, // John Doe
        tournamentId: tournaments[0].id
      }
    }),
    prisma.payment.create({
      data: {
        amount: 15,
        type: 'TOURNAMENT_FEE',
        method: 'PAYPAL',
        status: 'COMPLETED',
        transactionId: 'TXN987654321',
        currency: 'USD',
        description: 'Regular registration for Weekend Warriors Championship',
        completedAt: new Date(),
        userId: users[3].id, // Sarah Smith
        tournamentId: tournaments[0].id
      }
    }),
    prisma.payment.create({
      data: {
        amount: 50,
        type: 'PLAYER_RENTAL',
        method: 'PAYPAL',
        status: 'PENDING',
        currency: 'USD',
        description: 'Payment for pusher services - Emma Brown',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: users[3].id, // Sarah Smith
        contractId: (await prisma.contract.findFirst({ where: { status: 'ACCEPTED' } }))!.id
      }
    }),
    prisma.payment.create({
      data: {
        amount: 25,
        type: 'SERVICE_FEE',
        method: 'PAYPAL',
        status: 'COMPLETED',
        transactionId: 'TXN555666777',
        currency: 'USD',
        description: 'Base analysis service fee',
        completedAt: new Date(),
        userId: users[6].id, // Alex Johnson
        serviceOrderId: (await prisma.serviceOrder.findFirst({ where: { status: 'COMPLETED' } }))!.id
      }
    })
  ]);

  // 15. Create Messages
  console.log('💬 Creating messages...');
  await Promise.all([
    prisma.message.create({
      data: {
        content: 'Hi! I saw your profile. Are you available for this weekend?',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        readAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        senderId: users[2].id, // John Doe
        receiverId: users[4].id, // Mike Wilson
        pusherId: pushers[0].id
      }
    }),
    prisma.message.create({
      data: {
        content: 'Yes, I\'m available! What are the details?',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        readAt: new Date(),
        senderId: users[4].id, // Mike Wilson
        receiverId: users[2].id, // John Doe
        pusherId: pushers[0].id
      }
    }),
    prisma.message.create({
      data: {
        content: 'The tournament starts this Saturday. Prize pool is $500. Are you interested?',
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        senderId: users[2].id, // John Doe
        receiverId: users[4].id, // Mike Wilson
        pusherId: pushers[0].id
      }
    })
  ]);

  // 16. Create Notifications
  console.log('🔔 Creating notifications...');
  await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Tournament Registration Open',
        message: 'Weekend Warriors Championship is now open for registration!',
        type: 'TOURNAMENT_UPDATE',
        userId: users[2].id // John Doe
      }
    }),
    prisma.notification.create({
      data: {
        title: 'Contract Accepted',
        message: 'Emma Brown has accepted your contract offer.',
        type: 'CONTRACT_STATUS',
        isRead: true,
        userId: users[3].id // Sarah Smith
      }
    }),
    prisma.notification.create({
      data: {
        title: 'New Message',
        message: 'You have a new message from John Doe.',
        type: 'CHAT_MESSAGE',
        userId: users[4].id // Mike Wilson
      }
    }),
    prisma.notification.create({
      data: {
        title: 'Payment Received',
        message: 'Your payment for base analysis service has been received.',
        type: 'PAYMENT_STATUS',
        isRead: true,
        userId: users[6].id // Alex Johnson
      }
    })
  ]);

  // 17. Create News
  console.log('📰 Creating news articles...');
  await Promise.all([
    prisma.news.create({
      data: {
        title: 'Weekend Warriors Championship Announced',
        content: 'Join us for an exciting weekend tournament with prizes up to $500! Registration is now open for players of all levels. Don\'t miss this chance to showcase your skills and compete against other passionate Clash of Clans players.',
        imageUrl: '/uploads/news/tournament-announcement.jpg',
        isActive: true
      }
    }),
    prisma.news.create({
      data: {
        title: 'New Pusher Services Available',
        content: 'We\'re excited to announce that our pusher services have been expanded! Now you can find skilled players for hire with various trophy ranges and specializations. Whether you need someone for CWL, regular wars, or tournaments, we\'ve got you covered.',
        imageUrl: '/uploads/news/pusher-services.jpg',
        isActive: true
      }
    }),
    prisma.news.create({
      data: {
        title: 'Platform Updates - New Features',
        content: 'Check out our latest platform updates including improved tournament management, better chat features, and enhanced payment processing. We\'re constantly working to make your experience better and provide the best Clash of Clans tournament platform available.',
        imageUrl: '/uploads/news/platform-updates.jpg',
        isActive: true
      }
    })
  ]);

  // 18. Create Clan Applications
  console.log('📋 Creating clan applications...');
  await Promise.all([
    prisma.clanApplication.create({
      data: {
        name: 'David Miller',
        playerTag: '#STU789',
        paymentMethod: 'PAYPAL',
        paymentAmount: 20,
        paymentStatus: 'COMPLETED',
        notes: 'Active player, TH15 maxed, available for all wars',
        status: 'ACCEPTED',
        clanId: clans[0].id, // Elite Warriors
        userId: users[6].id // Alex Johnson
      }
    }),
    prisma.clanApplication.create({
      data: {
        name: 'Jennifer Lee',
        playerTag: '#VWX012',
        paymentMethod: 'WESTERN_UNION',
        paymentAmount: 15,
        paymentStatus: 'PENDING',
        notes: 'TH14, working on heroes, very active',
        status: 'PENDING',
        clanId: clans[1].id, // Dragon Legends
        userId: users[7].id // Lisa Davis
      }
    })
  ]);

  // 19. Create Admin Logs
  console.log('📊 Creating admin logs...');
  await Promise.all([
    prisma.adminLog.create({
      data: {
        action: 'CREATE_TOURNAMENT',
        targetId: tournaments[0].id,
        targetType: 'Tournament',
        details: JSON.stringify({ tournamentName: 'Weekend Warriors Championship', prizeAmount: 500 }),
        userId: users[0].id, // Admin
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Admin Panel)'
      }
    }),
    prisma.adminLog.create({
      data: {
        action: 'UPDATE_PACKAGE_PRICE',
        targetId: packages[1].id,
        targetType: 'PackagePrice',
        details: JSON.stringify({ packageType: 'PAID_GRAPHICS', newPrice: 29 }),
        userId: users[0].id, // Admin
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Admin Panel)'
      }
    }),
    prisma.adminLog.create({
      data: {
        action: 'APPROVE_CLAN_APPLICATION',
        targetId: clans[0].id,
        targetType: 'Clan',
        details: JSON.stringify({ clanName: 'Elite Warriors', applicationId: 'APP001' }),
        userId: users[1].id, // Moderator
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Admin Panel)'
      }
    })
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users: ${users.length}`);
  console.log(`⚔️ Pushers: ${pushers.length}`);
  console.log(`🏰 Clans: ${clans.length}`);
  console.log(`🏆 Tournaments: ${tournaments.length}`);
  console.log(`👨‍👩‍👧‍👦 Teams: ${teams.length}`);
  console.log(`💰 Packages: ${packages.length}`);
  console.log(`🛠️ Services: ${services.length}`);
  console.log(`💬 Messages: 3`);
  console.log(`🔔 Notifications: 4`);
  console.log(`📰 News: 3`);
  console.log(`💳 Payments: 4`);
  console.log(`📋 Applications: 2`);
  
  console.log('\n🔑 Login Credentials:');
  console.log('Super Admin: admin@clashtournaments.com / password123');
  console.log('Admin: administrator@clashtournaments.com / password123');
  console.log('Moderator: moderator@clashtournaments.com / password123');
  console.log('User: john.doe@example.com / password123');
  console.log('User: sarah.smith@example.com / password123');
  console.log('User: mike.wilson@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });