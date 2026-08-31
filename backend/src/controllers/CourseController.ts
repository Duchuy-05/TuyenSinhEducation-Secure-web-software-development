import { Request, Response } from 'express';
import { CourseService } from '../services/CourseService';
import { CourseServiceGV } from '../services/CourseServiceGV';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class CourseController {

    // Helper dùng chung: Chuyển đổi userId từ Token sang teacherId chuẩn & kiểm tra quyền Giảng viên
    private static async getTeacherProfile(request: Request) {
        const currentUser = (request as any).user;
        if (!currentUser || !currentUser.id) {
            throw { status: 401, message: 'Vui lòng đăng nhập để thực hiện chức năng này!' };
        }

        // Đảm bảo chỉ Teacher hoặc Admin mới có thể thao tác
        if (currentUser.role !== 'teacher' && currentUser.role !== 'admin') {
            throw { status: 403, message: 'Bạn không có quyền thực hiện thao tác này!' };
        }

        return await CourseServiceGV.getOrCreateTeacherProfile(
            Number(currentUser.id),
            currentUser.fullName
        );
    }

    // =========================================================
    // DÀNH CHO PUBLIC / HỌC VIÊN
    // =========================================================

    static async getAllCoursesPagination(request: Request, response: Response) {
        const page = Math.max(1, Number(request.query.page) || 1);
        const limit = Math.max(1, Number(request.query.limit) || 10);

        try {
            const courses = await CourseService.getAllCoursesPagination(page, limit);
            return response.status(200).json(successHandler(200, 'Lấy danh sách khóa học thành công', courses));
        } catch (error: any) {
            return response.status(500).json(errorHandler(500, error.message || 'Lỗi khi lấy danh sách khóa học'));
        }
    }

    static async getAllCourses(request: Request, response: Response) {
        try {
            const courses = await CourseService.getAllCourses();
            return response.status(200).json(successHandler(200, 'Lấy danh sách khóa học thành công', courses));
        } catch (error: any) {
            return response.status(500).json(errorHandler(500, error.message || 'Lỗi khi lấy danh sách khóa học'));
        }
    }

    static async getCourseById(request: Request, response: Response) {
        const courseId = Number(request.params.id);
        if (isNaN(courseId)) {
            return response.status(400).json(errorHandler(400, 'ID khóa học không hợp lệ'));
        }

        try {
            const course = await CourseService.getCourseById(courseId);
            if (!course) {
                return response.status(404).json(errorHandler(404, 'Khóa học không tồn tại'));
            }
            return response.status(200).json(successHandler(200, 'Lấy thông tin khóa học thành công', course));
        } catch (error: any) {
            return response.status(500).json(errorHandler(500, error.message || 'Lỗi khi lấy thông tin khóa học'));
        }
    }

    static async createCourse(request: Request, response: Response) {
        const courseData = {
            ...request.body,
            image: request.file?.path
        };
        try {
            const newCourse = await CourseService.createCourse(courseData);
            return response.status(201).json(successHandler(201, 'Tạo khóa học thành công', newCourse));
        } catch (error: any) {
            return response.status(500).json(errorHandler(500, error.message || 'Lỗi khi tạo khóa học'));
        }
    }

    static async updateCourse(request: Request, response: Response) {
        const courseId = Number(request.params.id);
        if (isNaN(courseId)) {
            return response.status(400).json(errorHandler(400, 'ID khóa học không hợp lệ'));
        }

        const courseData = {
            ...request.body,
            image: request.file?.path
        };
        try {
            const updatedCourse = await CourseService.updateCourse(courseId, courseData);
            return response.status(200).json(successHandler(200, 'Cập nhật khóa học thành công', updatedCourse));
        } catch (error: any) {
            return response.status(500).json(errorHandler(500, error.message || 'Lỗi khi cập nhật khóa học'));
        }
    }

    static async deleteCourse(request: Request, response: Response) {
        const courseId = Number(request.params.id);
        if (isNaN(courseId)) {
            return response.status(400).json(errorHandler(400, 'ID khóa học không hợp lệ'));
        }

        try {
            await CourseService.deleteCourse(courseId);
            return response.status(200).json(successHandler(200, 'Xóa khóa học thành công'));
        } catch (error: any) {
            return response.status(500).json(errorHandler(500, error.message || 'Lỗi khi xóa khóa học'));
        }
    }

    // =========================================================
    // QUẢN LÝ KHÓA HỌC DÀNH CHO GIẢNG VIÊN
    // =========================================================

    // 1. Tạo bản nháp mới
    static async createDraft(request: Request, response: Response) {
        try {
            const { title } = request.body;

            if (!title || !title.trim()) {
                return response.status(400).json(errorHandler(400, 'Tên khóa học không được để trống!'));
            }

            const teacherProfile = await CourseController.getTeacherProfile(request);
            const newDraft = await CourseServiceGV.createDraft(title.trim(), teacherProfile.id);

            return response.status(201).json(successHandler(201, 'Khởi tạo bản nháp thành công!', newDraft));

        } catch (error: any) {
            console.error("Lỗi Controller createDraft: ", error);
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi hệ thống khi tạo bản nháp'));
        }
    }

    // 2. Lấy chi tiết bản nháp
    static async getDraft(request: Request, response: Response) {
        try {
            const courseGroupId = request.params.courseGroupId as string;
            const teacherProfile = await CourseController.getTeacherProfile(request);

            const draft = await CourseServiceGV.getDraft(courseGroupId, teacherProfile.id);
            return response.status(200).json(successHandler(200, 'Lấy dữ liệu bản nháp thành công', draft));
        } catch (error: any) {
            const status = error.status || 404;
            return response.status(status).json(errorHandler(status, error.message || 'Không tìm thấy bản nháp hoặc bạn không có quyền'));
        }
    }

    // 3. Lưu/Cập nhật bản nháp (Bao gồm hỗ trợ file ảnh thumbnail nếu có)
    static async updateDraft(request: Request, response: Response) {
        try {
            const courseGroupId = request.params.courseGroupId as string;
            const teacherProfile = await CourseController.getTeacherProfile(request);
            
            const courseDataInput = {
                ...request.body,
                ...(request.file?.path && { imageUrl: request.file.path })
            };

            const updatedDraft = await CourseServiceGV.updateDraft(courseGroupId, teacherProfile.id, courseDataInput);
            return response.status(200).json(successHandler(200, 'Đã lưu tiến độ bản nháp thành công', updatedDraft));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi hệ thống khi cập nhật bản nháp'));
        }
    }

    // 4. Xuất bản khóa học từ bản nháp
    static async publishCourse(request: Request, response: Response) {
        try {
            const courseGroupId = request.params.courseGroupId as string;
            const teacherProfile = await CourseController.getTeacherProfile(request);

            const published = await CourseServiceGV.publishCourse(courseGroupId, teacherProfile.id);
            return response.status(200).json(successHandler(200, 'Xuất bản khóa học thành công!', published));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi hệ thống khi xuất bản khóa học'));
        }
    }

    // 5. Gỡ khóa học (Chuyển về DRAFT)
    static async unpublishCourse(request: Request, response: Response) {
        try {
            const courseGroupId = request.params.courseGroupId as string;
            const teacherProfile = await CourseController.getTeacherProfile(request);

            const result = await CourseServiceGV.unpublishCourse(courseGroupId, teacherProfile.id);
            return response.status(200).json(successHandler(200, 'Đã hủy xuất bản khóa học!', result));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi khi hủy xuất bản'));
        }
    }

    // 6. Lấy danh sách khóa học của Giảng viên 
    static async getLecturerCourses(request: Request, response: Response) {
        try {
            const teacherProfile = await CourseController.getTeacherProfile(request);

            const courses = await CourseServiceGV.getLecturerCourses(teacherProfile.id);
            return response.status(200).json(successHandler(200, 'Lấy danh sách khóa học của giảng viên thành công', courses));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi hệ thống khi lấy danh sách khóa học'));
        }
    }
}