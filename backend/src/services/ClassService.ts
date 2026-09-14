import { AppDataSource } from "../models/DataSource";
import { Class } from "../models/entities/Class";

export class ClassService {
    private static classRepository = AppDataSource.getRepository(Class);

    static async getAllClasses() {
        return this.classRepository.find({
            relations: { course: true, teacher: true, schedules: true, enrollments: true },
            order: { startDate: 'ASC' },
        });
    }

    static async getClassById(id: number) {
        return this.classRepository.findOne({
            where: { id },
            relations: { course: true, teacher: true, schedules: true, enrollments: true }
        })
    }

    static async createClass(classData: Partial<Class>) {
        const newClass = this.classRepository.create(classData);
        return this.classRepository.save(newClass);
    }

    static async updateClass (id: number, classData: Partial<Class>, requestingTeacherId: number, isAdmin: boolean) {
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