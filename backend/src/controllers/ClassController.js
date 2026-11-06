"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassController = void 0;
const ClassService_1 = require("../services/ClassService");
const responseHandler_1 = require("../utils/responseHandler");
const CourseServiceGV_1 = require("../services/CourseServiceGV");
class ClassController {
    static async getAllClasses(request, response) {
        try {
            const classes = await ClassService_1.ClassService.getAllClasses();
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách lớp học thành công', classes));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách lớp học'));
        }
    }
    ;
    static async getClassById(request, response) {
        const classId = Number(request.params.id);
        if (isNaN(classId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID lớp học không hợp lệ'));
        }
        try {
            const classData = await ClassService_1.ClassService.getClassById(classId);
            if (!classData) {
                return response.status(404).json((0, responseHandler_1.errorHandler)(404, 'Lớp học không tồn tại'));
            }
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy thông tin lớp học thành công', classData));
        }
        catch (error) {
            return response.status(500).json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy thông tin lớp học'));
        }
    }
    static async createClass(request, response) {
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            // Xác định teacherId thực sự từ token, không tin client gửi lên
            // (trừ khi Admin chủ động chỉ định giáo viên phụ trách)
            let teacherId;
            if (isAdmin && request.body.teacherId) {
                teacherId = Number(request.body.teacherId);
            }
            else {
                const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
                teacherId = teacherProfile.id;
            }
            // Whitelist field được phép tạo
            const { courseId, className, startDate, endDate, maxStudents, status } = request.body;
            const createdClass = await ClassService_1.ClassService.createClass({
                courseId,
                className,
                startDate,
                endDate,
                maxStudents,
                status,
                teacherId,
            });
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Tạo lớp học thành công', createdClass));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi tạo lớp học')));
        }
    }
    static async updateClass(request, response) {
        const classId = Number(request.params.id);
        if (isNaN(classId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'ID lớp học không hợp lệ'));
        }
        try {
            const currentUser = request.user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV_1.CourseServiceGV.getOrCreateTeacherProfile(Number(currentUser.id), currentUser.fullName);
            const { className, startDate, endDate, maxStudents, status } = request.body;
            const updatedClass = await ClassService_1.ClassService.updateClass(classId, { className, startDate, endDate, maxStudents, status }, teacherProfile.id, isAdmin);
            return response.json((0, responseHandler_1.successHandler)(200, 'Cập nhật lớp học thành công', updatedClass));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật lớp học')));
        }
    }
}
exports.ClassController = ClassController;
