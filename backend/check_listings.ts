import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        template: true,
        colors: {
          include: {
            color: true
          }
        }
      }
    });

    console.log(JSON.stringify(listings, null, 2));
  } catch (err) {
    console.error("Error fetching listings:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
