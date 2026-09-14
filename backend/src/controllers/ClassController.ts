import { Request, Response } from 'express';
import { ClassService } from '../services/ClassService';
import { successHandler, errorHandler } from '../utils/responseHandler';
import { CourseServiceGV } from '../services/CourseServiceGV';


export class ClassController {
    static async getAllClasses (request: Request, response: Response){
        try {
            const classes = await ClassService.getAllClasses();
            return response.json(successHandler(200, 'Lấy danh sách lớp học thành công', classes));
        } catch (error) {
            return response.status(500).json(errorHandler(500, 'Lỗi khi lấy danh sách lớp học'));
        }
    };

    static async getClassById (request: Request, response: Response){
        const classId = Number(request.params.id);
        if (isNaN(classId)) {
            return response.status(400).json(errorHandler(400, 'ID lớp học không hợp lệ'));
        }
            
        try {
            const classData = await ClassService.getClassById(classId);
            if (!classData) {
                return response.status(404).json(errorHandler(404, 'Lớp học không tồn tại'));
            }
            return response.json(successHandler(200, 'Lấy thông tin lớp học thành công', classData));
        } catch (error) {
            return response.status(500).json(errorHandler(500, 'Lỗi khi lấy thông tin lớp học'));
        }
    }

    static async createClass (request: Request, response: Response){
        try {
            const currentUser = (request as any).user;
            const isAdmin = currentUser.role === 'admin';

            // Xác định teacherId thực sự từ token, không tin client gửi lên
            // (trừ khi Admin chủ động chỉ định giáo viên phụ trách)
            let teacherId: number;
            if (isAdmin && request.body.teacherId) {
                teacherId = Number(request.body.teacherId);
            } else {
                const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
                    Number(currentUser.id),
                    currentUser.fullName
                );
                teacherId = teacherProfile.id;
            }

            // Whitelist field được phép tạo
            const { courseId, className, startDate, endDate, maxStudents, status } = request.body;
            const createdClass = await ClassService.createClass({
                courseId,
                className,
                startDate,
                endDate,
                maxStudents,
                status,
                teacherId,
            });

            return response.status(201).json(successHandler(201, 'Tạo lớp học thành công', createdClass));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi tạo lớp học')));
        }
    }
    
    static async updateClass(request: Request, response: Response) {
        const classId = Number(request.params.id);
        if (isNaN(classId)) {
            return response.status(400).json(errorHandler(400, 'ID lớp học không hợp lệ'));
        }

        try {
            const currentUser = (request as any).user;
            const isAdmin = currentUser.role === 'admin';
            const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
                Number(currentUser.id),
                currentUser.fullName
            );
            
            const { className, startDate, endDate, maxStudents, status } = request.body;

            const updatedClass = await ClassService.updateClass(
                classId,
                { className, startDate, endDate, maxStudents, status },
                teacherProfile.id,
                isAdmin
            )

            return response.json(successHandler(200, 'Cập nhật lớp học thành công', updatedClass));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật lớp học')));
        }
    }
}