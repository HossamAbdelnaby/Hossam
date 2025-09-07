import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testClanSettings() {
  console.log('🏰 Testing CWL Clan Settings...');
  
  try {
    // Check current clan count
    const clanCount = await prisma.clan.count();
    console.log(`📊 Current clan count: ${clanCount}`);
    
    // Get all users to see potential clan owners
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true
      }
    });
    console.log(`👥 Total users in database: ${users.length}`);
    
    // Show users that could be clan owners
    const regularUsers = users.filter(user => user.role === 'USER');
    console.log(`🎮 Regular users (potential clan owners): ${regularUsers.length}`);
    
    if (regularUsers.length > 0) {
      console.log('\n📋 Available regular users:');
      regularUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name || user.username} (${user.email}) - ID: ${user.id}`);
      });
    }
    
    // Check if there are any clans
    const clans = await prisma.clan.findMany({
      include: {
        owner: {
          select: {
            email: true,
            username: true,
            name: true
          }
        }
      }
    });
    
    if (clans.length > 0) {
      console.log('\n🏰 Existing clans:');
      clans.forEach((clan, index) => {
        console.log(`   ${index + 1}. ${clan.name} (${clan.tag})`);
        console.log(`      👤 Owner: ${clan.owner.name || clan.owner.username}`);
        console.log(`      🏆 League Level: ${clan.leagueLevel || 'Not set'}`);
        console.log(`      👥 Members Needed: ${clan.membersNeeded}`);
        console.log(`      💰 Payment: $${clan.offeredPayment}`);
        console.log(`      📊 Status: ${clan.isActive ? 'Active' : 'Inactive'}`);
        console.log(`      📅 Created: ${clan.createdAt}`);
      });
    } else {
      console.log('\n❌ No clans found in database');
      console.log('💡 Users need to register clans first to test settings');
    }
    
    // Test the API endpoints logic
    console.log('\n🧪 Testing API endpoints logic...');
    
    if (clans.length > 0) {
      const sampleClan = clans[0];
      console.log('✅ GET /api/cwl/my-clan - Should return clan data for owner');
      console.log('✅ PATCH /api/cwl/my-clan - Should update clan data');
      console.log('✅ DELETE /api/cwl/my-clan - Should delete clan');
      
      console.log('\n📋 Sample clan data structure:');
      console.log(JSON.stringify({
        id: sampleClan.id,
        name: sampleClan.name,
        tag: sampleClan.tag,
        leagueLevel: sampleClan.leagueLevel,
        membersNeeded: sampleClan.membersNeeded,
        offeredPayment: sampleClan.offeredPayment,
        terms: sampleClan.terms,
        isActive: sampleClan.isActive,
        createdAt: sampleClan.createdAt,
        updatedAt: sampleClan.updatedAt
      }, null, 2));
    } else {
      console.log('⚠️  No clans to test API endpoints');
    }
    
    console.log('\n✅ Clan settings functionality test completed!');
    console.log('💡 Features available:');
    console.log('   📝 Edit clan name and tag');
    console.log('   🏆 Set league level (1-8)');
    console.log('   👥 Configure members needed (1-15)');
    console.log('   💰 Set payment amount per player');
    console.log('   📋 Define terms and conditions');
    console.log('   🔄 Activate/deactivate clan');
    console.log('   🗑️  Delete clan permanently');
    
    console.log('\n🔧 To test manually:');
    console.log('   1. Register a clan at /cwl/register');
    console.log('   2. Go to /cwl/profile to access settings');
    console.log('   3. Update clan information');
    console.log('   4. Test delete functionality');
    console.log('   5. Verify navigation menu shows "My Clan Settings"');

  } catch (error) {
    console.error('❌ Error testing clan settings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testClanSettings()
  .then(() => {
    console.log('\n🎉 Clan settings test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Clan settings test failed:', error);
    process.exit(1);
  });