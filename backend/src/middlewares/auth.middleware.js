"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseHandler_1 = require("../utils/responseHandler");
const User_1 = require("../models/entities/User");
const verifyToken = (req, res, next) => {
    const token = req.cookies?.access_token;
    if (!token) {
        return res.status(401).json((0, responseHandler_1.errorHandler)(401, 'Không tìm thấy Token. Vui lòng đăng nhập!'));
    }
    try {
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        if (!secretKey) {
            return res.status(500).json((0, responseHandler_1.errorHandler)(500, 'Server chưa cấu hình ACCESS_TOKEN_SECRET.'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json((0, responseHandler_1.errorHandler)(401, 'TOKEN_EXPIRED'));
        }
        return res.status(403).json((0, responseHandler_1.errorHandler)(403, 'Token không hợp lệ hoặc đã hết hạn!'));
    }
};
exports.verifyToken = verifyToken;
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === User_1.UserRole.ADMIN) {
        next();
    }
    else {
        return res.status(403).json((0, responseHandler_1.errorHandler)(403, 'Không có quyền truy cập. Yêu cầu quyền Admin.'));
    }
};
exports.isAdmin = isAdmin;
const requireRoles = (...roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json((0, responseHandler_1.errorHandler)(403, 'Không có quyền truy cập.'));
    };
};
exports.requireRoles = requireRoles;
