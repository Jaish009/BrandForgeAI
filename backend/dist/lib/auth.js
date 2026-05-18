"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = void 0;
const better_auth_1 = require("better-auth");
const plugins_1 = require("better-auth/plugins");
const plugins_2 = require("better-auth/plugins");
const prisma_1 = require("better-auth/adapters/prisma");
const prisma_2 = require("./prisma");
const env_config_1 = require("../config/env.config");
const bcrypt_1 = require("../utils/bcrypt");
const getAuth = () => {
    return (0, better_auth_1.betterAuth)({
        baseURL: env_config_1.Env.BETTER_AUTH_URL,
        secret: env_config_1.Env.BETTER_AUTH_SECRET,
        trustedOrigins: [env_config_1.Env.FRONTEND_ORIGIN],
        database: (0, prisma_1.prismaAdapter)(prisma_2.prisma, {
            provider: "postgresql",
        }),
        emailAndPassword: {
            enabled: true,
            minPasswordLength: 6,
            password: {
                hash: bcrypt_1.hashValue,
                verify: bcrypt_1.compareValue
            },
        },
        socialProviders: {
            google: {
                clientId: env_config_1.Env.GOOGLE_CLIENT_ID,
                clientSecret: env_config_1.Env.GOOGLE_CLIENT_SECRET
            }
        },
        advanced: {
            cookiePrefix: "Brandforge-ai",
            cookies: {
                session_token: {
                    name: "brandforge_session_token",
                },
            }
        },
        plugins: [
            (0, plugins_1.openAPI)(),
            (0, plugins_2.jwt)()
        ]
    });
};
exports.getAuth = getAuth;
