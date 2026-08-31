import { AppDataSource } from "../models/DataSource";
import { Course, CourseStatus } from "../models/entities/Course";

export class CourseService {
    private static courseRepository = AppDataSource.getRepository(Course);

    /**
     * Hàm helper nội bộ dùng để parse dữ liệu bài học từ syllabus hoặc courseData
     */
    private static processCourseSyllabus(course: Course | null) {
        if (!course) return null;

        // 1. Trường hợp có dữ liệu từ bảng CourseSyllabus
        if (Array.isArray(course.syllabus) && course.syllabus.length > 0) {
            course.syllabus = course.syllabus.map((item: any) => {
                let parsedLessons = [];
                if (typeof item.description === 'string' && item.description.trim().startsWith('[')) {
                    try {
                        parsedLessons = JSON.parse(item.description);
                    } catch (e) {
                        console.error('Lỗi parse bài học từ syllabus description:', e);
                    }
                } else if (Array.isArray(item.description)) {
                    parsedLessons = item.description;
                }

                return {
                    ...item,
                    lessons: parsedLessons,
                    items: parsedLessons
                };
            });
        }
        // 2. Trường hợp syllabus trong DB chưa có nhưng có mảng courseData trong JSON
        else if (Array.isArray(course.courseData) && course.courseData.length > 0) {
            course.syllabus = course.courseData.map((unit: any, index: number) => ({
                id: index + 1,
                orderIndex: index + 1,
                title: unit.title || `Chương ${index + 1}`,
                lessons: unit.items || unit.lessons || [],
                items: unit.items || unit.lessons || []
            })) as any;
        }

        return course;
    }

    // 1. Lấy danh sách khóa học đã xuất bản (Đảm bảo chỉ lấy bản mới nhất của mỗi group)
    static async getAllCourses() {
        return this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .where('course.status = :status', { status: CourseStatus.PUBLISHED })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(c.createdAt)')
                    .from(Course, 'c')
                    .where('c.courseGroupId = course.courseGroupId')
                    .andWhere('c.status = :subStatus', { subStatus: CourseStatus.PUBLISHED })
                    .getQuery();
                return `course.createdAt = ${subQuery}`;
            })
            .select([
                'course.id',
                'course.courseGroupId',
                'course.category',
                'course.title',
                'course.shortDesc',
                'course.imageUrl',
                'course.price',
                'course.discountPrice',
                'course.status',
                'course.createdAt',
                'teacher.id',
                'teacher.fullName'
            ])
            .orderBy('course.createdAt', 'DESC')
            .getMany();
    }

    // 2. Lấy danh sách phân trang cho Học viên
    static async getAllCoursesPagination(page: number = 1, limit: number = 10) {
        const queryBuilder = this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .where('course.status = :status', { status: CourseStatus.PUBLISHED })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(c.createdAt)')
                    .from(Course, 'c')
                    .where('c.courseGroupId = course.courseGroupId')
                    .andWhere('c.status = :subStatus', { subStatus: CourseStatus.PUBLISHED })
                    .getQuery();
                return `course.createdAt = ${subQuery}`;
            })
            .orderBy('course.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [courses, total] = await queryBuilder.getManyAndCount();

        return {
            data: courses,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    // 3. Lấy chi tiết khóa học theo ID phiên bản PUBLISHED
    static async getCourseById(id: number) {
        const course = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.registrations', 'registrations')
            .leftJoinAndSelect('course.syllabus', 'syllabus')
            .where('course.id = :id', { id })
            .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
            .addOrderBy('syllabus.orderIndex', 'ASC')
            .getOne();

        return this.processCourseSyllabus(course);
    }

    // 4. Tìm bản PUBLISHED mới nhất theo Group UUID dành cho Học viên
    static async getPublishedCourseByGroupId(courseGroupId: string) {
        const course = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.registrations', 'registrations')
            .leftJoinAndSelect('course.syllabus', 'syllabus')
            .where('course.courseGroupId = :courseGroupId', { courseGroupId })
            .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
            .orderBy('course.createdAt', 'DESC')
            .addOrderBy('syllabus.orderIndex', 'ASC')
            .getOne();

        return this.processCourseSyllabus(course);
    }

    // 5. Tạo mới khóa học
    static async createCourse(courseData: Partial<Course>) {
        const newCourse = this.courseRepository.create(courseData);
        return this.courseRepository.save(newCourse);
    }

    // 6. Cập nhật khóa học
    static async updateCourse(id: number, courseData: Partial<Course>) {
        const course = await this.courseRepository.findOneBy({ id });
        if (!course) {
            throw { status: 404, message: 'Không tìm thấy khóa học' };
        }

        if (courseData.imageUrl === undefined && (courseData as any).image) {
            courseData.imageUrl = (courseData as any).image;
        }

        Object.assign(course, courseData);
        return this.courseRepository.save(course);
    }

    // 7. Xóa khóa học
    static async deleteCourse(id: number) {
        const course = await this.courseRepository.findOneBy({ id });
        if (!course) {
            throw { status: 404, message: 'Không tìm thấy khóa học' };
        }
        return this.courseRepository.remove(course);
    }

    // 8. Chuyển TẤT CẢ các bản ghi thuộc courseGroupId về DRAFT (Gỡ khóa học hoàn toàn)
    static async unpublishCourseByGroupId(courseGroupId: string) {
        await this.courseRepository
            .createQueryBuilder()
            .update(Course)
            .set({ status: CourseStatus.DRAFT })
            .where("courseGroupId = :courseGroupId", { courseGroupId })
            .execute();

        return { success: true, message: "Đã gỡ khóa học thành công" };
    }
}