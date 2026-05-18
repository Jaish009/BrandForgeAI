"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const product_controller_1 = require("../controllers/product.controller");
const productRoutes = (0, express_1.Router)()
    .use(auth_middleware_1.requireAuth)
    .get("/all", product_controller_1.getProductsController)
    .get("/:id", product_controller_1.getProductByIdController);
exports.default = productRoutes;
