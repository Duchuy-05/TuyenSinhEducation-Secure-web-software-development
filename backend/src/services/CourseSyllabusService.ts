import { AppDataSource } from "../models/DataSource";
import { CourseSyllabus } from "../models/entities/CourseSyllabus";

// 1. Định nghĩa Interface (DTO) chặt chẽ cho dữ liệu đầu vào
export interface CreateSyllabusDTO {
    orderIndex?: number;
    title: string;
    description?: string | any[];
}

export interface UpdateSyllabusDTO {
    orderIndex?: number;
    title?: string;
    description?: string | any[];
}

// Kiểu dữ liệu định danh Khóa học (Có thể là ID số hoặc UUID chuỗi)
export type CourseIdentifier = number | string;

export class CourseSyllabusService {
    private static courseSyllabusRepository = AppDataSource.getRepository(CourseSyllabus);

    /**
     * Helper chuẩn hóa dữ liệu Syllabus: Parse chuỗi JSON trong `description`
     * thành mảng `lessons` / `items` phục vụ Client (Web/Mobile)
     */
    private static formatSyllabusItem(syllabus: CourseSyllabus | null) {
        if (!syllabus) return null;

        let parsedLessons = [];
        if (typeof syllabus.description === 'string' && syllabus.description.trim().startsWith('[')) {
            try {
                parsedLessons = JSON.parse(syllabus.description);
            } catch (e) {
                console.error('Lỗi parse bài học từ syllabus description:', e);
            }
        } else if (Array.isArray(syllabus.description)) {
            parsedLessons = syllabus.description;
        }

        return {
            ...syllabus,
            lessons: parsedLessons,
            items: parsedLessons
        };
    }

    // 1. Lấy toàn bộ syllabus
    static async getAllSyllabi(): Promise<any[]> {
        const list = await this.courseSyllabusRepository.find({
            relations: { course: true },
            order: { orderIndex: 'ASC' }
        });
        return list.map((item) => this.formatSyllabusItem(item));
    }

    // 2. Lấy syllabus theo ID
    static async getSyllabusById(id: number): Promise<any | null> {
        const syllabus = await this.courseSyllabusRepository.findOne({
            where: { id },
            relations: { course: true },
        });
        return this.formatSyllabusItem(syllabus);
    }

    // 3. Lấy syllabus theo Course Identifier (ID hoặc UUID)
    static async getSyllabusByCourseId(courseId: CourseIdentifier): Promise<any[]> {
        const list = await this.courseSyllabusRepository.find({
            where: { courseId: courseId as any },
            relations: { course: true },
            order: { orderIndex: 'ASC' },
        });
        return list.map((item) => this.formatSyllabusItem(item));
    }

    // 4. Tạo mới 1 mục syllabus
    static async createSyllabus(data: { courseId: CourseIdentifier; title: string; description?: any; orderIndex?: number }): Promise<CourseSyllabus> {
        const newSyllabus = new CourseSyllabus();
        newSyllabus.courseId = data.courseId as any;
        newSyllabus.orderIndex = data.orderIndex ?? 0;
        newSyllabus.title = String(data.title || '').trim();
        
        newSyllabus.description = typeof data.description === 'object'
            ? JSON.stringify(data.description)
            : String(data.description || '').trim();

        return this.courseSyllabusRepository.save(newSyllabus);
    }

    // 5. Cập nhật mục syllabus (Chống Mass Assignment)
    static async updateSyllabus(id: number, dto: UpdateSyllabusDTO): Promise<CourseSyllabus> {
        const syllabus = await this.courseSyllabusRepository.findOneBy({ id });
        if (!syllabus) {
            throw { status: 404, message: 'Không tìm thấy mục giáo trình' };
        }

        if (dto.title !== undefined) syllabus.title = String(dto.title).trim();
        if (dto.description !== undefined) {
            syllabus.description = typeof dto.description === 'object'
                ? JSON.stringify(dto.description)
                : String(dto.description || '').trim();
        }
        if (dto.orderIndex !== undefined) syllabus.orderIndex = dto.orderIndex;

        return this.courseSyllabusRepository.save(syllabus);
    }

    // 6. Xóa mục syllabus
    static async deleteSyllabus(id: number): Promise<CourseSyllabus> {
        const syllabus = await this.courseSyllabusRepository.findOneBy({ id });
        if (!syllabus) {
            throw { status: 404, message: 'Không tìm thấy mục giáo trình' };
        }
        return this.courseSyllabusRepository.remove(syllabus);
    }

    // 7. Đồng bộ danh sách Syllabus theo lô (Bulk Save dùng Transaction)
    static async saveSyllabusBulk(courseId: CourseIdentifier, syllabusItems: CreateSyllabusDTO[]): Promise<boolean> {
        if (syllabusItems && syllabusItems.length > 200) {
            throw { status: 400, message: 'Số lượng mục giáo trình vượt quá giới hạn cho phép (tối đa 200).' };
        }

        return await AppDataSource.transaction(async (transactionalEntityManager) => {
            const syllabusRepo = transactionalEntityManager.getRepository(CourseSyllabus);

            // Xóa các mục cũ liên quan tới khóa học này
            await syllabusRepo.delete({ courseId: courseId as any });

            // Lọc dữ liệu mới và chèn lại
            if (Array.isArray(syllabusItems) && syllabusItems.length > 0) {
                const dataToInsert = syllabusItems.map((item, index) => ({
                    courseId: courseId as any,
                    orderIndex: typeof item.orderIndex === 'number' ? item.orderIndex : index + 1,
                    title: String(item.title || '').trim(),
                    description: typeof item.description === 'object' 
                        ? JSON.stringify(item.description) 
                        : String(item.description || '').trim()
                }));

                const newSyllabusEntities = syllabusRepo.create(dataToInsert);
                await syllabusRepo.save(newSyllabusEntities);
            }

            return true;
        });
    }

    // 8. Tạo nhanh danh sách Syllabus theo lô
    static async createSyllabusBulk(courseId: CourseIdentifier, items: CreateSyllabusDTO[]): Promise<CourseSyllabus[]> {
        if (!Array.isArray(items) || items.length === 0) return [];

        const entities = this.courseSyllabusRepository.create(
            items.map((item, index) => ({
                courseId: courseId as any,
                orderIndex: item.orderIndex ?? index + 1,
                title: String(item.title || '').trim(),
                description: typeof item.description === 'object' 
                    ? JSON.stringify(item.description) 
                    : String(item.description || '').trim(),
            }))
        );

        return this.courseSyllabusRepository.save(entities);
    }
}