"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const auth_1 = require("../lib/auth");
const node_1 = require("better-auth/node");
const app_error_1 = require("../utils/app-error");
const requireAuth = async (req, res, next) => {
    const auth = (0, auth_1.getAuth)();
    const session = await auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers)
    });
    if (!session) {
        throw new app_error_1.UnauthorizedException("Unauthorized, Please sign in");
    }
    req.user = session.user;
    req.session = session;
    next();
};
exports.requireAuth = requireAuth;
