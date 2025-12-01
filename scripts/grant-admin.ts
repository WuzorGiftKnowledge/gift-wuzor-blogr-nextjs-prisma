import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function grantAdminToAllUsers() {
  try {
    const result = await prisma.user.updateMany({
      data: {
        isAdmin: true,
      },
    });

    console.log(`✅ Successfully granted admin rights to ${result.count} users`);
  } catch (error) {
    console.error('❌ Error granting admin rights:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

grantAdminToAllUsers();

