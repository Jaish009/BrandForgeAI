"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const listing_controller_1 = require("../controllers/listing.controller");
const listingRoutes = (0, express_1.Router)()
    .get("/all", auth_middleware_1.requireAuth, listing_controller_1.getUserListingsController)
    .get("/mockup/:slug/:colorName", listing_controller_1.getMockupUrlController)
    .get("/:slug", listing_controller_1.getListingBySlugController)
    .post("/generate-artwork", auth_middleware_1.requireAuth, listing_controller_1.generateArtworkController)
    .post("/create", auth_middleware_1.requireAuth, listing_controller_1.createListingController);
exports.default = listingRoutes;
