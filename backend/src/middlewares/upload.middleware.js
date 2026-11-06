"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCourseImage = exports.uploadAvatar = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Tạo một hàm để tạo uploader với folder để phân loại ảnh theo loại (avatars, courses)
const createUploader = (folder) => {
    const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.default,
        params: {
            folder: `tri-anh-education/${folder}`, // namespace rõ ràng theo tên dự án + loại ảnh
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ width: 800, quality: 'auto' }],
        },
    });
    return (0, multer_1.default)({
        storage, // cho phép lưu ảnh avatar_url của người dùng
        limits: { fileSize: 2 * 1024 * 1024 }, // giới hạn 2MB
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, webp)'));
            }
            cb(null, true);
        },
    });
};
exports.uploadAvatar = createUploader('avatars');
exports.uploadCourseImage = createUploader('courses');
