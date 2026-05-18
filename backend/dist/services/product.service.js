"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductByIdService = exports.getProductsService = void 0;
const prisma_1 = require("../lib/prisma");
const app_error_1 = require("../utils/app-error");
const getProductsService = async () => {
    const products = await prisma_1.prisma.product.findMany();
    return {
        catalog: products.filter((product) => product.section === "catalog"),
        featured: products.filter((product) => product.section === "featured")
    };
};
exports.getProductsService = getProductsService;
const getProductByIdService = async (id) => {
    try {
        const selectedProduct = await prisma_1.prisma.product.findUnique({
            where: { id }
        });
        if (!selectedProduct)
            throw new app_error_1.NotFoundException("Product not found");
        const template = selectedProduct.template
            ? selectedProduct
            : await prisma_1.prisma.product.findFirst({
                where: {
                    type: selectedProduct.type,
                    template: true
                }
            });
        if (!template)
            throw new app_error_1.NotFoundException("Editor template not found");
        const colors = await prisma_1.prisma.productColor.findMany({
            where: { templateId: template.id }
        });
        return { template, colors };
    }
    catch {
        throw new app_error_1.InternalServerException("Internal server error");
    }
};
exports.getProductByIdService = getProductByIdService;
