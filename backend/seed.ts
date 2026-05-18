import { prisma } from './src/lib/prisma';

async function main() {
  try {
    console.log("Seeding data...");

    // 1. Create Template Product
    const tShirt = await prisma.product.upsert({
      where: { id: "t-shirt-template" },
      update: {},
      create: {
        id: "t-shirt-template",
        type: "TSHIRT",
        template: true,
        section: "featured",
        name: "Classic Cotton T-Shirt",
        body: "High quality 100% cotton t-shirt.",
        displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_2_1746137518653_uor1ax.png",
        basePrice: 15.00,
        baseUrl: "https://techwithemma.com",
        sizes: ["S", "M", "L", "XL", "2XL"],
        printableAreaTop: 10,
        printableAreaLeft: 10,
        printableAreaWidth: 80,
        printableAreaHeight: 80,
        colors: {
          create: [
            {
              name: "White",
              color: "#FFFFFF",
              mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_2_1746137518653_uor1ax.png"
            },
            {
              name: "Black",
              color: "#000000",
              mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_2_1746137518653_uor1ax.png"
            }
          ]
        }
      }
    });

    // 2. Create Catalog Product
    await prisma.product.upsert({
      where: { id: "hoodie-template" },
      update: {},
      create: {
        id: "hoodie-template",
        type: "HOODIE",
        template: true,
        section: "catalog",
        name: "Premium Hoodie",
        body: "Warm and cozy premium hoodie.",
        displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_2_1746137518653_uor1ax.png",
        basePrice: 35.00,
        baseUrl: "https://techwithemma.com",
        sizes: ["S", "M", "L", "XL", "2XL"],
        printableAreaTop: 15,
        printableAreaLeft: 15,
        printableAreaWidth: 70,
        printableAreaHeight: 70,
        colors: {
          create: [
            {
              name: "Gray",
              color: "#808080",
              mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_2_1746137518653_uor1ax.png"
            }
          ]
        }
      }
    });

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
