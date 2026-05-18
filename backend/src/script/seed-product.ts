import "dotenv/config"
import { prisma } from "../lib/prisma";
import { SIZE_OPTIONS } from "../constants";

const TSHIRT_TRANSPARENT_IMAGE_URL = "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687866/t-shirt-transparent-front_ulejct.png"
const HOODIE_TRANSPARENT_IMAGE_URL = "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687868/hoodies-transparent-front_u5bfn3.png"
const MUG_BASE_IMAGE_URL = "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000323/Brandforge-ai/products/mug/mug-transparent-base.png"
const PHONECASE_BASE_IMAGE_URL = "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000326/Brandforge-ai/products/phonecase/phonecase-transparent-base.png"
const CAP_BASE_IMAGE_URL = "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000328/Brandforge-ai/products/cap/cap-transparent-base.png"

const TSHIRT_PRINTABLE_AREA = {
  top: 177,
  left: 216,
  width: 247,
  height: 329
};
const HOODIE_PRINTABLE_AREA = {
  top: 197,
  left: 188,
  width: 284,
  height: 223
};
const MUG_PRINTABLE_AREA = {
  top: 200,
  left: 280,
  width: 460,
  height: 380
};
const PHONECASE_PRINTABLE_AREA = {
  top: 160,
  left: 300,
  width: 420,
  height: 600
};
const CAP_PRINTABLE_AREA = {
  top: 220,
  left: 310,
  width: 400,
  height: 250
};


