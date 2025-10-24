const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Creating test user...');

    // Check if test user already exists
    const existingUser = await prisma.user.findFirst({
      where: { username: 'testuser' }
    });

    if (existingUser) {
      console.log('Test user already exists:', existingUser.username);
      console.log('Email:', existingUser.email);
      console.log('Password: test123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
        language: 'en'
      }
    });

    console.log('Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Username: testuser');
    console.log('Password: test123');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
