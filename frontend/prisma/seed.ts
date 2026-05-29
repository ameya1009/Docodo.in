import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 'user_demo_2026';
  
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'demo@docodo.in',
      name: 'Docodo Global Admin',
      credits: 1240,
    },
  });

  // Create some initial tool usage log to simulate past activity
  await prisma.toolUsage.create({
    data: {
      userId,
      toolName: 'Zapier Agent Lead Sync',
      creditsUsed: 10,
    }
  });

  await prisma.toolUsage.create({
    data: {
      userId,
      toolName: 'Botpress Appointment Bot',
      creditsUsed: 8,
    }
  });

  console.log('Seeded database with demo user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
