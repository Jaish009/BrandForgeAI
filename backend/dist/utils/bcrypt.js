"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareValue = exports.hashValue = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashValue = async (password) => {
    return await bcryptjs_1.default.hash(password, 10);
};
exports.hashValue = hashValue;
const compareValue = async (data) => {
    return await bcryptjs_1.default.compare(data.password, data.hash);
};
exports.compareValue = compareValue;
