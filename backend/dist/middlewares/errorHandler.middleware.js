"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const http_config_1 = require("../config/http.config");
const app_error_1 = require("../utils/app-error");
const formatZodError = (res, error) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));
    return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: errors,
        errorCode: app_error_1.ErrorCodes.ERR_VALIDATION_ERROR,
    });
};
const errorHandler = (error, req, res, next) => {
    console.log(`Error occured: ${req.path}`, error);
    if (error instanceof SyntaxError) {
        return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON format. Please check your request body.",
        });
    }
    if (error instanceof zod_1.ZodError) {
        formatZodError(res, error);
    }
    if (error instanceof app_error_1.AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        });
    }
    return res.status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Something went wrong",
    });
};
exports.errorHandler = errorHandler;
