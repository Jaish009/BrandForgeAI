"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_route_1 = __importDefault(require("./product.route"));
const listing_route_1 = __importDefault(require("./listing.route"));
const order_route_1 = __importDefault(require("./order.route"));
const router = (0, express_1.Router)();
router.use("/product", product_route_1.default);
router.use("/listing", listing_route_1.default);
router.use("/order", order_route_1.default);
exports.default = router;
