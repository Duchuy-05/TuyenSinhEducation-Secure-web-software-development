"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
const AnnouncementService_1 = require("../services/AnnouncementService");
const responseHandler_1 = require("../utils/responseHandler");
const CourseServiceGV_1 = require("../services/CourseServiceGV");
class AnnouncementController {
    static async getByClassId(request, response) {
        const classId = Number(request.query.classId);
        try {
            const announcements = await AnnouncementService_1.AnnouncementService.getByClassId(classId);
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách thông báo thành công', announcements));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách thông báo'));
        }
    }
    //student xem tất cả thông báo từ các lớp đang học
    static async getMyAnnouncements(request, response) {
        var _a;
        const userId = Number((_a = request.user) === null || _a === void 0 ? void 0 : _a.id);
        try {
            const announcements = await AnnouncementService_1.AnnouncementService.getMyAnnouncements(userId);
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách thông báo thành công', announcements));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách thông báo'));
        }
    }
    static async getById(request, response) {
        const id = Number(request.params.id);
        try {
            const announcement = await AnnouncementService_1.AnnouncementService.getById(id);
            if (!announcement) {
                return response.status(404).json((0, responseHandler_1.errorHandler)(404, 'Thông báo không tồn tại'));
            }
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy thông báo thành công', announcement));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy thông báo'));
        }
    }
    static async create(request, response) {
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            // Xác định teacherId thực sự đang tạo thông báo, không tin field client tự gửi lên
            let teacherId;
            if (isAdmin && request.body.teacherId) {
                // Admin có thể tạo hộ, chỉ định rõ teacherId
                teacherId = Number(request.body.teacherId);
            }
            else {
                const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
                teacherId = teacherProfile.id;
            }
            // Whitelist field, gắn teacherId lấy từ server — không tin client gửi teacherId tùy ý
            const { title, content, type, isPinned, classId } = request.body;
            const announcement = await AnnouncementService_1.AnnouncementService.create({
                title,
                content,
                type,
                isPinned,
                classId,
                teacherId,
            });
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Đăng thông báo thành công', announcement));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi đăng thông báo')));
        }
    }
    static async update(request, response) {
        const id = Number(request.params.id);
        if (isNaN(id)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID thông báo không hợp lệ'));
        }
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            const { title, content, type, isPinned } = request.body; // whitelist
            const updated = await AnnouncementService_1.AnnouncementService.update(id, { title, content, type, isPinned }, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(200, 'Cập nhật thông báo thành công', updated));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật thông báo')));
        }
    }
    static async remove(request, response) {
        const id = Number(request.params.id);
        if (isNaN(id)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID thông báo không hợp lệ'));
        }
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            await AnnouncementService_1.AnnouncementService.remove(id, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(200, 'Xóa thông báo thành công', null));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi xóa thông báo')));
        }
    }
}
exports.AnnouncementController = AnnouncementController;
