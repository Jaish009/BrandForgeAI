import { prisma } from './src/lib/prisma';
import slugify from 'slugify';

async function main() {
  try {
    // 1. Get or create a user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          emailVerified: true,
          image: "https://avatar.iran.liara.run/public/1"
        }
      });
      console.log("Created user:", user.id);
    }

    // 2. Get a template product
    const product = await prisma.product.findFirst({
      where: { template: true },
      include: { colors: true }
    });

    if (!product) {
      console.log("No template product found. Seed the products first.");
      return;
    }

    // 3. Create a listing
    const title = "Sample Custom T-Shirt";
    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        templateId: product.id,
        title: title,
        slug: slugify(title, { lower: true }) + "-" + Date.now(),
        sellingPrice: 29.99,
        artworkUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_2_1746137518653_uor1ax.png",
        artworkPlacementTop: 10,
        artworkPlacementLeft: 10,
        artworkPlacementWidth: 50,
        artworkPlacementHeight: 50,
        artworkPlacementRefDisplayWidth: 500,
        colors: {
          create: product.colors.map(c => ({
            colorId: c.id
          }))
        }
      },
      include: {
        colors: true
      }
    });

    console.log(JSON.stringify({
      listingId: listing.id,
      colorId: listing.colors[0]?.colorId
    }, null, 2));

  } catch (err) {
    console.error("Error creating listing:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
