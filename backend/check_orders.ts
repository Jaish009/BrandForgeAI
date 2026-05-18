import { prisma } from './src/lib/prisma';

async function main() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(orders, null, 2));
}

main().finally(() => prisma.$disconnect());
