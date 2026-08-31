import { AppDataSource } from "../models/DataSource";
import { Course, CourseStatus } from "../models/entities/Course";
import { CourseSyllabus } from "../models/entities/CourseSyllabus";
import { Teacher } from "../models/entities/Teacher";
import { v4 as uuidv4 } from 'uuid';

export class CourseServiceGV {
    private static courseRepository = AppDataSource.getRepository(Course);
    private static teacherRepository = AppDataSource.getRepository(Teacher);

    // =========================================================
    // HỌC VIÊN
    // =========================================================
    static async getCourseById(courseGroupId: string) {
        const course = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.registrations', 'registrations')
            .leftJoinAndSelect('course.syllabus', 'syllabus')
            .where('course.courseGroupId = :courseGroupId', { courseGroupId })
            .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
            .addOrderBy('syllabus.orderIndex', 'ASC')
            .getOne();

        if (!course) return null;

        if (Array.isArray(course.syllabus) && course.syllabus.length > 0) {
            course.syllabus = course.syllabus.map((item: any) => {
                let parsedLessons = [];
                if (typeof item.description === 'string' && item.description.trim().startsWith('[')) {
                    try {
                        parsedLessons = JSON.parse(item.description);
                    } catch (e) {
                        console.error('Lỗi parse bài học từ syllabus description:', e);
                    }
                }

                return {
                    ...item,
                    lessons: parsedLessons,
                    items: parsedLessons
                };
            });
        }

        return course;
    }

    // =========================================================
    // GIẢNG VIÊN
    // =========================================================

    // 1. Lấy danh sách khóa học của giảng viên (Lấy bản ghi mới nhất của từng Group)
    static async getLecturerCourses(teacherId: number) {
        const allCourses = await this.courseRepository.find({
            where: [
                { teacher: { id: teacherId } },
                { teacherId: teacherId as any }
            ],
            order: { updatedAt: 'DESC', createdAt: 'DESC' }
        });

        const latestByGroup = new Map<string, Course>();

        // Chỉ lấy duy nhất bản ghi mới nhất theo thời gian được cập nhật/tạo của từng Group
        for (const course of allCourses) {
            if (!latestByGroup.has(course.courseGroupId)) {
                latestByGroup.set(course.courseGroupId, course);
            }
        }

        return Array.from(latestByGroup.values());
    }

    // 2. Lấy hoặc khởi tạo Profile Giảng viên
    static async getOrCreateTeacherProfile(userId: number, fullName?: string): Promise<Teacher> {
        let teacherProfile = await this.teacherRepository.findOne({
            where: { user: { id: userId } }
        });

        if (!teacherProfile) {
            try {
                console.log(`[Auto-Fix Service] Đang tự động tạo hồ sơ Giảng viên cho User ID: ${userId}`);

                const newTeacher = this.teacherRepository.create({
                    fullName: fullName || 'Giảng viên mới',
                    bio: 'Thông tin đang cập nhật...',
                    user: { id: userId } as any
                });
                teacherProfile = await this.teacherRepository.save(newTeacher);
            } catch (error) {
                teacherProfile = await this.teacherRepository.findOne({
                    where: { user: { id: userId } }
                });
                if (!teacherProfile) throw error;
            }
        }

        return teacherProfile;
    }

    // 3. Tạo bản nháp mới
    static async createDraft(title: string, teacherId: number) {
        const newDraft = this.courseRepository.create({
            courseGroupId: uuidv4(),
            title: title,
            teacherId: teacherId,
            status: CourseStatus.DRAFT,
            courseData: [],
            blocks: {},
            price: 0
        });
        return await this.courseRepository.save(newDraft);
    }

