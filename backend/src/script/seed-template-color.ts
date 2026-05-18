import "dotenv/config";
import { prisma } from "../lib/prisma";

const seedColors = async () => {
  try {
    // First, find the template products by name to get their UUIDs
    const tshirtTemplate = await prisma.product.findFirst({
      where: { type: "TSHIRT", template: true }
    });
    const hoodieTemplate = await prisma.product.findFirst({
      where: { type: "HOODIE", template: true }
    });
    const mugTemplate = await prisma.product.findFirst({
      where: { type: "MUG", template: true }
    });
    const phonecaseTemplate = await prisma.product.findFirst({
      where: { type: "PHONECASE", template: true }
    });
    const capTemplate = await prisma.product.findFirst({
      where: { type: "CAP", template: true }
    });

    if (!tshirtTemplate || !hoodieTemplate) {
      console.log("Error: T-Shirt/Hoodie templates not found. Run seed-product first.");
      process.exit(1);
    }

    const TSHIRT_TEMPLATE_ID = tshirtTemplate.id;
    const HOODIE_TEMPLATE_ID = hoodieTemplate.id;

    const colors: Array<{
      templateId: string;
      name: string;
      color: string;
      mockupUrl: string;
    }> = [
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

    // Mug Colors
    if (mugTemplate) {
      colors.push(
        {
          templateId: mugTemplate.id,
          name: "White",
          color: "rgb(255, 255, 255)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000332/Brandforge-ai/mockups/mug/mug-white-mockup-transparent.png",
        },
        {
          templateId: mugTemplate.id,
          name: "Black",
          color: "rgb(20, 20, 20)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000334/Brandforge-ai/mockups/mug/mug-black-mockup-transparent.png",
        },
        {
          templateId: mugTemplate.id,
          name: "Navy Blue",
          color: "rgb(0, 40, 104)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000338/Brandforge-ai/mockups/mug/mug-navy-mockup-transparent.png",
        },
      );
    }

    // Phone Case Colors
    if (phonecaseTemplate) {
      colors.push(
        {
          templateId: phonecaseTemplate.id,
          name: "White",
          color: "rgb(255, 255, 255)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000340/Brandforge-ai/mockups/phonecase/phonecase-white-mockup-transparent.png",
        },
        {
          templateId: phonecaseTemplate.id,
          name: "Black",
          color: "rgb(20, 20, 20)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000342/Brandforge-ai/mockups/phonecase/phonecase-black-mockup-transparent.png",
        },
        {
          templateId: phonecaseTemplate.id,
          name: "Clear",
          color: "rgb(230, 230, 230)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000345/Brandforge-ai/mockups/phonecase/phonecase-clear-mockup-transparent.png",
        },
      );
    }

    // Cap Colors
    if (capTemplate) {
      colors.push(
        {
          templateId: capTemplate.id,
          name: "White",
          color: "rgb(255, 255, 255)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000348/Brandforge-ai/mockups/cap/cap-white-mockup-transparent.png",
        },
        {
          templateId: capTemplate.id,
          name: "Black",
          color: "rgb(20, 20, 20)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000351/Brandforge-ai/mockups/cap/cap-black-mockup-transparent.png",
        },
        {
          templateId: capTemplate.id,
          name: "Red",
          color: "rgb(186, 12, 47)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000354/Brandforge-ai/mockups/cap/cap-red-mockup-transparent.png",
        },
        {
          templateId: capTemplate.id,
          name: "Navy Blue",
          color: "rgb(0, 40, 104)",
          mockupUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1779000357/Brandforge-ai/mockups/cap/cap-navy-mockup-transparent.png",
        },
      );
    }

    const deleted = await prisma.productColor.deleteMany({});
    console.log(`Cleared ${deleted.count} existing colors`);

    const created = await prisma.productColor.createMany({
      data: colors,
    });
    console.log(`Added ${created.count} colors`);
  } catch (error) {
    console.log("Error occurred seeding colors", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect();
  }
}

seedColors()

