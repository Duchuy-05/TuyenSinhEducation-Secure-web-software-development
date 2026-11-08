"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOrigin = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const checkOrigin = (req, res, next) => {
    const allowedOrigin = process.env.FRONTEND_URL;
    if (!allowedOrigin) {
        // Chưa cấu hình FRONTEND_URL thì không thể kiểm tra được -> chặn an toàn
        return res.status(500).json((0, responseHandler_1.errorHandler)(500, 'Server chưa cấu hình FRONTEND_URL.'));
    }
    const origin = req.headers.origin || req.headers.referer;
    if (!origin || !origin.startsWith(allowedOrigin)) {
        return res.status(403).json((0, responseHandler_1.errorHandler)(403, 'Yêu cầu không hợp lệ (sai nguồn gốc request).'));
    }
    next();
};
exports.checkOrigin = checkOrigin;
