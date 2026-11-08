"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const CourseService_1 = require("../services/CourseService");
const CourseServiceGV_1 = require("../services/CourseServiceGV");
const responseHandler_1 = require("../utils/responseHandler");
const inputValidation_1 = require("../security/inputValidation");
const COURSE_WRITE_FIELDS = ['teacherId', 'category', 'title', 'shortDesc', 'target', 'imageUrl', 'duration', 'sessionCount', 'frequency', 'lessonDuration', 'classSize', 'format', 'price', 'discountPrice', 'status', 'courseData', 'blocks'];
class CourseController {
    // Helper dùng chung: Chuyển đổi userId từ Token sang teacherId chuẩn & kiểm tra quyền Giảng viên
    static async getTeacherProfile(request) {
        const currentUser = request.user;
        if (!currentUser || !currentUser.id) {
            throw { status: 401, message: 'Vui lòng đăng nhập để thực hiện chức năng này!' };
        }
        // Đảm bảo chỉ Teacher hoặc Admin mới có thể thao tác
        if (currentUser.role !== 'teacher' && currentUser.role !== 'admin') {
            throw { status: 403, message: 'Bạn không có quyền thực hiện thao tác này!' };
        }
        return await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
    }
    // =========================================================
    // DÀNH CHO PUBLIC / HỌC VIÊN
    // =========================================================
    static async getAllCoursesPagination(request, response) {
        const page = Math.max(1, Number(request.query.page) || 1);
        const limit = Math.max(1, Number(request.query.limit) || 10);
        try {
            const courses = await CourseService_1.CourseService.getAllCoursesPagination(page, limit);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách khóa học thành công', courses));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi lấy danh sách khóa học')));
        }
    }
    static async getAllCourses(request, response) {
        try {
            const courses = await CourseService_1.CourseService.getAllCourses();
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách khóa học thành công', courses));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi lấy danh sách khóa học')));
        }
    }
    static async getCourseById(request, response) {
        const courseId = Number(request.params.id);
        if (isNaN(courseId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID khóa học không hợp lệ'));
        }
        try {
            const course = await CourseService_1.CourseService.getCourseById(courseId);
            if (!course) {
                return response.status(404).json((0, responseHandler_1.errorHandler)(404, 'Khóa học không tồn tại'));
            }
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Lấy thông tin khóa học thành công', course));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi lấy thông tin khóa học')));
        }
    }
    static async createCourse(request, response) {
        var _a;
        const courseData = Object.assign(Object.assign({}, (0, inputValidation_1.pickAllowedFields)(request.body, COURSE_WRITE_FIELDS)), { image: (_a = request.file) === null || _a === void 0 ? void 0 : _a.path });
        try {
            const newCourse = await CourseService_1.CourseService.createCourse(courseData);
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Tạo khóa học thành công', newCourse));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi tạo khóa học')));
        }
    }
    static async updateCourse(request, response) {
        var _a;
        const courseId = Number(request.params.id);
        if (isNaN(courseId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID khóa học không hợp lệ'));
        }
        const courseData = Object.assign(Object.assign({}, (0, inputValidation_1.pickAllowedFields)(request.body, COURSE_WRITE_FIELDS)), { image: (_a = request.file) === null || _a === void 0 ? void 0 : _a.path });
        try {
            const updatedCourse = await CourseService_1.CourseService.updateCourse(courseId, courseData);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Cập nhật khóa học thành công', updatedCourse));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật khóa học')));
        }
    }
    static async deleteCourse(request, response) {
        const courseId = Number(request.params.id);
        if (isNaN(courseId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID khóa học không hợp lệ'));
        }
        try {
            await CourseService_1.CourseService.deleteCourse(courseId);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Xóa khóa học thành công'));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi xóa khóa học')));
        }
    }
    // =========================================================
    // QUẢN LÝ KHÓA HỌC DÀNH CHO GIẢNG VIÊN
    // =========================================================
    // 1. Tạo bản nháp mới
    static async createDraft(request, response) {
        try {
            const { title } = request.body;
            if (!title || !title.trim()) {
                return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Tên khóa học không được để trống!'));
            }
            const teacherProfile = await CourseController.getTeacherProfile(request);
            const newDraft = await CourseServiceGV_1.CourseServiceGV.createDraft(title.trim(), teacherProfile.id);
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Khởi tạo bản nháp thành công!', newDraft));
        }
        catch (error) {
            console.error("Lỗi Controller createDraft: ", error);
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi hệ thống khi tạo bản nháp')));
        }
    }
    // 2. Lấy chi tiết bản nháp
    static async getDraft(request, response) {
        try {
            const courseGroupId = request.params.courseGroupId;
            const teacherProfile = await CourseController.getTeacherProfile(request);
            const draft = await CourseServiceGV_1.CourseServiceGV.getDraft(courseGroupId, teacherProfile.id);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Lấy dữ liệu bản nháp thành công', draft));
        }
        catch (error) {
            const status = error.status || 404;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Không tìm thấy bản nháp hoặc bạn không có quyền')));
        }
    }
    // 3. Lưu/Cập nhật bản nháp (Bao gồm hỗ trợ file ảnh thumbnail nếu có)
    static async updateDraft(request, response) {
        var _a;
        try {
            const courseGroupId = request.params.courseGroupId;
            const teacherProfile = await CourseController.getTeacherProfile(request);
            const courseDataInput = Object.assign(Object.assign({}, request.body), (((_a = request.file) === null || _a === void 0 ? void 0 : _a.path) && { imageUrl: request.file.path }));
            const updatedDraft = await CourseServiceGV_1.CourseServiceGV.updateDraft(courseGroupId, teacherProfile.id, courseDataInput);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Đã lưu tiến độ bản nháp thành công', updatedDraft));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi hệ thống khi cập nhật bản nháp')));
        }
    }
    // 4. Xuất bản khóa học từ bản nháp
    static async publishCourse(request, response) {
        try {
            const courseGroupId = request.params.courseGroupId;
            const teacherProfile = await CourseController.getTeacherProfile(request);
            const published = await CourseServiceGV_1.CourseServiceGV.publishCourse(courseGroupId, teacherProfile.id);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Xuất bản khóa học thành công!', published));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi hệ thống khi xuất bản khóa học')));
        }
    }
    // 5. Gỡ khóa học (Chuyển về DRAFT)
    static async unpublishCourse(request, response) {
        try {
            const courseGroupId = request.params.courseGroupId;
            const teacherProfile = await CourseController.getTeacherProfile(request);
            const result = await CourseServiceGV_1.CourseServiceGV.unpublishCourse(courseGroupId, teacherProfile.id);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Đã hủy xuất bản khóa học!', result));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi hủy xuất bản')));
        }
    }
    // 6. Lấy danh sách khóa học của Giảng viên 
    static async getLecturerCourses(request, response) {
        try {
            const teacherProfile = await CourseController.getTeacherProfile(request);
            const courses = await CourseServiceGV_1.CourseServiceGV.getLecturerCourses(teacherProfile.id);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách khóa học của giảng viên thành công', courses));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi hệ thống khi lấy danh sách khóa học')));
        }
    }
}
exports.CourseController = CourseController;