const products = [
  //Default template for editor
  {
    type: "TSHIRT" as const,
    template: true,
    section: "catalog" as const,
    name: "Classic Crew Neck T-Shirt",
    body: "Classic, 100% Airlum Combed and Ring-Spun Cotton",
    basePrice: 22.99,
    sizes: [...SIZE_OPTIONS],
    baseUrl: TSHIRT_TRANSPARENT_IMAGE_URL,
    displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_2_1746137518653_uor1ax.png",
    printableAreaTop: TSHIRT_PRINTABLE_AREA.top,
    printableAreaLeft: TSHIRT_PRINTABLE_AREA.left,
    printableAreaWidth: TSHIRT_PRINTABLE_AREA.width,
    printableAreaHeight: TSHIRT_PRINTABLE_AREA.height,
  },
  {
    type: "HOODIE" as const,
    template: true,
    section: "catalog" as const,
    name: "Unisex Classic Pullover Hoodie",
    body: "Classic, 80% Cotton",
    basePrice: 39.99,
    sizes: [...SIZE_OPTIONS],
    baseUrl: HOODIE_TRANSPARENT_IMAGE_URL,
    displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_4_1746137644730_ctynsg.png",
    printableAreaTop: HOODIE_PRINTABLE_AREA.top,
    printableAreaLeft: HOODIE_PRINTABLE_AREA.left,
    printableAreaWidth: HOODIE_PRINTABLE_AREA.width,
    printableAreaHeight: HOODIE_PRINTABLE_AREA.height,
  },
  {
    type: "MUG" as const,
    template: true,
    section: "catalog" as const,
    name: "Classic Ceramic Coffee Mug",
    body: "11oz Premium Ceramic, Dishwasher & Microwave Safe",
    basePrice: 14.99,
    sizes: ["11oz", "15oz"],
    baseUrl: MUG_BASE_IMAGE_URL,
    displayUrl: MUG_BASE_IMAGE_URL,
    printableAreaTop: MUG_PRINTABLE_AREA.top,
    printableAreaLeft: MUG_PRINTABLE_AREA.left,
    printableAreaWidth: MUG_PRINTABLE_AREA.width,
    printableAreaHeight: MUG_PRINTABLE_AREA.height,
  },
  {
    type: "PHONECASE" as const,
    template: true,
    section: "catalog" as const,
    name: "Slim Snap Phone Case",
    body: "Premium Hard Shell, Matte Finish, Wireless Charging Compatible",
    basePrice: 19.99,
    sizes: ["iPhone 14", "iPhone 15", "iPhone 16", "Samsung S24"],
    baseUrl: PHONECASE_BASE_IMAGE_URL,
    displayUrl: PHONECASE_BASE_IMAGE_URL,
    printableAreaTop: PHONECASE_PRINTABLE_AREA.top,
    printableAreaLeft: PHONECASE_PRINTABLE_AREA.left,
    printableAreaWidth: PHONECASE_PRINTABLE_AREA.width,
    printableAreaHeight: PHONECASE_PRINTABLE_AREA.height,
  },
  {
    type: "CAP" as const,
    template: true,
    section: "catalog" as const,
    name: "Classic Snapback Cap",
    body: "100% Cotton Twill, Adjustable Snapback Closure",
    basePrice: 18.99,
    sizes: ["One Size"],
    baseUrl: CAP_BASE_IMAGE_URL,
    displayUrl: CAP_BASE_IMAGE_URL,
    printableAreaTop: CAP_PRINTABLE_AREA.top,
    printableAreaLeft: CAP_PRINTABLE_AREA.left,
    printableAreaWidth: CAP_PRINTABLE_AREA.width,
    printableAreaHeight: CAP_PRINTABLE_AREA.height,
  },

  //Not the default template for display only
  {
    type: "TSHIRT" as const,
    template: false,
    section: "catalog" as const,
    name: "Women's Classic T-Shirt",
    body: "Classic, 100% Airlum Combed and Ring-Spun Cotton",
    displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_3_1746137611266_jctugl.png",
  },
  {
    type: "TSHIRT" as const,
    template: false,
    section: "featured" as const,
    name: "Relaxed Fit Basic T-Shirt",
    body: "100% Combed Ring-Spun Cotton, lightweight",
    displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689759/model-03642-preview_compressed_wz5n8y.webp",
  },
  {
    type: "TSHIRT" as const,
    template: false,
    section: "featured" as const,
    name: "Relaxed Fit T-Shirt",
    body: "100% Combed Ring-Spun Cotton, Breathable",
    displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689759/model-03661-preview_compressed_p6m3s6.webp",
  },
  {
    type: "HOODIE" as const,
    template: false,
    section: "featured" as const,
    name: "Soft Fleece Hoodie",
    body: "80% Cotton, 20% Polyester, fleece lined",
    displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689760/hoodie-1868-preview_nmxlky.webp",
  },
  {
    type: "HOODIE" as const,
    template: false,
    section: "featured" as const,
    name: "Classic Pullover Hoodie",
    body: "80% Cotton, 20% Polyester, kangaroo pocket",
    displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689759/hoodie-1866-preview_gwckg3.webp",
  },
  {
    type: "MUG" as const,
    template: false,
    section: "featured" as const,
    name: "Travel Ceramic Mug",
    body: "15oz Double-Wall Ceramic, Heat Retention",
    displayUrl: MUG_BASE_IMAGE_URL,
  },
  {
    type: "PHONECASE" as const,
    template: false,
    section: "featured" as const,
    name: "Tough Impact Phone Case",
    body: "Dual-Layer Protection, Drop Tested",
    displayUrl: PHONECASE_BASE_IMAGE_URL,
  },
  {
    type: "CAP" as const,
    template: false,
    section: "featured" as const,
    name: "Dad Hat Cap",
    body: "100% Washed Cotton, Low Profile, Adjustable Strap",
    displayUrl: CAP_BASE_IMAGE_URL,
  },
];


const seedProducts = async () => {
  try {
    // Clear dependent tables first (FK constraints)
    await prisma.listingColor.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.listing.deleteMany({});
    await prisma.productColor.deleteMany({});
    const deleted = await prisma.product.deleteMany({});
    console.log(`Cleared ${deleted.count} existing products (and related data)`);
    // insert
    const created = await prisma.product.createMany({
      data: products,
    });
    console.log(`Seeded ${created.count} products`);

    // List the created products
    const allProducts = await prisma.product.findMany();
    allProducts.forEach((pr) => console.log(`- ${pr.id} ${pr.name}`));
  } catch (error) {
    console.log(error, "Error seeding products");
    process.exit(1)
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts()
