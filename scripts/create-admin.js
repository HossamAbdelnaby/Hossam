const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('👑 Creating regular admin user...');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'administrator@clashtournaments.com' },
          { username: 'administrator' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists:');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'administrator@clashtournaments.com',
        username: 'administrator',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        language: 'en',
        avatar: '/uploads/avatars/administrator-avatar.jpg'
      }
    });

    console.log('✅ Regular admin user created successfully!');
    console.log('📧 Email: administrator@clashtournaments.com');
    console.log('👤 Username: administrator');
    console.log('🔐 Password: password123');
    console.log('👑 Role: ADMIN (Regular - Not Super Admin)');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();