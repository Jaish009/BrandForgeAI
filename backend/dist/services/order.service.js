"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrdersService = exports.createOrderService = void 0;
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
const prisma_1 = require("../lib/prisma");
const app_error_1 = require("../utils/app-error");
const env_config_1 = require("../config/env.config");
const createOrderService = async (data) => {
    const listing = await prisma_1.prisma.listing.findUnique({
        where: { id: data.listingId },
        include: {
            colors: {
                include: {
                    color: true
                }
            }
        }
    });
    if (!listing)
        throw new app_error_1.NotFoundException("Listing not found");
    const isColorValid = listing.colors.some((lc) => lc.colorId === data.colorId);
    if (!isColorValid)
        throw new app_error_1.BadRequestException("Color is invalid");
    const order = await prisma_1.prisma.order.create({
        data: {
            listingId: data.listingId,
            colorId: data.colorId,
            size: data.size,
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            amount: listing.sellingPrice,
            isPaid: false,
            status: "pending",
            shippingStreet: data.shippingAddress.street,
            shippingCity: data.shippingAddress.city,
            shippingPostalCode: data.shippingAddress.postalCode,
            shippingCountry: data.shippingAddress.country,
            shippingState: data.shippingAddress.state,
            shippingPhoneNumber: data.shippingAddress.phoneNumber,
        }
    });
    const session = await stripe_config_1.default.checkout.sessions.create({
        mode: "payment",
        customer_email: data.customerEmail,
        line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: { name: listing.title },
                    unit_amount: Math.round(listing.sellingPrice * 100),
                },
                quantity: 1,
            }],
        metadata: {
            orderId: order.id
        },
        success_url: `${env_config_1.Env.FRONTEND_ORIGIN}/thank-you?orderId=${order.id}`,
        cancel_url: `${env_config_1.Env.FRONTEND_ORIGIN}/listing/${listing.slug}?error=true`,
    });
    if (!session.url) {
        await prisma_1.prisma.order.delete({ where: { id: order.id } });
        throw new app_error_1.InternalServerException("Failed to create checkout session");
    }
    return { url: session.url };
};
exports.createOrderService = createOrderService;
const getUserOrdersService = async (userId) => {
    const listings = await prisma_1.prisma.listing.findMany({
        where: { userId },
        select: { id: true }
    });
    const listingIds = listings.map((listing) => listing.id);
    const orders = await prisma_1.prisma.order.findMany({
        where: {
            listingId: {
                in: listingIds
            }
        },
        include: {
            listing: {
                select: {
                    title: true,
                    slug: true,
                    artworkUrl: true
                }
            },
            color: {
                select: {
                    name: true,
                    color: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    return orders;
};
exports.getUserOrdersService = getUserOrdersService;
