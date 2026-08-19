import { Request, Response } from 'express';
import { ClassService } from '../services/ClassService';
import { successHandler, errorHandler } from '../utils/responseHandler';


export class ClassController {
    static async getAllClasses (request: Request, response: Response){
        try {
            const classes = await ClassService.getAllClasses();
            return response.json(successHandler(200, 'Lấy danh sách lớp học thành công', classes));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy danh sách lớp học'));
        }
    };

    static async getClassById (request: Request, response: Response){
        const classId = Number(request.params.id);
        try {
            const classData = await ClassService.getClassById(classId);
            return response.json(successHandler(200, 'Lấy thông tin lớp học thành công', classData));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy thông tin lớp học'));
        }
    }

    static async createClass (request: Request, response: Response){
        const classData = request.body;
        try {
            const createClass = await ClassService.createClass(classData);
            return response.json(successHandler(201, 'Tạo lớp học thành công', createClass));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi tạo lớp học'));
        }
    }
    
    static async updateClass(request: Request, response: Response) {
        const classId = Number(request.params.id);
        const classData = request.body;
        try {
            const updatedClass = await ClassService.updateClass(classId, classData);
            return response.json(successHandler(200, 'Cập nhật khóa học thành công', updatedClass));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi cập nhật khóa học'));
        }
    }
}