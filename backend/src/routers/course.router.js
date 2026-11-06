"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CourseController_1 = require("../controllers/CourseController");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const handleUploadError_middleware_1 = require("../middlewares/handleUploadError.middleware");
const courseRouter = (0, express_1.Router)();
// =======================================================================
// NHÓM 1: CÁC API ĐẶC THÙ ĐẶT LÊN TRÊN
// =======================================================================
// 1. API lấy danh sách khóa học của riêng giảng viên
courseRouter.get('/courses/lecturer', auth_middleware_1.verifyToken, CourseController_1.CourseController.getLecturerCourses);
// 2. Nhóm API Quản lý Khóa học đa phương tiện
courseRouter.post('/courses/draft', auth_middleware_1.verifyToken, CourseController_1.CourseController.createDraft);
courseRouter.get('/courses/draft/:courseGroupId', auth_middleware_1.verifyToken, CourseController_1.CourseController.getDraft);
courseRouter.put('/courses/draft/:courseGroupId', auth_middleware_1.verifyToken, CourseController_1.CourseController.updateDraft);
courseRouter.post('/courses/:courseGroupId/publish', auth_middleware_1.verifyToken, CourseController_1.CourseController.publishCourse);
// API Hủy xuất bản (Unpublish)
courseRouter.patch('/courses/draft/:courseGroupId/unpublish', auth_middleware_1.verifyToken, CourseController_1.CourseController.unpublishCourse);
// =======================================================================
// NHÓM 2: CÁC API CÓ THAM SỐ ĐỘNG (:id) - BẮT BUỘC ĐẶT XUỐNG DƯỚI
// =======================================================================
courseRouter.get('/courses', CourseController_1.CourseController.getAllCourses);
courseRouter.get('/courses/pagination', CourseController_1.CourseController.getAllCoursesPagination);
courseRouter.get('/courses/:id', CourseController_1.CourseController.getCourseById);
courseRouter.post('/courses', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, upload_middleware_1.uploadCourseImage.single('image'), handleUploadError_middleware_1.handleUploadError, CourseController_1.CourseController.createCourse);
courseRouter.put('/courses/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, upload_middleware_1.uploadCourseImage.single('image'), CourseController_1.CourseController.updateCourse);
courseRouter.delete('/courses/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, CourseController_1.CourseController.deleteCourse);
exports.default = courseRouter;
