"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementService = void 0;
const DataSource_1 = require("../models/DataSource");
const Announcement_1 = require("../models/entities/Announcement");
const ClassEnrollment_1 = require("../models/entities/ClassEnrollment");
const typeorm_1 = require("typeorm");
class AnnouncementService {
    static async getByClassId(classId) {
        return this.announcementRepository.find({
            where: { classId },
            relations: { teacher: true },
            order: { isPinned: 'DESC', createdAt: 'DESC' },
        });
    }
    // Student xem tất cả thông báo từ tất cả lớp đang học — tab "Tất cả thông báo"
    static async getMyAnnouncements(userId) {
        const enrollments = await this.enrollmentRepository.find({
            where: { userId, status: 'active' },
        });
        const classIds = enrollments.map((e) => e.classId);
        if (classIds.length === 0)
            return [];
        return this.announcementRepository.find({
            where: { classId: (0, typeorm_1.In)(classIds) },
            relations: { teacher: true, class: { course: true } },
            order: { isPinned: 'DESC', createdAt: 'DESC' },
        });
    }
    static async getById(id) {
        return this.announcementRepository.findOne({
            where: { id },
            relations: { teacher: true, class: true },
        });
    }
    static async create(data) {
        const announcement = this.announcementRepository.create(data);
        return this.announcementRepository.save(announcement);
    }
    static async update(id, data, requestingTeacherId, isAdmin) {
        const announcement = await this.announcementRepository.findOneBy({ id });
        if (!announcement) {
            throw { status: 404, message: 'Không tìm thấy thông báo' };
        }
        // Chặn IDOR: chỉ chủ sở hữu (giáo viên đã tạo thông báo) hoặc Admin mới được sửa
        if (!isAdmin && announcement.teacherId !== requestingTeacherId) {
            throw { status: 403, message: 'Bạn không có quyền chỉnh sửa thông báo này' };
        }
        // Chống Mass Assignment: không cho phép client tự đổi classId/teacherId của thông báo
        const { classId, teacherId } = data, safeData = __rest(data, ["classId", "teacherId"]);
        Object.assign(announcement, safeData);
        return this.announcementRepository.save(announcement);
    }
    static async remove(id, requestingTeacherId, isAdmin) {
        const announcement = await this.announcementRepository.findOneBy({ id });
        if (!announcement) {
            throw { status: 404, message: 'Không tìm thấy thông báo' };
        }
        // Chặn IDOR
        if (!isAdmin && announcement.teacherId !== requestingTeacherId) {
            throw { status: 403, message: 'Bạn không có quyền xóa thông báo này' };
        }
        return this.announcementRepository.remove(announcement);
    }
}
exports.AnnouncementService = AnnouncementService;
AnnouncementService.announcementRepository = DataSource_1.AppDataSource.getRepository(Announcement_1.Announcement);
AnnouncementService.enrollmentRepository = DataSource_1.AppDataSource.getRepository(ClassEnrollment_1.ClassEnrollment);
