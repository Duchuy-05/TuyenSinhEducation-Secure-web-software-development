import { AppDataSource } from "../models/DataSource";
import { CourseSyllabus } from "../models/entities/CourseSyllabus";

interface SyllabusCreateInput {
    orderIndex?: number;
    title: string;
    description?: string;
}


export class CourseSyllabusService {
    private static courseSyllabusRepository = AppDataSource.getRepository(CourseSyllabus);

    static async getAllSyllabi() {
        return this.courseSyllabusRepository.find({
            relations: { course: true },
        });
    }

    static async getSyllabusById(id: number) {
        return this.courseSyllabusRepository.findOne({
            where: { id },
            relations: { course: true },
        });
    }

    static async getSyllabusByCourseId(courseId: number) {
        return this.courseSyllabusRepository.find({
            where: { courseId },
            relations: { course: true },
            order: { orderIndex: 'ASC' },
        });
    }

    static async createSyllabus(syllabusData: any) {
        const newSyllabus = new CourseSyllabus();
        newSyllabus.courseId = syllabusData.courseId;
        newSyllabus.orderIndex = syllabusData.orderIndex ?? 0;
        newSyllabus.title = syllabusData.title;
        newSyllabus.description = syllabusData.description;
        return this.courseSyllabusRepository.save(newSyllabus);
    }

    static async updateSyllabus(id: number, syllabusData: any) {
        const syllabus = await this.courseSyllabusRepository.findOneBy({ id });
        if (!syllabus) {
            throw new Error('Course syllabus not found');
        }
        Object.assign(syllabus, syllabusData);
        return this.courseSyllabusRepository.save(syllabus);
    }

    static async deleteSyllabus(id: number) {
        const syllabus = await this.courseSyllabusRepository.findOneBy({ id });
        if (!syllabus) {
            throw new Error('Course syllabus not found');
        }
        return this.courseSyllabusRepository.remove(syllabus);
    }

    static async saveSyllabusBulk(courseId: number, syllabusItems: any[]) {
        // Lấy Repository của bảng CourseSyllabus
        const syllabusRepo = AppDataSource.getRepository(CourseSyllabus);

        await syllabusRepo.delete({ courseId: courseId });

        // 2. Chèn danh sách lộ trình mới (nếu mảng có dữ liệu)
        if (syllabusItems && syllabusItems.length > 0) {
            // Map dữ liệu từ Frontend thành mảng Object khớp với Entity
            const dataToInsert = syllabusItems.map(item => ({
                courseId: courseId,       // Tên thuộc tính trong Entity
                orderIndex: item.orderIndex, // Tên thuộc tính trong Entity
                title: item.title,
                description: item.description
            }));

            // Dùng .create() để biến mảng object thành mảng Entity
            const newSyllabusEntities = syllabusRepo.create(dataToInsert);

            // Dùng .save() để Bulk Insert toàn bộ mảng vào Database
            await syllabusRepo.save(newSyllabusEntities);
        }

        return true;
    }

    static async createSyllabusBulk(courseId: number, items: SyllabusCreateInput[]) {
        if (!items || items.length === 0) return [];

        const entities = this.courseSyllabusRepository.create(
            items.map(item => ({
                courseId,
                orderIndex: item.orderIndex ?? 0,
                title: item.title,
                description: item.description,
            }))
        );

        return this.courseSyllabusRepository.save(entities);
    }
}
