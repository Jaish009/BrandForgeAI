"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const orderRoutes = (0, express_1.Router)()
    .post("/create", order_controller_1.createOrderController)
    .get("/user", auth_middleware_1.requireAuth, order_controller_1.getUserOrdersController);
exports.default = orderRoutes;
