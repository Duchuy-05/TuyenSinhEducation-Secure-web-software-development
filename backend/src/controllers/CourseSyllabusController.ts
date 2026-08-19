import { Request, Response } from 'express';
import { CourseSyllabusService } from '../services/CourseSyllabusService';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class CourseSyllabusController {
    static async getAllSyllabi(request: Request, response: Response) {
        try {
            const syllabi = await CourseSyllabusService.getAllSyllabi();
            return response.json(successHandler(200, 'Lấy danh sách chương trình khóa học thành công', syllabi));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy danh sách chương trình khóa học'));
        }
    }

    static async getSyllabusById(request: Request, response: Response) {
        const syllabusId = Number(request.params.id);
        try {
            const syllabus = await CourseSyllabusService.getSyllabusById(syllabusId);
            if (!syllabus) {
                return response.json(errorHandler(404, 'Chương trình khóa học không tồn tại'));
            }
            return response.json(successHandler(200, 'Lấy thông tin chương trình khóa học thành công', syllabus));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy thông tin chương trình khóa học'));
        }
    }

    static async getSyllabusByCourseId(request: Request, response: Response) {
        const courseId = Number(request.params.courseId);
        try {
            const syllabi = await CourseSyllabusService.getSyllabusByCourseId(courseId);
            return response.json(successHandler(200, 'Lấy danh sách chương trình theo khóa học thành công', syllabi));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy danh sách chương trình theo khóa học'));
        }
    }

    static async createSyllabus(request: Request, response: Response) {
        const syllabusData = request.body;
        try {
            const newSyllabus = await CourseSyllabusService.createSyllabus(syllabusData);
            return response.json(successHandler(201, 'Tạo chương trình khóa học thành công', newSyllabus));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi tạo chương trình khóa học'));
        }
    }

    static async updateSyllabus(request: Request, response: Response) {
        const syllabusId = Number(request.params.id);
        const syllabusData = request.body;
        try {
            const updatedSyllabus = await CourseSyllabusService.updateSyllabus(syllabusId, syllabusData);
            return response.json(successHandler(200, 'Cập nhật chương trình khóa học thành công', updatedSyllabus));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi cập nhật chương trình khóa học'));
        }
    }

    static async deleteSyllabus(request: Request, response: Response) {
        const syllabusId = Number(request.params.id);
        try {
            await CourseSyllabusService.deleteSyllabus(syllabusId);
            return response.json(successHandler(200, 'Xóa chương trình khóa học thành công'));
        }
        catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi xóa chương trình khóa học'));
        }
    }

    static async updateSyllabusBulk(request: Request, response: Response) {
        // Lấy courseId từ trên URL
        const courseId = Number(request.params.courseId);

        // Lấy mảng syllabus từ Frontend gửi lên
        const { syllabus } = request.body;

        try {
            if (!syllabus || !Array.isArray(syllabus)) {
                return response.json(errorHandler(400, 'Dữ liệu lộ trình không hợp lệ'));
            }

            // Gọi Service xử lý lưu vào DB
            await CourseSyllabusService.saveSyllabusBulk(courseId, syllabus);

            return response.json(successHandler(200, 'Cập nhật lộ trình khóa học thành công', null));
        }
        catch (error) {
            console.error("Lỗi tại CourseSyllabusController.updateSyllabusBulk:", error);
            return response.json(errorHandler(500, 'Lỗi hệ thống khi cập nhật lộ trình'));
        }
    }

    static async createSyllabusBulk(request: Request, response: Response) {
        const courseId = Number(request.params.courseId);
        const { syllabus } = request.body;
        try {
            if (!syllabus || !Array.isArray(syllabus) || syllabus.length === 0) {
                return response.json(errorHandler(400, 'Dữ liệu lộ trình không hợp lệ hoặc rỗng'));
            }

            const hasInvalidItem = syllabus.some(item => !item.title);
            if (hasInvalidItem) {
                return response.json(errorHandler(400, 'Mỗi mục trong lộ trình phải có tiêu đề'));
            }

            const newSyllabi = await CourseSyllabusService.createSyllabusBulk(courseId, syllabus);
            return response.json(successHandler(201, 'Tạo mới nhiều lộ trình khóa học thành công', newSyllabi));
        } catch (error) {
            console.error('Lỗi tại CourseSyllabusController.createSyllabusBulk:', error);
            return response.json(errorHandler(500, 'Lỗi hệ thống khi tạo mới lộ trình'));
        }
    }
}
