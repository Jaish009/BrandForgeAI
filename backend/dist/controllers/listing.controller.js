"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArtworkController = exports.getMockupUrlController = exports.getListingBySlugController = exports.getUserListingsController = exports.createListingController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const listing_validator_1 = require("../validators/listing.validator");
const http_config_1 = require("../config/http.config");
const listing_service_1 = require("../services/listing.service");
exports.createListingController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const body = listing_validator_1.createListingSchema.parse(req.body);
    const data = await (0, listing_service_1.createListingService)(userId, body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Listing created successfully",
        ...data
    });
});
exports.getUserListingsController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const data = await (0, listing_service_1.getUserListingsService)(userId);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Listing fetched successfully",
        ...data
    });
});
exports.getListingBySlugController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const { slug } = listing_validator_1.slugSchema.parse(req.params);
    const data = await (0, listing_service_1.getListingBySlugService)(slug);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Listing fetched successfully",
        ...data
    });
});
exports.getMockupUrlController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const { slug, colorName } = listing_validator_1.GetMockupUrlSchema.parse(req.params);
    const url = await (0, listing_service_1.getMockupUrlService)(slug, colorName);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.redirect(301, url);
});
exports.generateArtworkController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const { prompt } = listing_validator_1.generateArtworkSchema.parse(req.body);
    const { artworkUrl } = await (0, listing_service_1.generateArtworkService)(prompt);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Artwork generated successfully",
        artworkUrl
    });
});
