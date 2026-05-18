"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const prisma_1 = require("../lib/prisma");
const connectDatabase = async () => {
    try {
        await prisma_1.prisma.$connect();
        console.log("Database connected");
    }
    catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
