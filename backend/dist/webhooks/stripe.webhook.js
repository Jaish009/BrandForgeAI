"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookHandler = void 0;
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
const env_config_1 = require("../config/env.config");
const http_config_1 = require("../config/http.config");
const prisma_1 = require("../lib/prisma");
const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe_config_1.default.webhooks.constructEvent(req.body, sig, env_config_1.Env.STRIPE_WEBHOOK_SECRET);
    }
    catch (error) {
        return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).send(`Webhook Error ${error?.message}`);
    }
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                await handleOrderCheckoutCompleted(session);
                break;
            }
            case "checkout.session.expired": {
                const session = event.data.object;
                await handleOrderCheckoutFailed(session);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }
        return res.status(http_config_1.HTTPSTATUS.OK).json({ received: true });
    }
    catch (error) {
        return res.status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR).send(`Webhook Error ${error?.message}`);
    }
};
exports.stripeWebhookHandler = stripeWebhookHandler;
async function handleOrderCheckoutCompleted(session) {
    const orderId = session.metadata?.orderId;
    if (!orderId) {
        console.log("No OrderId in session metadata");
        return;
    }
    try {
        await prisma_1.prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                status: "awaiting_shipment"
            }
        });
        console.log(`Order marked as paid`);
    }
    catch (error) {
        console.log("Error updating order");
        return;
    }
}
async function handleOrderCheckoutFailed(session) {
    const orderId = session.metadata?.orderId;
    if (!orderId) {
        console.log("No OrderId in session metadata");
        return;
    }
    try {
        await prisma_1.prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: false,
                status: "failed",
            }
        });
        console.log(`Order marked as failed`);
    }
    catch (error) {
        console.log("Error updating order");
        return;
    }
}