    // 4. Lấy bản nháp (Nếu chưa có DRAFT thì lấy PUBLISHED mới nhất)
    static async getDraft(courseGroupId: string, teacherId: number) {
        let draft = await this.courseRepository.findOne({
            where: [
                { courseGroupId, status: CourseStatus.DRAFT, teacher: { id: teacherId } },
                { courseGroupId, status: CourseStatus.DRAFT, teacherId: teacherId as any }
            ]
        });

        if (!draft) {
            draft = await this.courseRepository.findOne({
                where: [
                    { courseGroupId, status: CourseStatus.PUBLISHED, teacher: { id: teacherId } },
                    { courseGroupId, status: CourseStatus.PUBLISHED, teacherId: teacherId as any }
                ],
                order: { createdAt: 'DESC' }
            });
        }

        if (!draft) {
            throw { status: 404, message: 'Không tìm thấy khóa học hoặc bạn không có quyền!' };
        }
        return draft;
    }

    // 5. Lưu/Cập nhật bản nháp
    static async updateDraft(courseGroupId: string, teacherId: number, courseDataInput: any) {
        const draft = await this.getDraft(courseGroupId, teacherId);

        draft.title = courseDataInput.title ?? draft.title;
        draft.shortDesc = courseDataInput.shortDesc ?? draft.shortDesc;
        draft.target = courseDataInput.target ?? draft.target;
        draft.imageUrl = courseDataInput.imageUrl ?? draft.imageUrl;
        draft.category = courseDataInput.category ?? draft.category;
        draft.format = courseDataInput.format ?? draft.format;
        draft.frequency = courseDataInput.frequency ?? draft.frequency;
        draft.lessonDuration = courseDataInput.lessonDuration ?? draft.lessonDuration;
        draft.price = courseDataInput.price ?? draft.price;
        draft.courseData = courseDataInput.courseData ?? draft.courseData;
        draft.blocks = courseDataInput.blocks ?? draft.blocks;

        return this.courseRepository.save(draft);
    }

    // 6. Gỡ khóa học (Chuyển tất cả bản ghi cùng courseGroupId về DRAFT)
    static async unpublishCourse(courseGroupId: string, teacherId: number) {
        const courses = await this.courseRepository.find({
            where: [
                { courseGroupId, teacher: { id: teacherId } },
                { courseGroupId, teacherId: teacherId as any }
            ]
        });

        if (!courses || courses.length === 0) {
            throw { status: 404, message: 'Không tìm thấy khóa học hoặc bạn không có quyền thao tác!' };
        }

        await this.courseRepository
            .createQueryBuilder()
            .update(Course)
            .set({ status: CourseStatus.DRAFT })
            .where('courseGroupId = :courseGroupId', { courseGroupId })
            .execute();

        return { courseGroupId, status: CourseStatus.DRAFT };
    }

    // 7. Xuất bản khóa học từ Bản nháp
    static async publishCourse(courseGroupId: string, teacherId: number) {
        const draft = await this.getDraft(courseGroupId, teacherId);

        return await AppDataSource.transaction(async (transactionalEntityManager) => {
            const courseRepo = transactionalEntityManager.getRepository(Course);
            const syllabusRepo = transactionalEntityManager.getRepository(CourseSyllabus);

            // 1. Chuyển phiên bản PUBLISHED cũ sang ARCHIVED
            await courseRepo.update(
                { courseGroupId, status: CourseStatus.PUBLISHED },
                { status: CourseStatus.ARCHIVED }
            );

            // 2. Cập nhật bản ghi hiện tại sang PUBLISHED
            draft.status = CourseStatus.PUBLISHED;
            const savedPublishedCourse = await courseRepo.save(draft);

            // 3. Đồng bộ danh sách Chương/Bài (courseData) sang bảng CourseSyllabus
            if (Array.isArray(draft.courseData) && draft.courseData.length > 0) {
                await syllabusRepo.delete({ courseId: savedPublishedCourse.id as any });

                const newSyllabi = draft.courseData.map((unit: any, index: number) => {
                    return syllabusRepo.create({
                        courseId: savedPublishedCourse.id as any,
                        orderIndex: index + 1,
                        title: unit.title || `Chương ${index + 1}`,
                        description: JSON.stringify(unit.items || unit.lessons || [])
                    });
                });

                await syllabusRepo.save(newSyllabi);
            }

            return savedPublishedCourse;
        });
    }
}