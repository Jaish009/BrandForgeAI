"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const constants_1 = require("../constants");
exports.createOrderSchema = zod_1.default.object({
    listingId: zod_1.default.string().min(1),
    colorId: zod_1.default.string().min(1),
    size: zod_1.default.enum(constants_1.SIZE_OPTIONS),
    customerEmail: zod_1.default.string().email(),
    customerName: zod_1.default.string().min(1),
    shippingAddress: zod_1.default.object({
        street: zod_1.default.string().min(1),
        city: zod_1.default.string().min(1),
        state: zod_1.default.string().min(1),
        postalCode: zod_1.default.string().min(1),
        country: zod_1.default.string().min(1),
        phoneNumber: zod_1.default.string().min(1),
    }),
});
