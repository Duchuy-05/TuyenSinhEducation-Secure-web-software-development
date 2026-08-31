import { Request, Response } from 'express';
import { CourseSyllabusService } from '../services/CourseSyllabusService';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class CourseSyllabusController {

    // Helper parse courseId (Hỗ trợ cả ID dạng số và UUID string)
    private static parseCourseId(rawId: string): number | string {
        return !isNaN(Number(rawId)) && rawId.trim() !== '' ? Number(rawId) : rawId;
    }

    // 1. Lấy tất cả syllabus
    static async getAllSyllabi(request: Request, response: Response) {
        try {
            const syllabi = await CourseSyllabusService.getAllSyllabi();
            return response.status(200).json(successHandler(200, 'Lấy danh sách chương trình khóa học thành công', syllabi));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi khi lấy danh sách chương trình khóa học'));
        }
    }

    // 2. Lấy syllabus theo Syllabus ID
    static async getSyllabusById(request: Request, response: Response) {
        const syllabusId = Number(request.params.id);
        if (isNaN(syllabusId)) {
            return response.status(400).json(errorHandler(400, 'Syllabus ID không hợp lệ'));
        }

        try {
            const syllabus = await CourseSyllabusService.getSyllabusById(syllabusId);
            if (!syllabus) {
                return response.status(404).json(errorHandler(404, 'Chương trình khóa học không tồn tại'));
            }
            return response.status(200).json(successHandler(200, 'Lấy thông tin chương trình khóa học thành công', syllabus));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi khi lấy thông tin chương trình khóa học'));
        }
    }

    // 3. Lấy danh sách syllabus theo Course ID (hoặc courseGroupId)
    static async getSyllabusByCourseId(request: Request, response: Response) {
        const rawCourseId = request.params.courseId as string;
        if (!rawCourseId) {
            return response.status(400).json(errorHandler(400, 'Course ID không được để trống'));
        }
        const courseId = CourseSyllabusController.parseCourseId(rawCourseId);

        try {
            const syllabi = await CourseSyllabusService.getSyllabusByCourseId(courseId);
            return response.status(200).json(successHandler(200, 'Lấy danh sách chương trình theo khóa học thành công', syllabi));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi khi lấy danh sách chương trình theo khóa học'));
        }
    }

    // 4. Tạo một mục syllabus lẻ
    static async createSyllabus(request: Request, response: Response) {
        const syllabusData = request.body;
        
        if (!syllabusData || Object.keys(syllabusData).length === 0) {
            return response.status(400).json(errorHandler(400, 'Dữ liệu chương trình khóa học không được để trống'));
        }

        try {
            const newSyllabus = await CourseSyllabusService.createSyllabus(syllabusData);
            return response.status(201).json(successHandler(201, 'Tạo chương trình khóa học thành công', newSyllabus));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi khi tạo chương trình khóa học'));
        }
    }

    // 5. Cập nhật một mục syllabus lẻ
    static async updateSyllabus(request: Request, response: Response) {
        const syllabusId = Number(request.params.id);
        if (isNaN(syllabusId)) {
            return response.status(400).json(errorHandler(400, 'Syllabus ID không hợp lệ'));
        }

        const syllabusData = request.body;
        try {
            const updatedSyllabus = await CourseSyllabusService.updateSyllabus(syllabusId, syllabusData);
            return response.status(200).json(successHandler(200, 'Cập nhật chương trình khóa học thành công', updatedSyllabus));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi khi cập nhật chương trình khóa học'));
        }
    }

    // 6. Xóa một mục syllabus
    static async deleteSyllabus(request: Request, response: Response) {
        const syllabusId = Number(request.params.id);
        if (isNaN(syllabusId)) {
            return response.status(400).json(errorHandler(400, 'Syllabus ID không hợp lệ'));
        }

        try {
            await CourseSyllabusService.deleteSyllabus(syllabusId);
            return response.status(200).json(successHandler(200, 'Xóa chương trình khóa học thành công'));
        } catch (error: any) {
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi khi xóa chương trình khóa học'));
        }
    }

    // 7. Cập nhật hàng loạt (Bulk Update / Sync)
    static async updateSyllabusBulk(request: Request, response: Response) {
        const rawCourseId = request.params.courseId as string;
        if (!rawCourseId) {
            return response.status(400).json(errorHandler(400, 'Course ID không được để trống'));
        }
        const courseId = CourseSyllabusController.parseCourseId(rawCourseId);
        const { syllabus } = request.body;

        if (!syllabus || !Array.isArray(syllabus)) {
            return response.status(400).json(errorHandler(400, 'Dữ liệu lộ trình không hợp lệ (phải là danh sách)'));
        }

        try {
            await CourseSyllabusService.saveSyllabusBulk(courseId, syllabus);
            return response.status(200).json(successHandler(200, 'Cập nhật lộ trình khóa học thành công', null));
        } catch (error: any) {
            console.error(`Lỗi tại CourseSyllabusController.updateSyllabusBulk (courseId: ${rawCourseId}):`, error);
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi hệ thống khi cập nhật lộ trình'));
        }
    }

    // 8. Tạo mới hàng loạt (Bulk Create)
    static async createSyllabusBulk(request: Request, response: Response) {
        const rawCourseId = request.params.courseId as string;
        if (!rawCourseId) {
            return response.status(400).json(errorHandler(400, 'Course ID không được để trống'));
        }
        const courseId = CourseSyllabusController.parseCourseId(rawCourseId);
        const { syllabus } = request.body;

        if (!syllabus || !Array.isArray(syllabus) || syllabus.length === 0) {
            return response.status(400).json(errorHandler(400, 'Dữ liệu lộ trình không hợp lệ hoặc rỗng'));
        }

        const hasInvalidItem = syllabus.some((item: any) => !item || !item.title || !item.title.trim());
        if (hasInvalidItem) {
            return response.status(400).json(errorHandler(400, 'Mỗi mục trong lộ trình phải có tiêu đề không được để trống'));
        }

        try {
            const newSyllabi = await CourseSyllabusService.createSyllabusBulk(courseId, syllabus);
            return response.status(201).json(successHandler(201, 'Tạo mới nhiều lộ trình khóa học thành công', newSyllabi));
        } catch (error: any) {
            console.error(`Lỗi tại CourseSyllabusController.createSyllabusBulk (courseId: ${rawCourseId}):`, error);
            const status = error.status || 500;
            return response.status(status).json(errorHandler(status, error.message || 'Lỗi hệ thống khi tạo mới lộ trình'));
        }
    }
}