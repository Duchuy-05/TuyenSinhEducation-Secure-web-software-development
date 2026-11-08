"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const ScheduleService_1 = require("../services/ScheduleService");
const CourseServiceGV_1 = require("../services/CourseServiceGV");
class ScheduleController {
    static async getByClassId(request, response) {
        const classId = Number(request.query.classId);
        try {
            const schedules = await ScheduleService_1.ScheduleService.getByClassId(classId);
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy lịch học thành công', schedules));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy lịch học'));
        }
    }
    static async getMyUpcoming(request, response) {
        var _a;
        const userId = Number((_a = request.user) === null || _a === void 0 ? void 0 : _a.id);
        try {
            const schedules = await ScheduleService_1.ScheduleService.getUpcomingByUserId(userId);
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy lịch học sắp tới thành công', schedules));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy lịch học sắp tới'));
        }
    }
    static async getById(request, response) {
        const id = Number(request.params.id);
        if (isNaN(id)) {
            return response.json((0, responseHandler_1.errorHandler)(400, 'ID buổi học không hợp lệ'));
        }
        try {
            const schedule = await ScheduleService_1.ScheduleService.getById(id);
            if (!schedule) {
                return response.status(404).json((0, responseHandler_1.errorHandler)(404, 'Buổi học không tồn tại'));
            }
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy thông tin buổi học thành công', schedule));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy thông tin buổi học'));
        }
    }
    static async create(request, response) {
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            let teacherId;
            if (isAdmin && request.body.teacherId) {
                teacherId = Number(request.body.teacherId);
            }
            else {
                const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
                teacherId = teacherProfile.id;
            }
            const { classId, sessionTitle, sessionNumber, startTime, endTime, location, status } = request.body;
            // Truyền teacherId + isAdmin để Service kiểm tra classId có thuộc giáo viên này không
            const createdSchedule = await ScheduleService_1.ScheduleService.create({ classId, sessionTitle, sessionNumber, startTime, endTime, location, status }, teacherId, isAdmin);
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Tạo buổi học thành công', createdSchedule));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi tạo buổi học')));
        }
    }
    static async bulkCreate(request, response) {
        const { classId, sessions } = request.body;
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            const schedules = await ScheduleService_1.ScheduleService.bulkCreate(classId, sessions, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(201, 'Tạo lịch học thành công', schedules));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi tạo lịch học')));
        }
    }
    static async update(request, response) {
        const id = Number(request.params.id);
        if (isNaN(id)) {
            return response.json((0, responseHandler_1.errorHandler)(400, 'ID buổi học không hợp lệ'));
        }
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            const { sessionTitle, sessionNumber, startTime, endTime, location, status } = request.body;
            const updatedSchedule = await ScheduleService_1.ScheduleService.update(id, { sessionTitle, sessionNumber, startTime, endTime, location, status }, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(200, 'Cập nhật buổi học thành công', updatedSchedule));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật buổi học')));
        }
    }
    static async remove(request, response) {
        const id = Number(request.params.id);
        if (isNaN(id)) {
            return response.json((0, responseHandler_1.errorHandler)(400, 'ID buổi học không hợp lệ'));
        }
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            await ScheduleService_1.ScheduleService.remove(id, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(200, 'Xóa buổi học thành công'));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi xóa buổi học')));
        }
    }
}
exports.ScheduleController = ScheduleController;
