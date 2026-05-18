"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("../lib/prisma");
const constants_1 = require("../constants");
const TSHIRT_TRANSPARENT_IMAGE_URL = "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687866/t-shirt-transparent-front_ulejct.png";
const HOODIE_TRANSPARENT_IMAGE_URL = "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687868/hoodies-transparent-front_u5bfn3.png";
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
const products = [
    //Default template for editor
    {
        type: "TSHIRT",
        template: true,
        section: "catalog",
        name: "Classic Crew Neck T-Shirt",
        body: "Classic, 100% Airlum Combed and Ring-Spun Cotton",
        basePrice: 22.99,
        sizes: [...constants_1.SIZE_OPTIONS],
        baseUrl: TSHIRT_TRANSPARENT_IMAGE_URL,
        displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_2_1746137518653_uor1ax.png",
        printableAreaTop: TSHIRT_PRINTABLE_AREA.top,
        printableAreaLeft: TSHIRT_PRINTABLE_AREA.left,
        printableAreaWidth: TSHIRT_PRINTABLE_AREA.width,
        printableAreaHeight: TSHIRT_PRINTABLE_AREA.height,
    },
    {
        type: "HOODIE",
        template: true,
        section: "catalog",
        name: "Unisex Classic Pullover Hoodie",
        body: "Classic, 80% Cotton",
        basePrice: 39.99,
        sizes: [...constants_1.SIZE_OPTIONS],
        baseUrl: HOODIE_TRANSPARENT_IMAGE_URL,
        displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_4_1746137644730_ctynsg.png",
        printableAreaTop: HOODIE_PRINTABLE_AREA.top,
        printableAreaLeft: HOODIE_PRINTABLE_AREA.left,
        printableAreaWidth: HOODIE_PRINTABLE_AREA.width,
        printableAreaHeight: HOODIE_PRINTABLE_AREA.height,
    },
    //Not the default template for display only
    {
        type: "TSHIRT",
        template: false,
        section: "catalog",
        name: "Women's Classic T-Shirt",
        body: "Classic, 100% Airlum Combed and Ring-Spun Cotton",
        displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689131/featured_product_3_1746137611266_jctugl.png",
    },
    {
        type: "TSHIRT",
        template: false,
        section: "featured",
        name: "Relaxed Fit Basic T-Shirt",
        body: "100% Combed Ring-Spun Cotton, lightweight",
        displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689759/model-03642-preview_compressed_wz5n8y.webp",
    },
    {
        type: "TSHIRT",
        template: false,
        section: "featured",
        name: "Relaxed Fit T-Shirt",
        body: "100% Combed Ring-Spun Cotton, Breathable",
        displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689759/model-03661-preview_compressed_p6m3s6.webp",
    },
    {
        type: "HOODIE",
        template: false,
        section: "featured",
        name: "Soft Fleece Hoodie",
        body: "80% Cotton, 20% Polyester, fleece lined",
        displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689760/hoodie-1868-preview_nmxlky.webp",
    },
    {
        type: "HOODIE",
        template: false,
        section: "featured",
        name: "Classic Pullover Hoodie",
        body: "80% Cotton, 20% Polyester, kangaroo pocket",
        displayUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773689759/hoodie-1866-preview_gwckg3.webp",
    },
];
const seedProducts = async () => {
    try {
        const deleted = await prisma_1.prisma.product.deleteMany({});
        console.log(`Cleared ${deleted.count} existing products`);
        // insert
        const created = await prisma_1.prisma.product.createMany({
            data: products,
        });
        console.log(`Seeded ${created.count} products`);
        // List the created products
        const allProducts = await prisma_1.prisma.product.findMany();
        allProducts.forEach((pr) => console.log(`- ${pr.id} ${pr.name}`));
    }
    catch (error) {
        console.log(error, "Error seeding products");
        process.exit(1);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
};
seedProducts();
