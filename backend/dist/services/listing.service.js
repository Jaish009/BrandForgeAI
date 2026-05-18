"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArtworkService = exports.getMockupUrlService = exports.getListingBySlugService = exports.getUserListingsService = exports.createListingService = void 0;
const ai_1 = require("ai");
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const env_config_1 = require("../config/env.config");
const prisma_1 = require("../lib/prisma");
const app_error_1 = require("../utils/app-error");
const prompt_1 = require("../utils/prompt");
const slugify_1 = __importDefault(require("slugify"));
const toSlug = (str) => str.toLowerCase().replace(/\s+/g, "-");
const createListingService = async (userId, data) => {
    try {
        const template = await prisma_1.prisma.product.findUnique({
            where: { id: data.templateId }
        });
        if (!template)
            throw new app_error_1.NotFoundException("Template not found");
        if (!template.template)
            throw new app_error_1.BadRequestException("Product not template");
        if (!template.basePrice)
            throw new app_error_1.BadRequestException("Product not template");
        if (data.sellingPrice < template.basePrice) {
            throw new app_error_1.BadRequestException(`Selling price must be at least ${template.basePrice}`);
        }
        // Upload the artwork
        const uploaded = await cloudinary_config_1.default.uploader.upload(data.artworkUrl, {
            folder: "Brandforge-ai/artworks",
            resource_type: "image"
        });
        // Generate slug
        const slug = (0, slugify_1.default)(data.title, {
            lower: true,
            strict: true
        }) + "-" + Date.now();
        const listing = await prisma_1.prisma.listing.create({
            data: {
                userId,
                templateId: data.templateId,
                title: data.title,
                description: data.description,
                sellingPrice: data.sellingPrice,
                slug,
                artworkUrl: uploaded.secure_url,
                artworkPlacementTop: data.artworkPlacement.top,
                artworkPlacementLeft: data.artworkPlacement.left,
                artworkPlacementWidth: data.artworkPlacement.width,
                artworkPlacementHeight: data.artworkPlacement.height,
                artworkPlacementRefDisplayWidth: data.artworkPlacement.refDisplayWidth,
                colors: {
                    create: data.colorIds.map((colorId) => ({
                        colorId,
                    }))
                }
            }
        });
        return { listing };
    }
    catch (error) {
        throw new app_error_1.InternalServerException("Internal error");
    }
};
exports.createListingService = createListingService;
const getUserListingsService = async (userId) => {
    try {
        const listings = await prisma_1.prisma.listing.findMany({
            where: { userId },
            include: {
                template: true,
                colors: {
                    include: {
                        color: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        const mappedListings = listings.map((listing) => {
            const colors = listing.colors.map((lc) => ({
                ...lc.color,
                mockupImageUrl: lc.color.name
                    ? `${env_config_1.Env.BASE_URL}/api/listing/mockup/${listing.slug}/${toSlug(lc.color.name)}.jpg`
                    : null
            }));
            return {
                ...listing,
                templateName: listing.template?.name,
                colorIds: colors
            };
        });
        return { listings: mappedListings };
    }
    catch (error) {
        throw new app_error_1.InternalServerException("Internal Error");
    }
};
exports.getUserListingsService = getUserListingsService;
const getListingBySlugService = async (slug) => {
    try {
        const listing = await prisma_1.prisma.listing.findUnique({
            where: { slug },
            include: {
                template: true,
                colors: {
                    include: {
                        color: true
                    }
                }
            }
        });
        if (!listing)
            throw new app_error_1.NotFoundException("Listing not found");
        const colors = listing.colors.map((lc) => ({
            ...lc.color,
            mockupImageUrl: lc.color.name
                ? `${env_config_1.Env.BASE_URL}/api/listing/mockup/${slug}/${toSlug(lc.color.name)}.jpg`
                : null
        }));
        const template = listing.template;
        return {
            listing: {
                id: listing.id,
                slug: listing.slug,
                title: listing.title,
                description: listing.description,
                sellingPrice: listing.sellingPrice,
                templateName: template?.name,
                templateBody: template?.body,
                sizes: template?.sizes,
                artworkUrl: listing.artworkUrl,
                artworkPlacementTop: listing.artworkPlacementTop,
                artworkPlacementLeft: listing.artworkPlacementLeft,
                artworkPlacementWidth: listing.artworkPlacementWidth,
                artworkPlacementHeight: listing.artworkPlacementHeight,
                artworkPlacementRefDisplayWidth: listing.artworkPlacementRefDisplayWidth,
                colorIds: colors
            }
        };
    }
    catch (error) {
        throw new app_error_1.InternalServerException("Internal server error");
    }
};
exports.getListingBySlugService = getListingBySlugService;
const getMockupUrlService = async (slug, colorName) => {
    const listing = await prisma_1.prisma.listing.findUnique({
        where: { slug },
        include: {
            colors: {
                include: {
                    color: true
                }
            },
            template: true
        }
    });
    if (!listing)
        throw new app_error_1.NotFoundException("Listing not found");
    const matchedColor = listing.colors.find((lc) => toSlug(lc.color.name) === colorName.replace(".jpg", ""));
    if (!matchedColor)
        throw new app_error_1.NotFoundException("Color not found");
    const template = listing.template;
    const printableArea = {
        top: template.printableAreaTop ?? 0,
        left: template.printableAreaLeft ?? 0,
        width: template.printableAreaWidth ?? 0,
        height: template.printableAreaHeight ?? 0,
    };
    const getPublicId = (url) => url.split("/upload/")[1]
        .replace(/^v\d+\//, "") // remove version prefix e.g. v1773951553/
        .replace(/\.[^.]+$/, "") // remove extension
        .replace(/\//g, ":"); // slashes → colons
    const artworkPulicId = getPublicId(listing.artworkUrl);
    const mockupPublicId = getPublicId(matchedColor.color.mockupUrl);
    const refDisplayWidth = listing.artworkPlacementRefDisplayWidth;
    const mockup_width = 900;
    const scale = mockup_width / (refDisplayWidth ?? 662);
    const url = cloudinary_config_1.default.url(mockupPublicId, {
        transformation: [
            { overlay: artworkPulicId },
            {
                width: Math.round(printableArea.width * scale),
                height: Math.round(printableArea.height * scale),
                crop: "fit"
            },
            {
                flags: "layer_apply",
                gravity: "north_west",
                x: Math.round(printableArea.left * scale),
                y: Math.round(printableArea.top * scale)
            }
        ],
        format: "jpg",
        quality: 90
    });
    return url;
};
exports.getMockupUrlService = getMockupUrlService;
const generateArtworkService = async (prompt) => {
    try {
        const { text } = await (0, ai_1.generateText)({
            model: "anthropic/claude-opus-4.5",
            system: prompt_1.SYSTEM_PROMPT,
            prompt: prompt
        });
        const result = await (0, ai_1.generateImage)({
            model: "recraft/recraft-v4",
            prompt: text.trim(),
            size: "1024x1024",
        });
        const image = result.images[0];
        if (!image)
            throw new app_error_1.NotFoundException("No image generated");
        const uploadImg = await cloudinary_config_1.default.uploader.upload(`data:image/png;base64,${image.base64}`, {
            folder: "Brandforge-ai/artworks",
            resource_type: "image"
        });
        const formData = new FormData();
        formData.append("image_url", uploadImg.secure_url);
        formData.append("size", "auto");
        const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: { "X-Api-Key": env_config_1.Env.REMOVE_BG_API_KEY },
            body: formData,
        });
        if (!bgRes.ok) {
            throw new app_error_1.InternalServerException("Background removal failed");
        }
        const bgBuffer = Buffer.from(await bgRes.arrayBuffer());
        const finalUpload = await cloudinary_config_1.default.uploader.upload(`data:image/png;base64,${bgBuffer.toString("base64")}`, {
            folder: "Brandforge-ai/artworks",
            resource_type: "image"
        });
        return { artworkUrl: finalUpload.secure_url };
    }
    catch (error) {
        throw new app_error_1.InternalServerException("Failed to generate artwork");
    }
};
exports.generateArtworkService = generateArtworkService;
