import { AppDataSource } from "../models/DataSource";
import { Course, CourseStatus } from "../models/entities/Course";

export class CourseService {
    private static courseRepository = AppDataSource.getRepository(Course);

    static async getAllCourses(){
        return this.courseRepository.find({
            where: { status: CourseStatus.PUBLISHED },
            relations: {teacher: true},
            select: {
                id: true,
                category: true,
                title: true,
                shortDesc: true,
                imageUrl: true,
                price: true,
                discountPrice: true,
                status: true,
                teacher: {
                    id: true,
                    fullName: true,
                }
            },
            order: { createdAt: 'DESC'},
        });
    }

    static async getAllCoursesPagination(page: number = 1, limit: number = 10) {
        const [courses, total] = await this.courseRepository.findAndCount({
            where : { status: CourseStatus.PUBLISHED },
            relations: { registrations: true, teacher: true, syllabus: true },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            data: courses,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    static async getCourseById(id: number) {
        return this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.teacher', 'teacher')
            .leftJoinAndSelect('course.registrations', 'registrations')
            .leftJoinAndSelect('course.syllabus', 'syllabus')
            .where('course.id = :id', { id })          
            .orderBy('syllabus.orderIndex', 'ASC')
            .getOne();
    }

    static async createCourse(courseData: any) {
        const newCourse = this.courseRepository.create(courseData);
        return this.courseRepository.save(newCourse);
    }

    static async updateCourse(id: number, courseData: any) {
        const course = await this.courseRepository.findOneBy({ id });
        if (!course) {
            throw new Error('Course not found');
        }
        Object.assign(course, courseData);
        return this.courseRepository.save(course);

    }

    static async deleteCourse(id: number) {
        const course = await this.courseRepository.findOneBy({ id });
        if (!course) {
            throw new Error('Course not found');
        }
        return this.courseRepository.remove(course);
    }
}