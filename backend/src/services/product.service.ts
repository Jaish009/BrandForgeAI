import { prisma } from "../lib/prisma";
import { InternalServerException, NotFoundException } from "../utils/app-error";

export const getProductsService = async () => {
  const products = await prisma.product.findMany();

  const formattedProducts = products.map((product) => ({
    ...product,
    printableArea: {
      top: product.printableAreaTop,
      left: product.printableAreaLeft,
      width: product.printableAreaWidth,
      height: product.printableAreaHeight
    }
  }));

  return {
    catalog: formattedProducts.filter((product) => product.section === "catalog"),
    featured: formattedProducts.filter((product) => product.section === "featured")
  }
}

export const getProductByIdService = async (id: string) => {
  try {
    const selectedProduct = await prisma.product.findUnique({
      where: { id }
    });
    if (!selectedProduct) throw new NotFoundException("Product not found");

    const template = selectedProduct.template
      ? selectedProduct
      : await prisma.product.findFirst({
        where: {
          type: selectedProduct.type,
          template: true
        }
      });

    if (!template) throw new NotFoundException("Editor template not found");

    const colors = await prisma.productColor.findMany({
      where: { templateId: template.id }
    });

    const formattedTemplate = {
      ...template,
      printableArea: {
        top: template.printableAreaTop,
        left: template.printableAreaLeft,
        width: template.printableAreaWidth,
        height: template.printableAreaHeight
      }
    };

    return { template: formattedTemplate, colors }

  } catch {
    throw new InternalServerException("Internal server error")
  }
}
