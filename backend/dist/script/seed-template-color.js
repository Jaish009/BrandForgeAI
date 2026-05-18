"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("../lib/prisma");
const seedColors = async () => {
    try {
        // First, find the template products by name to get their UUIDs
        const tshirtTemplate = await prisma_1.prisma.product.findFirst({
            where: { type: "TSHIRT", template: true }
        });
        const hoodieTemplate = await prisma_1.prisma.product.findFirst({
            where: { type: "HOODIE", template: true }
        });
        if (!tshirtTemplate || !hoodieTemplate) {
            console.log("Error: Templates not found. Run seed-product first.");
            process.exit(1);
        }
        const TSHIRT_TEMPLATE_ID = tshirtTemplate.id;
        const HOODIE_TEMPLATE_ID = hoodieTemplate.id;
        const colors = [
            // T-Shirt Colors
            {
                templateId: TSHIRT_TEMPLATE_ID,
                name: "White",
                color: "rgb(255, 255, 255)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687938/tshirt-white-mockup_zw59ck.png",
            },
            {
                templateId: TSHIRT_TEMPLATE_ID,
                name: "Very Dark Gray",
                color: "rgb(26, 26, 26)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687937/tshirt-dark-grey-mockup_bdbvfa.png",
            },
            {
                templateId: TSHIRT_TEMPLATE_ID,
                name: "Medium Blue",
                color: "rgb(58, 75, 152)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687938/tshirt-medium-blue-mokup_ou9kry.png",
            },
            {
                templateId: TSHIRT_TEMPLATE_ID,
                name: "Light Pink",
                color: "rgb(244, 144, 182)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687938/tshirt-pink-mockup_buazv1.png",
            },
            {
                templateId: TSHIRT_TEMPLATE_ID,
                name: "Dark Green",
                color: "rgb(19, 69, 34)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687936/tshirt-dark-green-mockup_m8afg9.png",
            },
            // Hoodie Colors
            {
                templateId: HOODIE_TEMPLATE_ID,
                name: "White",
                color: "rgb(255, 255, 255)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687872/hoodie-white-mockup_eya9nz.png",
            },
            {
                templateId: HOODIE_TEMPLATE_ID,
                name: "Very Dark Gray",
                color: "rgb(15, 15, 15)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687871/hoodie-dark-grey-mockup_qoxxfp.png",
            },
            {
                templateId: HOODIE_TEMPLATE_ID,
                name: "Medium Blue",
                color: "rgb(0, 53, 148)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687875/hoodie-medium-blue-mockup_tckmsu.png",
            },
            {
                templateId: HOODIE_TEMPLATE_ID,
                name: "Red",
                color: "rgb(186, 12, 47)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687873/hoodie-red-mockup_xyzke2.png",
            },
            {
                templateId: HOODIE_TEMPLATE_ID,
                name: "Dark Purple",
                color: "rgb(71, 10, 104)",
                mockupUrl: "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687872/hoodie-dark-purple-mockup_uiefd0.png",
            },
        ];
        const deleted = await prisma_1.prisma.productColor.deleteMany({});
        console.log(`Cleared ${deleted.count} existing colors`);
        const created = await prisma_1.prisma.productColor.createMany({
            data: colors,
        });
        console.log(`Added ${created.count} colors`);
    }
    catch (error) {
        console.log("Error occurred seeding colors", error);
        process.exit(1);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
};
seedColors();
