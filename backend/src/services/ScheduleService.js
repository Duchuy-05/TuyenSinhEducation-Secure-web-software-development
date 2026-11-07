"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const DataSource_1 = require("../models/DataSource");
const Schedule_1 = require("../models/entities/Schedule");
const Class_1 = require("../models/entities/Class");
const ClassEnrollment_1 = require("../models/entities/ClassEnrollment");
const typeorm_1 = require("typeorm");
const inputValidation_1 = require("../security/inputValidation");
const SCHEDULE_WRITE_FIELDS = ['sessionTitle', 'startTime', 'endTime', 'location'];
class ScheduleService {
    static async getByClassId(classId) {
        return this.scheduleRepository.find({
            where: { classId },
            order: { sessionNumber: 'ASC' },
        });
    }
    static async getById(id) {
        return this.scheduleRepository.findOne({
            where: { id },
            relations: { class: true },
        });
    }
    // Lấy các buổi học sắp tới của 1 học viên — dùng cho tab "Lịch học" trong My Courses
    static async getUpcomingByUserId(userId) {
        // B1: Lấy các lớp mà học viên đang theo học (status active)
        const enrollments = await this.enrollmentRepository.find({
            where: { userId, status: 'active' },
        });
        const classIds = enrollments.map((e) => e.classId);
        if (classIds.length === 0)
            return [];
        // B2: Lấy các buổi học sắp tới (startTime >= hiện tại) của các lớp đó
        return this.scheduleRepository.find({
            where: {
                classId: (0, typeorm_1.In)(classIds),
                startTime: (0, typeorm_1.MoreThanOrEqual)(new Date()),
            },
            relations: { class: { course: true } },
            order: { startTime: 'ASC' },
        });
    }
    // Thêm helper dùng chung: xác nhận classId có thuộc quyền quản lý của giáo viên không
    static async assertClassOwnership(classId, requestingTeacherId, isAdmin) {
        if (isAdmin)
            return;
        const cls = await this.classRepository.findOneBy({ id: classId });
        if (!cls) {
            throw { status: 404, message: 'Không tìm thấy lớp học' };
        }
        if (cls.teacherId !== requestingTeacherId) {
            throw { status: 403, message: 'Bạn không có quyền thao tác trên lớp học này' };
        }
    }
    static async create(data, requestingTeacherId, isAdmin) {
        if (!data.classId) {
            throw { status: 400, message: 'Thiếu classId' };
        }
        await this.assertClassOwnership(data.classId, requestingTeacherId, isAdmin);
        const schedule = this.scheduleRepository.create(Object.assign(Object.assign({}, data), { status: 'upcoming' }));
        return this.scheduleRepository.save(schedule);
    }
    // Tạo nhiều buổi học cùng lúc cho 1 lớp (instructor tạo lịch hàng loạt)
    static async bulkCreate(classId, sessions, requestingTeacherId, isAdmin) {
        if (!Array.isArray(sessions) || sessions.length === 0 || sessions.length > 100) {
            throw { status: 400, message: 'Danh sách buổi học phải có từ 1 đến 100 phần tử' };
        }
        await this.assertClassOwnership(classId, requestingTeacherId, isAdmin);
        const schedules = sessions.map((session, index) => {
            const safeSession = (0, inputValidation_1.pickAllowedFields)(session, SCHEDULE_WRITE_FIELDS);
            return this.scheduleRepository.create(Object.assign(Object.assign({}, safeSession), { classId, sessionNumber: index + 1, status: 'upcoming' }));
        });
        return this.scheduleRepository.save(schedules);
    }
    static async update(id, data, requestingTeacherId, isAdmin) {
        const schedule = await this.scheduleRepository.findOne({
            where: { id },
            relations: { class: true },
        });
        if (!schedule) {
            throw { status: 404, message: 'Buổi học không tồn tại' };
        }
        if (!isAdmin && schedule.class.teacherId !== requestingTeacherId) {
            throw { status: 403, message: 'Bạn không có quyền cập nhật buổi học này' };
        }
        await this.scheduleRepository.update(id, data);
        return this.scheduleRepository.findOne({ where: { id } });
    }
    static async remove(id, requestingTeacherId, isAdmin) {
        const schedule = await this.scheduleRepository.findOne({
            where: { id },
            relations: { class: true },
        });
        if (!schedule) {
            throw { status: 404, message: 'Buổi học không tồn tại' };
        }
        if (!isAdmin && schedule.class.teacherId !== requestingTeacherId) {
            throw { status: 403, message: 'Bạn không có quyền xóa buổi học này' };
        }
        return this.scheduleRepository.remove(schedule);
    }
    // Helper — tự tính status thực tế dựa theo thời gian hiện tại
    // Có thể gọi hàm này trước khi trả response để hiển thị đúng trạng thái
    static computeStatus(schedule) {
        const now = new Date();
        if (now < new Date(schedule.startTime))
            return 'upcoming';
        if (now >= new Date(schedule.startTime) && now <= new Date(schedule.endTime))
            return 'ongoing';
        return 'completed';
    }
}
exports.ScheduleService = ScheduleService;
ScheduleService.scheduleRepository = DataSource_1.AppDataSource.getRepository(Schedule_1.Schedule);
ScheduleService.enrollmentRepository = DataSource_1.AppDataSource.getRepository(ClassEnrollment_1.ClassEnrollment);
ScheduleService.classRepository = DataSource_1.AppDataSource.getRepository(Class_1.Class);
