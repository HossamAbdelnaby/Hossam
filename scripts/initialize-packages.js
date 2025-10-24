const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function initializePackages() {
  try {
    console.log('Initializing tournament packages...');

    // Check if packages already exist
    const existingPackages = await prisma.packagePrice.findMany();
    if (existingPackages.length > 0) {
      console.log('Packages already exist, skipping initialization.');
      return;
    }

    // Create default packages
    const packages = [
      {
        packageType: 'FREE',
        name: 'Free Package',
        description: 'Perfect for beginners and small tournaments',
        price: 0,
        currency: 'USD',
        features: JSON.stringify([
          '1 tournament per week',
          'Basic bracket types',
          'Team registration',
          'Basic tournament management'
        ]),
        color: '#10B981',
        isActive: true,
        isEditable: false,
        updatedBy: 'system'
      },
      {
        packageType: 'PAID_GRAPHICS',
        name: 'Graphics Package',
        description: 'Professional tournaments with custom graphics',
        price: 29,
        currency: 'USD',
        features: JSON.stringify([
          'All free features',
          'Logo creation',
          'Graphic design',
          'Multiple stages',
          'Custom graphics',
          'Advanced bracket types'
        ]),
        color: '#3B82F6',
        isActive: true,
        isEditable: true,
        updatedBy: 'system'
      },
      {
        packageType: 'PAID_DISCORD_BOT',
        name: 'Discord Package',
        description: 'Complete solution with Discord integration',
        price: 49,
        currency: 'USD',
        features: JSON.stringify([
          'All graphics features',
          'Discord bot',
          'Server setup',
          'Chat integration',
          'Automated notifications'
        ]),
        color: '#8B5CF6',
        isActive: true,
        isEditable: true,
        updatedBy: 'system'
      },
      {
        packageType: 'FULL_MANAGEMENT',
        name: 'Full Management',
        description: 'Premium experience with complete support',
        price: 99,
        currency: 'USD',
        features: JSON.stringify([
          'All features',
          'Admin support',
          'Social media management',
          'Video editing',
          'Advertising',
          'Priority support',
          'Full tournament management'
        ]),
        color: '#F59E0B',
        isActive: true,
        isEditable: true,
        updatedBy: 'system'
      }
    ];

    for (const pkg of packages) {
      await prisma.packagePrice.create({
        data: pkg
      });
      console.log(`Created package: ${pkg.name}`);
    }

    console.log('Packages initialized successfully!');
  } catch (error) {
    console.error('Error initializing packages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializePackages();
