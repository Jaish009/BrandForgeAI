import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const product = await prisma.product.findFirst({
      include: {
        colors: true
      }
    });

    if (product) {
      console.log(JSON.stringify(product, null, 2));
    } else {
      console.log("No products found.");
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
