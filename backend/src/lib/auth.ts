import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins"
import { jwt } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Env } from "../config/env.config";
import { compareValue, hashValue } from "../utils/bcrypt";

export const getAuth = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return betterAuth({
    baseURL: Env.BETTER_AUTH_URL,
    secret: Env.BETTER_AUTH_SECRET,
    trustedOrigins: [Env.FRONTEND_ORIGIN],
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      password: {
        hash: hashValue,
        verify: compareValue
      },
    },
    socialProviders: {
      google: {
        clientId: Env.GOOGLE_CLIENT_ID,
        clientSecret: Env.GOOGLE_CLIENT_SECRET
      }
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: false,
      },
      defaultCookieAttributes: {
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        partitioned: isProduction,
      },
      useSecureCookies: isProduction,
      cookiePrefix: "Brandforge-ai",
      cookies: {
        session_token: {
          name: "brandforge_session_token",
        },
      }
    },
    plugins: [
      openAPI()
    ]
  });
}
