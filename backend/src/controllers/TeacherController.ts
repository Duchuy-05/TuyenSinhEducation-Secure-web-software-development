import { Request, Response } from 'express';
import { TeacherService } from '../services/TeacherService';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class TeacherController {
    static async getAllTeachersPagination(request: Request, response: Response) {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;
        const search = (request.query.search as string) || '';

        try {
            const teachers = await TeacherService.getAllTeachersPagination(page, limit, search);
            return response.json(successHandler(200, 'Lấy danh sách giáo viên thành công', teachers));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy danh sách giáo viên'));
        }
    }
    
    static async getAllTeachers(request: Request, response: Response) {
        try {
            const teachers = await TeacherService.getAllTeachers();
            return response.json(successHandler(200, 'Lấy danh sách giáo viên thành công', teachers));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy danh sách giáo viên'));
        }
    }

    static async getTeacherById(request: Request, response: Response) {
        const teacherId = Number(request.params.id);
        try {
            const teacher = await TeacherService.getTeacherById(teacherId);
            if (!teacher) {
                return response.json(errorHandler(404, 'Giáo viên không tồn tại'));
            }
            return response.json(successHandler(200, 'Lấy thông tin giáo viên thành công', teacher));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy thông tin giáo viên'));
        }
    }

    static async createTeacher(request: Request, response: Response) {
        const teacherData = {
            ...request.body,
            image: request.file?.path
        };
        try {
            const result = await TeacherService.createTeacher(teacherData);
            return response.json(successHandler(201, 'Tạo giáo viên thành công', result));
        }
        catch (error: any) {
            return response.json(errorHandler(500, error.message || 'Lỗi khi tạo giáo viên'));
        }
    }

    static async updateTeacher(request: Request, response: Response) {
        const teacherId = Number(request.params.id);
        const teacherData = {
            ...request.body,
            image: request.file?.path
        };

        try {
            const updatedTeacher = await TeacherService.updateTeacher(teacherId, teacherData);
            return response.json(successHandler(200, 'Cập nhật giáo viên thành công', updatedTeacher));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi cập nhật giáo viên'));
        }
    }

    static async deleteTeacher(request: Request, response: Response) {
        const teacherId = Number(request.params.id);
        try {
            await TeacherService.deleteTeacher(teacherId);
            return response.json(successHandler(200, 'Xóa giáo viên thành công'));
        }
        catch (error) {
            console.error('Lỗi khi xóa giáo viên:', error);
            return response.status(500).json(errorHandler(500, 'Lỗi khi xóa giáo viên. Có thể do giảng viên này đang có khóa học liên kết.'));
        }
    }

    public static async uploadAvatar(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng chọn một file ảnh!" });
            }

            return res.json({ url: req.file.path });
        } catch (error: any) {
            console.error("Lỗi tại TeacherController.uploadAvatar:", error);

            return res.status(500).json({
                message: "Lỗi hệ thống khi tải ảnh lên Cloudinary",
                error: error.message
            });
        }
    }
}
