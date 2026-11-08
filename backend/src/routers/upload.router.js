"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware"); // middleware xác thực đã có sẵn trong dự án
const handleUploadError_middleware_1 = require("../middlewares/handleUploadError.middleware");
const UploadController_1 = require("../controllers/UploadController");
const router = (0, express_1.Router)();
router.post('/upload/avatar', auth_middleware_1.verifyToken, upload_middleware_1.uploadAvatar.single('image'), handleUploadError_middleware_1.handleUploadError, UploadController_1.UploadController.uploadAvatar);
router.post('/upload/course-image', auth_middleware_1.verifyToken, upload_middleware_1.uploadCourseImage.single('image'), handleUploadError_middleware_1.handleUploadError, UploadController_1.UploadController.uploadCourseImage);
exports.default = router;
