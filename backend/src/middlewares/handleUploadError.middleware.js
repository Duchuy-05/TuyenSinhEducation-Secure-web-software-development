"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = handleUploadError;
const multer_1 = __importDefault(require("multer"));
const responseHandler_1 = require("../utils/responseHandler");
function handleUploadError(err, request, response, next) {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'File vượt quá dung lượng cho phép (tối đa 2MB)'));
        }
        return response.status(400).json((0, responseHandler_1.errorHandler)(400, `Lỗi upload file: ${err.message}`));
    }
    if (err) {
        // Lỗi từ fileFilter (ví dụ: không phải file ảnh)
        return response.status(400).json((0, responseHandler_1.errorHandler)(400, err.message || 'Lỗi khi tải file lên'));
    }
    next();
}
