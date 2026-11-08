"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const DataSource_1 = require("../models/DataSource");
const Course_1 = require("../models/entities/Course");
class CourseService {
    /**
     * Hàm helper nội bộ dùng để parse dữ liệu bài học từ syllabus hoặc courseData
     */
    static processCourseSyllabus(course) {
        if (!course)
            return null;
        // 1. Trường hợp có dữ liệu từ bảng CourseSyllabus
        if (Array.isArray(course.syllabus) && course.syllabus.length > 0) {
            course.syllabus = course.syllabus.map((item) => {
                let parsedLessons = [];
                if (typeof item.description === 'string' && item.description.trim().startsWith('[')) {
                    try {
                        parsedLessons = JSON.parse(item.description);
                    }
                    catch (e) {
                        console.error('Lỗi parse bài học từ syllabus description:', e);
                    }
                }
                else if (Array.isArray(item.description)) {
                    parsedLessons = item.description;
                }
                return Object.assign(Object.assign({}, item), { lessons: parsedLessons, items: parsedLessons });
            });
        }
        // 2. Trường hợp syllabus trong DB chưa có nhưng có mảng courseData trong JSON
        else if (Array.isArray(course.courseData) && course.courseData.length > 0) {
            course.syllabus = course.courseData.map((unit, index) => ({
                id: index + 1,
                orderIndex: index + 1,
                title: unit.title || `Chương ${index + 1}`,
                lessons: unit.items || unit.lessons || [],
                items: unit.items || unit.lessons || []
            }));
        }
        return course;
    }
    // 1. Lấy danh sách khóa học đã xuất bản (Đảm bảo chỉ lấy bản mới nhất của mỗi group)
    static async getAllCourses() {
        return this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .where('course.status = :status', { status: Course_1.CourseStatus.PUBLISHED })
            .andWhere((qb) => {
            const subQuery = qb
                .subQuery()
                .select('MAX(c.createdAt)')
                .from(Course_1.Course, 'c')
                .where('c.courseGroupId = course.courseGroupId')
                .andWhere('c.status = :subStatus', { subStatus: Course_1.CourseStatus.PUBLISHED })
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
    static async getAllCoursesPagination(page = 1, limit = 10) {
        const queryBuilder = this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .where('course.status = :status', { status: Course_1.CourseStatus.PUBLISHED })
            .andWhere((qb) => {
            const subQuery = qb
                .subQuery()
                .select('MAX(c.createdAt)')
                .from(Course_1.Course, 'c')
                .where('c.courseGroupId = course.courseGroupId')
                .andWhere('c.status = :subStatus', { subStatus: Course_1.CourseStatus.PUBLISHED })
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
    static async getCourseById(id) {
        const course = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.registrations', 'registrations')
            .leftJoinAndSelect('course.syllabus', 'syllabus')
            .where('course.id = :id', { id })
            .andWhere('course.status = :status', { status: Course_1.CourseStatus.PUBLISHED })
            .addOrderBy('syllabus.orderIndex', 'ASC')
            .getOne();
        return this.processCourseSyllabus(course);
    }
    // 4. Tìm bản PUBLISHED mới nhất theo Group UUID dành cho Học viên
    static async getPublishedCourseByGroupId(courseGroupId) {
        const course = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.registrations', 'registrations')
            .leftJoinAndSelect('course.syllabus', 'syllabus')
            .where('course.courseGroupId = :courseGroupId', { courseGroupId })
            .andWhere('course.status = :status', { status: Course_1.CourseStatus.PUBLISHED })
            .orderBy('course.createdAt', 'DESC')
            .addOrderBy('syllabus.orderIndex', 'ASC')
            .getOne();
        return this.processCourseSyllabus(course);
    }
    // 5. Tạo mới khóa học
    static async createCourse(courseData) {
        const newCourse = this.courseRepository.create(courseData);
        return this.courseRepository.save(newCourse);
    }
    // 6. Cập nhật khóa học
    static async updateCourse(id, courseData) {
        const course = await this.courseRepository.findOneBy({ id });
        if (!course) {
            throw { status: 404, message: 'Không tìm thấy khóa học' };
        }
        if (courseData.imageUrl === undefined && courseData.image) {
            courseData.imageUrl = courseData.image;
        }
        Object.assign(course, courseData);
        return this.courseRepository.save(course);
    }
    // 7. Xóa khóa học
    static async deleteCourse(id) {
        const course = await this.courseRepository.findOneBy({ id });
        if (!course) {
            throw { status: 404, message: 'Không tìm thấy khóa học' };
        }
        return this.courseRepository.remove(course);
    }
    // 8. Chuyển TẤT CẢ các bản ghi thuộc courseGroupId về DRAFT (Gỡ khóa học hoàn toàn)
    static async unpublishCourseByGroupId(courseGroupId) {
        await this.courseRepository
            .createQueryBuilder()
            .update(Course_1.Course)
            .set({ status: Course_1.CourseStatus.DRAFT })
            .where("courseGroupId = :courseGroupId", { courseGroupId })
            .execute();
        return { success: true, message: "Đã gỡ khóa học thành công" };
    }
}
exports.CourseService = CourseService;
CourseService.courseRepository = DataSource_1.AppDataSource.getRepository(Course_1.Course);
