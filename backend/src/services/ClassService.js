"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassService = void 0;
const DataSource_1 = require("../models/DataSource");
const Class_1 = require("../models/entities/Class");
class ClassService {
    static async getAllClasses() {
        return this.classRepository.find({
            relations: { course: true, teacher: true, schedules: true, enrollments: true },
            order: { startDate: 'ASC' },
        });
    }
    static async getClassById(id) {
        return this.classRepository.findOne({
            where: { id },
            relations: { course: true, teacher: true, schedules: true, enrollments: true }
        });
    }
    static async createClass(classData) {
        const newClass = this.classRepository.create(classData);
        return this.classRepository.save(newClass);
    }
    static async updateClass(id, classData, requestingTeacherId, isAdmin) {
        const classToUpdate = await this.classRepository.findOne({ where: { id } });
        if (!classToUpdate) {
            throw { status: 404, message: `Không tìm thấy lớp học với ID ${id}` };
        }
        if (!isAdmin && classToUpdate.teacherId !== requestingTeacherId) {
            throw { status: 403, message: 'Bạn không có quyền cập nhật lớp học này' };
        }
        await this.classRepository.update(id, classData);
        return this.classRepository.findOne({ where: { id } });
    }
}
exports.ClassService = ClassService;
ClassService.classRepository = DataSource_1.AppDataSource.getRepository(Class_1.Class);
