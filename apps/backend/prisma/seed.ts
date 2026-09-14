// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'demo@medbay.local' },
    update: {},
    create: {
      id: 'demo-user-id-0000-0000-000000000000',
      email: 'demo@medbay.local',
      passwordHash: 'demo',
      firstName: 'Demo',
      lastName: 'User',
      gender: 'unspecified',
    },
  });
}

main().finally(() => prisma.$disconnect());
