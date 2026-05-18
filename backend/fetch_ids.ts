import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const listing = await prisma.listing.findFirst({
      include: {
        colors: {
          include: {
            color: true
          }
        }
      }
    });

    if (listing) {
      console.log(JSON.stringify({
        listingId: listing.id,
        colorId: listing.colors[0]?.colorId
      }, null, 2));
    } else {
      console.log("No listings found.");
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
