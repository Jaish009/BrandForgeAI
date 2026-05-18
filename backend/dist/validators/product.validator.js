"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productIdSchema = void 0;
const zod_1 = require("zod");
exports.productIdSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Product Id is required")
});
