"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductByIdController = exports.getProductsController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
const product_service_1 = require("../services/product.service");
const product_validator_1 = require("../validators/product.validator");
exports.getProductsController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const products = await (0, product_service_1.getProductsService)();
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Products fetched successfully",
        products
    });
});
exports.getProductByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const { id } = product_validator_1.productIdSchema.parse(req.params);
    const data = await (0, product_service_1.getProductByIdService)(id);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Product fetched successfully",
        ...data
    });
});
