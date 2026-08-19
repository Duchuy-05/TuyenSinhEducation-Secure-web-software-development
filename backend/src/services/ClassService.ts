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

    static async updateClass (id: number, classData: Partial<Class>) {
        const classToUpdate = await this.classRepository.findOne({ where: { id } });
        if (!classToUpdate) {
            throw new Error(`Class with ID ${id} not found`);
        }
        await this.classRepository.update(id, classData);
        return this.classRepository.findOne({ where: { id } });
    }
}