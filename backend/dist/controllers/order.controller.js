"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrdersController = exports.createOrderController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const order_validator_1 = require("../validators/order.validator");
const http_config_1 = require("../config/http.config");
const order_service_1 = require("../services/order.service");
exports.createOrderController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const body = order_validator_1.createOrderSchema.parse(req.body);
    const { url } = await (0, order_service_1.createOrderService)(body);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Order created successfully",
        url
    });
});
exports.getUserOrdersController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const orders = await (0, order_service_1.getUserOrdersService)(userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Orders fetched successfully",
        orders
    });
});
