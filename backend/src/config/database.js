"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDatabaseUrl = loadDatabaseUrl;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function loadDatabaseUrl() {
    const envPath = path_1.default.resolve(__dirname, "../../.env");
    if ((0, fs_1.existsSync)(envPath)) {
        dotenv_1.default.config({ path: envPath, override: false });
    }
    const url = process.env.MYSQL_URL;
    if (!url || typeof url !== "string" || url.trim() === "") {
        throw new Error("MYSQL_URL is required but not configured");
    }
    return url.trim();
}
