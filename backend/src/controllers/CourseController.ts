import { Request, Response } from 'express';
import { CourseService } from '../services/CourseService';
import { CourseServiceGV } from '../services/CourseServiceGV';
import { successHandler, errorHandler } from '../utils/responseHandler';
import { AppDataSource } from '../models/DataSource';
import { Teacher } from '../models/entities/Teacher';
export class CourseController {
    static async getAllCoursesPagination(request: Request, response: Response) {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;

        try {
            const courses = await CourseService.getAllCoursesPagination(page, limit);
            return response.json(successHandler(200, 'Lấy danh sách khóa học thành công', courses));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy danh sách khóa học'));
        }
    }

    static async getAllCourses(request: Request, response: Response) {
        try {
            const courses = await CourseService.getAllCourses();
            return response.json(successHandler(200, 'Lấy danh sách khóa học thành công', courses));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy danh sách khóa học'));
        }
    }

    static async getCourseById(request: Request, response: Response) {
        const courseId = Number(request.params.id);
        try {
            const course = await CourseService.getCourseById(courseId);
            if (!course) {
                return response.json(errorHandler(404, 'Khóa học không tồn tại'));
            }
            return response.json(successHandler(200, 'Lấy thông tin khóa học thành công', course));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy thông tin khóa học'));
        }
    }

    static async createCourse(request: Request, response: Response) {
        const courseData = {
            ...request.body,
            image: request.file?.path
        };
        try {
            const newCourse = await CourseService.createCourse(courseData);
            return response.json(successHandler(201, 'Tạo khóa học thành công', newCourse));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi tạo khóa học'));
        }
    }

    static async updateCourse(request: Request, response: Response) {
        const courseId = Number(request.params.id);
        const courseData = {
            ...request.body,
            image: request.file?.path
        };
        try {
            const updatedCourse = await CourseService.updateCourse(courseId, courseData);
            return response.json(successHandler(200, 'Cập nhật khóa học thành công', updatedCourse));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi cập nhật khóa học'));
        }
    }

    static async deleteCourse( request: Request, response: Response) {
        const courseId = Number(request.params.id);
        try {
            await CourseService.deleteCourse(courseId);
            return response.json(successHandler(200, 'Xóa khóa học thành công'));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi xóa khóa học'));
        }
    }

    // Khởi tạo khóa học cho Giảng viên
    // 1. Tạo bản nháp mới
    static async createDraft(request: Request, response: Response) {
        try {
            const { title } = request.body;
            
            // 1. Nhận thông tin user từ Token
            const currentUser = (request as any).user;

            if (!currentUser) {
                return response.json(errorHandler(401, 'Vui lòng đăng nhập để thực hiện chức năng này!'));
            }

            if (currentUser.role !== 'teacher' && currentUser.role !== 'admin') {
                return response.json(errorHandler(403, 'Bạn không có quyền! Chỉ Giảng viên mới được phép tạo khóa học.'));
            }

            if (!title) {
                return response.json(errorHandler(400, 'Tên khóa học không được để trống!'));
            }

            const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
                Number(currentUser.id), 
                currentUser.fullName
            );

            const newDraft = await CourseServiceGV.createDraft(title, teacherProfile.id);
            
            return response.json(successHandler(201, 'Khởi tạo bản nháp thành công!', newDraft));

        } catch (error: any) {
            console.error("Lỗi Controller createDraft: ", error);
            return response.json(errorHandler(500, error.message || 'Lỗi hệ thống khi tạo bản nháp'));
        }
    }

    // 2. Lấy chi tiết bản nháp đổ vào UI Builder kéo thả
    static async getDraft(request: Request, response: Response) {
        try {
            const courseGroupId = request.params.courseGroupId as string;
            const teacherId = (request as any).user?.id || request.body.teacherId || 1;

            const draft = await CourseServiceGV.getDraft(courseGroupId, Number(teacherId));
            return response.json(successHandler(200, 'Lấy dữ liệu bản nháp thành công', draft));
        } catch (error: any) {
            return response.json(errorHandler(404, error.message || 'Không tìm thấy bản nháp hoặc bạn không có quyền'));
        }
    }

    // 3. Lưu/Cập nhật cấu trúc JSON liên tục khi kéo thả
    static async updateDraft(request: Request, response: Response) {
        try {
            const courseGroupId = request.params.courseGroupId as string;
            const teacherId = (request as any).user?.id || request.body.teacherId || 1;
            const courseDataInput = request.body; // Toàn bộ mảng JSON cấu trúc Units/Lessons/Blocks gửi từ FE lên

            const updatedDraft = await CourseServiceGV.updateDraft(courseGroupId, Number(teacherId), courseDataInput);
            return response.json(successHandler(200, 'Đã lưu tiến độ bản nháp thành công', updatedDraft));
        } catch (error: any) {
            return response.json(errorHandler(500, error.message || 'Lỗi hệ thống khi cập nhật bản nháp'));
        }
    }

    // publish từ bản nháp thành công
    static async publishCourse(request: Request, response: Response) {
        try {
            const courseGroupId = request.params.courseGroupId as string;
            const teacherId = (request as any).user?.id || request.body.teacherId || 1;

            const published = await CourseServiceGV.publishCourse(courseGroupId, Number(teacherId));
            return response.json(successHandler(200, 'Xuất bản khóa học thành công!', published));
        } catch (error: any) {
            return response.json(errorHandler(500, error.message || 'Lỗi hệ thống khi xuất bản khóa học'));
        }
    }
    static async getLecturerCourses(request: Request, response: Response) {
        try {
            // Lấy ID giảng viên từ middleware verifyToken truyền sang. 
            const teacherId = (request as any).user?.id || request.body.teacherId || 1;

            const courses = await CourseServiceGV.getLecturerCourses(Number(teacherId));
            
            return response.json(successHandler(200, 'Lấy danh sách khóa học của giảng viên thành công', courses));
        } catch (error: any) {
            return response.json(errorHandler(500, error.message || 'Lỗi hệ thống khi lấy danh sách khóa học'));
        }
    }
}
