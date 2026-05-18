"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const env_config_1 = require("./env.config");
const stripeClient = new stripe_1.default(env_config_1.Env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover"
});
exports.default = stripeClient;
