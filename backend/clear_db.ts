import { prisma } from './src/lib/prisma';

async function main() {
  try {
    await prisma.listingColor.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.listing.deleteMany({});
    await prisma.productColor.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("Cleared all tables.");
  } catch (err) {
    console.error("Error clearing tables:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
