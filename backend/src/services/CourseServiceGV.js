"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServiceGV = void 0;
const DataSource_1 = require("../models/DataSource");
const Course_1 = require("../models/entities/Course");
const CourseSyllabus_1 = require("../models/entities/CourseSyllabus");
const Teacher_1 = require("../models/entities/Teacher");
const uuid_1 = require("uuid");
class CourseServiceGV {
    // =========================================================
    // HỌC VIÊN
    // =========================================================
    static async getCourseById(courseGroupId) {
        const course = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.registrations', 'registrations')
            .leftJoinAndSelect('course.syllabus', 'syllabus')
            .where('course.courseGroupId = :courseGroupId', { courseGroupId })
            .andWhere('course.status = :status', { status: Course_1.CourseStatus.PUBLISHED })
            .addOrderBy('syllabus.orderIndex', 'ASC')
            .getOne();
        if (!course)
            return null;
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
                return Object.assign(Object.assign({}, item), { lessons: parsedLessons, items: parsedLessons });
            });
        }
        return course;
    }
    // =========================================================
    // GIẢNG VIÊN
    // =========================================================
    // 1. Lấy danh sách khóa học của giảng viên (Lấy bản ghi mới nhất của từng Group)
    static async getLecturerCourses(teacherId) {
        const allCourses = await this.courseRepository.find({
            where: [
                { teacher: { id: teacherId } },
                { teacherId: teacherId }
            ],
            order: { updatedAt: 'DESC', createdAt: 'DESC' }
        });
        const latestByGroup = new Map();
        // Chỉ lấy duy nhất bản ghi mới nhất theo thời gian được cập nhật/tạo của từng Group
        for (const course of allCourses) {
            if (!latestByGroup.has(course.courseGroupId)) {
                latestByGroup.set(course.courseGroupId, course);
            }
        }
        return Array.from(latestByGroup.values());
    }
    // 2. Lấy hoặc khởi tạo Profile Giảng viên
    static async getOrCreateTeacherProfile(userId, fullName) {
        let teacherProfile = await this.teacherRepository.findOne({
            where: { user: { id: userId } }
        });
        if (!teacherProfile) {
            try {
                console.log(`[Auto-Fix Service] Đang tự động tạo hồ sơ Giảng viên cho User ID: ${userId}`);
                const newTeacher = this.teacherRepository.create({
                    fullName: fullName || 'Giảng viên mới',
                    bio: 'Thông tin đang cập nhật...',
                    user: { id: userId }
                });
                teacherProfile = await this.teacherRepository.save(newTeacher);
            }
            catch (error) {
                teacherProfile = await this.teacherRepository.findOne({
                    where: { user: { id: userId } }
                });
                if (!teacherProfile)
                    throw error;
            }
        }
        return teacherProfile;
    }
    // 3. Tạo bản nháp mới
    static async createDraft(title, teacherId) {
        const newDraft = this.courseRepository.create({
            courseGroupId: (0, uuid_1.v4)(),
            title: title,
            teacherId: teacherId,
            status: Course_1.CourseStatus.DRAFT,
            courseData: [],
            blocks: {},
            price: 0
        });
        return await this.courseRepository.save(newDraft);
    }
    // 4. Lấy bản nháp (Nếu chưa có DRAFT thì lấy PUBLISHED mới nhất)
    static async getDraft(courseGroupId, teacherId) {
        let draft = await this.courseRepository.findOne({
            where: [
                { courseGroupId, status: Course_1.CourseStatus.DRAFT, teacher: { id: teacherId } },
                { courseGroupId, status: Course_1.CourseStatus.DRAFT, teacherId: teacherId }
            ]
        });
        if (!draft) {
            draft = await this.courseRepository.findOne({
                where: [
                    { courseGroupId, status: Course_1.CourseStatus.PUBLISHED, teacher: { id: teacherId } },
                    { courseGroupId, status: Course_1.CourseStatus.PUBLISHED, teacherId: teacherId }
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
    static async updateDraft(courseGroupId, teacherId, courseDataInput) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const draft = await this.getDraft(courseGroupId, teacherId);
        draft.title = (_a = courseDataInput.title) !== null && _a !== void 0 ? _a : draft.title;
        draft.shortDesc = (_b = courseDataInput.shortDesc) !== null && _b !== void 0 ? _b : draft.shortDesc;
        draft.target = (_c = courseDataInput.target) !== null && _c !== void 0 ? _c : draft.target;
        draft.imageUrl = (_d = courseDataInput.imageUrl) !== null && _d !== void 0 ? _d : draft.imageUrl;
        draft.category = (_e = courseDataInput.category) !== null && _e !== void 0 ? _e : draft.category;
        draft.format = (_f = courseDataInput.format) !== null && _f !== void 0 ? _f : draft.format;
        draft.frequency = (_g = courseDataInput.frequency) !== null && _g !== void 0 ? _g : draft.frequency;
        draft.lessonDuration = (_h = courseDataInput.lessonDuration) !== null && _h !== void 0 ? _h : draft.lessonDuration;
        draft.price = (_j = courseDataInput.price) !== null && _j !== void 0 ? _j : draft.price;
        draft.courseData = (_k = courseDataInput.courseData) !== null && _k !== void 0 ? _k : draft.courseData;
        draft.blocks = (_l = courseDataInput.blocks) !== null && _l !== void 0 ? _l : draft.blocks;
        return this.courseRepository.save(draft);
    }
    // 6. Gỡ khóa học (Chuyển tất cả bản ghi cùng courseGroupId về DRAFT)
    static async unpublishCourse(courseGroupId, teacherId) {
        const courses = await this.courseRepository.find({
            where: [
                { courseGroupId, teacher: { id: teacherId } },
                { courseGroupId, teacherId: teacherId }
            ]
        });
        if (!courses || courses.length === 0) {
            throw { status: 404, message: 'Không tìm thấy khóa học hoặc bạn không có quyền thao tác!' };
        }
        await this.courseRepository
            .createQueryBuilder()
            .update(Course_1.Course)
            .set({ status: Course_1.CourseStatus.DRAFT })
            .where('courseGroupId = :courseGroupId', { courseGroupId })
            .execute();
        return { courseGroupId, status: Course_1.CourseStatus.DRAFT };
    }
    // 7. Xuất bản khóa học từ Bản nháp
    static async publishCourse(courseGroupId, teacherId) {
        const draft = await this.getDraft(courseGroupId, teacherId);
        return await DataSource_1.AppDataSource.transaction(async (transactionalEntityManager) => {
            const courseRepo = transactionalEntityManager.getRepository(Course_1.Course);
            const syllabusRepo = transactionalEntityManager.getRepository(CourseSyllabus_1.CourseSyllabus);
            // 1. Chuyển phiên bản PUBLISHED cũ sang ARCHIVED
            await courseRepo.update({ courseGroupId, status: Course_1.CourseStatus.PUBLISHED }, { status: Course_1.CourseStatus.ARCHIVED });
            // 2. Cập nhật bản ghi hiện tại sang PUBLISHED
            draft.status = Course_1.CourseStatus.PUBLISHED;
            const savedPublishedCourse = await courseRepo.save(draft);
            // 3. Đồng bộ danh sách Chương/Bài (courseData) sang bảng CourseSyllabus
            if (Array.isArray(draft.courseData) && draft.courseData.length > 0) {
                await syllabusRepo.delete({ courseId: savedPublishedCourse.id });
                const newSyllabi = draft.courseData.map((unit, index) => {
                    return syllabusRepo.create({
                        courseId: savedPublishedCourse.id,
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
exports.CourseServiceGV = CourseServiceGV;
CourseServiceGV.courseRepository = DataSource_1.AppDataSource.getRepository(Course_1.Course);
CourseServiceGV.teacherRepository = DataSource_1.AppDataSource.getRepository(Teacher_1.Teacher);
