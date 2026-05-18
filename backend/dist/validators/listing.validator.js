"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArtworkSchema = exports.GetMockupUrlSchema = exports.slugSchema = exports.createListingSchema = void 0;
const zod_1 = require("zod");
exports.createListingSchema = zod_1.z.object({
    templateId: zod_1.z.string().trim().min(1),
    title: zod_1.z.string().trim().min(1).max(100),
    description: zod_1.z.string().trim().default(""),
    sellingPrice: zod_1.z.number().positive(),
    colorIds: zod_1.z.array(zod_1.z.string().trim().min(1)).min(1),
    artworkUrl: zod_1.z.string().trim().min(1),
    artworkPlacement: zod_1.z.object({
        top: zod_1.z.number(),
        left: zod_1.z.number(),
        width: zod_1.z.number(),
        height: zod_1.z.number(),
        refDisplayWidth: zod_1.z.number(),
    }),
});
exports.slugSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, "Slug is required")
});
exports.GetMockupUrlSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, "Slug is required"),
    colorName: zod_1.z.string().min(1, "Color Name is required")
});
exports.generateArtworkSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1, "Prompt is required")
});
