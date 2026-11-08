"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherController = void 0;
const TeacherService_1 = require("../services/TeacherService");
const responseHandler_1 = require("../utils/responseHandler");
const inputValidation_1 = require("../security/inputValidation");
const TEACHER_WRITE_FIELDS = ['fullName', 'email', 'phone', 'title', 'experience', 'company', 'specialization', 'bio', 'avatarUrl'];
class TeacherController {
    static async getAllTeachersPagination(request, response) {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;
        const search = request.query.search || '';
        try {
            const teachers = await TeacherService_1.TeacherService.getAllTeachersPagination(page, limit, search);
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách giáo viên thành công', teachers));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách giáo viên'));
        }
    }
    static async getAllTeachers(request, response) {
        try {
            const teachers = await TeacherService_1.TeacherService.getAllTeachers();
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách giáo viên thành công', teachers));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách giáo viên'));
        }
    }
    static async getTeacherById(request, response) {
        const teacherId = Number(request.params.id);
        try {
            const teacher = await TeacherService_1.TeacherService.getTeacherById(teacherId);
            if (!teacher) {
                return response.json((0, responseHandler_1.errorHandler)(404, 'Giáo viên không tồn tại'));
            }
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy thông tin giáo viên thành công', teacher));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy thông tin giáo viên'));
        }
    }
    static async createTeacher(request, response) {
        var _a;
        const teacherData = Object.assign(Object.assign({}, (0, inputValidation_1.pickAllowedFields)(request.body, TEACHER_WRITE_FIELDS)), { image: (_a = request.file) === null || _a === void 0 ? void 0 : _a.path });
        try {
            const result = await TeacherService_1.TeacherService.createTeacher(teacherData);
            return response.json((0, responseHandler_1.successHandler)(201, 'Tạo giáo viên thành công', result));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi tạo giáo viên')));
        }
    }
    static async updateTeacher(request, response) {
        var _a;
        const teacherId = Number(request.params.id);
        const teacherData = Object.assign(Object.assign({}, (0, inputValidation_1.pickAllowedFields)(request.body, TEACHER_WRITE_FIELDS)), { image: (_a = request.file) === null || _a === void 0 ? void 0 : _a.path });
        try {
            const updatedTeacher = await TeacherService_1.TeacherService.updateTeacher(teacherId, teacherData);
            return response.json((0, responseHandler_1.successHandler)(200, 'Cập nhật giáo viên thành công', updatedTeacher));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi cập nhật giáo viên'));
        }
    }
    static async deleteTeacher(request, response) {
        const teacherId = Number(request.params.id);
        try {
            await TeacherService_1.TeacherService.deleteTeacher(teacherId);
            return response.json((0, responseHandler_1.successHandler)(200, 'Xóa giáo viên thành công'));
        }
        catch (error) {
            console.error('Lỗi khi xóa giáo viên:', error);
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi xóa giáo viên. Có thể do giảng viên này đang có khóa học liên kết.'));
        }
    }
    static async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng chọn một file ảnh!" });
            }
            return res.json({ url: req.file.path });
        }
        catch (error) {
            console.error("Lỗi tại TeacherController.uploadAvatar:", error);
            return res.status(500).json({
                message: "Lỗi hệ thống khi tải ảnh lên Cloudinary",
            });
        }
    }
}
exports.TeacherController = TeacherController;
