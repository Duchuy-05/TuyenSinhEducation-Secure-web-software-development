"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassEnrollmentController = void 0;
const ClassEnrollmentService_1 = require("../services/ClassEnrollmentService");
const CourseServiceGV_1 = require("../services/CourseServiceGV");
const responseHandler_1 = require("../utils/responseHandler");
class ClassEnrollmentController {
    static async getByClassId(request, response) {
        const classId = Number(request.query.classId);
        if (isNaN(classId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'classId không hợp lệ'));
        }
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            const enrollments = await ClassEnrollmentService_1.ClassEnrollmentService.getByClassId(classId, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách học viên trong lớp thành công', enrollments));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi lấy danh sách học viên')));
        }
    }
    static async getMyClasses(request, response) {
        var _a;
        const userId = Number((_a = request.user) === null || _a === void 0 ? void 0 : _a.id);
        try {
            const enrollments = await ClassEnrollmentService_1.ClassEnrollmentService.getByUserId(userId);
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách lớp học thành công', enrollments));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách lớp học'));
        }
    }
    static async create(request, response) {
        const { classId, userId } = request.body;
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            const enrollment = await ClassEnrollmentService_1.ClassEnrollmentService.create(classId, userId, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(201, 'Thêm học viên vào lớp thành công', enrollment));
        }
        catch (error) {
            const status = error.status || 400;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi thêm học viên vào lớp')));
        }
    }
    static async bulkCreate(request, response) {
        const { classId, userIds } = request.body;
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            const enrollments = await ClassEnrollmentService_1.ClassEnrollmentService.bulkCreate(classId, userIds, teacherProfile.id, isAdmin);
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Thêm danh sách học viên vào lớp thành công', enrollments));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi thêm danh sách học viên')));
        }
    }
    static async updateStatus(request, response) {
        const id = Number(request.params.id);
        const { status } = request.body;
        if (isNaN(id)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID không hợp lệ'));
        }
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            const updated = await ClassEnrollmentService_1.ClassEnrollmentService.updateStatus(id, status, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(200, 'Cập nhật trạng thái thành công', updated));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật trạng thái')));
        }
    }
    static async remove(request, response) {
        const id = Number(request.params.id);
        if (isNaN(id)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID không hợp lệ'));
        }
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            await ClassEnrollmentService_1.ClassEnrollmentService.remove(id, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(200, 'Đã gỡ học viên khỏi lớp', null));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi gỡ học viên khỏi lớp')));
        }
    }
}
exports.ClassEnrollmentController = ClassEnrollmentController;
