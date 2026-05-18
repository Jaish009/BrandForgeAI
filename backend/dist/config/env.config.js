"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = void 0;
const get_env_1 = require("../utils/get-env");
exports.Env = {
    NODE_ENV: (0, get_env_1.getEnv)("NODE_ENV"),
    PORT: (0, get_env_1.getEnv)("PORT", "8000"),
    BASE_URL: (0, get_env_1.getEnv)("BASE_URL"),
    DATABASE_URL: (0, get_env_1.getEnv)("DATABASE_URL"),
    BETTER_AUTH_SECRET: (0, get_env_1.getEnv)("BETTER_AUTH_SECRET"),
    BETTER_AUTH_URL: (0, get_env_1.getEnv)("BETTER_AUTH_URL"),
    GOOGLE_CLIENT_ID: (0, get_env_1.getEnv)("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: (0, get_env_1.getEnv)("GOOGLE_CLIENT_SECRET"),
    CLOUDINARY_CLOUD_NAME: (0, get_env_1.getEnv)("CLOUDINARY_CLOUD_NAME"),
    CLOUDINARY_API_KEY: (0, get_env_1.getEnv)("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: (0, get_env_1.getEnv)("CLOUDINARY_API_SECRET"),
    REMOVE_BG_API_KEY: (0, get_env_1.getEnv)("REMOVE_BG_API_KEY"),
    STRIPE_SECRET_KEY: (0, get_env_1.getEnv)("STRIPE_SECRET_KEY"),
    STRIPE_WEBHOOK_SECRET: (0, get_env_1.getEnv)("STRIPE_WEBHOOK_SECRET"),
    FRONTEND_ORIGIN: (0, get_env_1.getEnv)("FRONTEND_ORIGIN", "http://localhost:5173"),
    REPLICATE_API_TOKEN: (0, get_env_1.getEnv)("REPLICATE_API_TOKEN"),
};
