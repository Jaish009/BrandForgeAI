"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const node_1 = require("better-auth/node");
const http_config_1 = require("./config/http.config");
const env_config_1 = require("./config/env.config");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const asyncHandler_middleware_1 = require("./middlewares/asyncHandler.middleware");
const database_config_1 = require("./config/database.config");
const auth_1 = require("./lib/auth");
const routes_1 = __importDefault(require("./routes"));
const webhook_route_1 = __importDefault(require("./routes/webhook.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [env_config_1.Env.FRONTEND_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.all("/api/auth/*splat", (req, res) => {
    const auth = (0, auth_1.getAuth)();
    return (0, node_1.toNodeHandler)(auth)(req, res);
});
app.use("/api/webhook", webhook_route_1.default);
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Server is healthy",
        status: "Ok"
    });
}));
app.use("/api", routes_1.default);
if (env_config_1.Env.NODE_ENV === "production") {
    const clientPath = path_1.default.resolve(__dirname, "../../client/dist");
    //Serve static files
    app.use(express_1.default.static(clientPath));
    // Serve index.html for all non-API routes (SPA fallback)
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path_1.default.join(clientPath, "index.html"));
    });
}
app.use(errorHandler_middleware_1.errorHandler);
app.listen(env_config_1.Env.PORT, async () => {
    await (0, database_config_1.connectDatabase)();
    console.log(`Server running on port ${env_config_1.Env.PORT} in ${env_config_1.Env.NODE_ENV} mode`);
});
