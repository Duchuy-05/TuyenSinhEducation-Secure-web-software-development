"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSyllabusController = void 0;
const CourseSyllabusService_1 = require("../services/CourseSyllabusService");
const responseHandler_1 = require("../utils/responseHandler");
class CourseSyllabusController {
    // Helper parse courseId (Hỗ trợ cả ID dạng số và UUID string)
    static parseCourseId(rawId) {
        return !isNaN(Number(rawId)) && rawId.trim() !== '' ? Number(rawId) : rawId;
    }
    // 1. Lấy tất cả syllabus
    static async getAllSyllabi(request, response) {
        try {
            const syllabi = await CourseSyllabusService_1.CourseSyllabusService.getAllSyllabi();
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách chương trình khóa học thành công', syllabi));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi lấy danh sách chương trình khóa học')));
        }
    }
    // 2. Lấy syllabus theo Syllabus ID
    static async getSyllabusById(request, response) {
        const syllabusId = Number(request.params.id);
        if (isNaN(syllabusId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Syllabus ID không hợp lệ'));
        }
        try {
            const syllabus = await CourseSyllabusService_1.CourseSyllabusService.getSyllabusById(syllabusId);
            if (!syllabus) {
                return response.status(404).json((0, responseHandler_1.errorHandler)(404, 'Chương trình khóa học không tồn tại'));
            }
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Lấy thông tin chương trình khóa học thành công', syllabus));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi lấy thông tin chương trình khóa học')));
        }
    }
    // 3. Lấy danh sách syllabus theo Course ID (hoặc courseGroupId)
    static async getSyllabusByCourseId(request, response) {
        const rawCourseId = request.params.courseId;
        if (!rawCourseId) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Course ID không được để trống'));
        }
        const courseId = CourseSyllabusController.parseCourseId(rawCourseId);
        try {
            const syllabi = await CourseSyllabusService_1.CourseSyllabusService.getSyllabusByCourseId(courseId);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách chương trình theo khóa học thành công', syllabi));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi lấy danh sách chương trình theo khóa học')));
        }
    }
    // 4. Tạo một mục syllabus lẻ
    static async createSyllabus(request, response) {
        const syllabusData = request.body;
        if (!syllabusData || Object.keys(syllabusData).length === 0) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Dữ liệu chương trình khóa học không được để trống'));
        }
        try {
            const newSyllabus = await CourseSyllabusService_1.CourseSyllabusService.createSyllabus(syllabusData);
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Tạo chương trình khóa học thành công', newSyllabus));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi tạo chương trình khóa học')));
        }
    }
    // 5. Cập nhật một mục syllabus lẻ
    static async updateSyllabus(request, response) {
        const syllabusId = Number(request.params.id);
        if (isNaN(syllabusId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Syllabus ID không hợp lệ'));
        }
        const syllabusData = request.body;
        try {
            const updatedSyllabus = await CourseSyllabusService_1.CourseSyllabusService.updateSyllabus(syllabusId, syllabusData);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Cập nhật chương trình khóa học thành công', updatedSyllabus));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật chương trình khóa học')));
        }
    }
    // 6. Xóa một mục syllabus
    static async deleteSyllabus(request, response) {
        const syllabusId = Number(request.params.id);
        if (isNaN(syllabusId)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Syllabus ID không hợp lệ'));
        }
        try {
            await CourseSyllabusService_1.CourseSyllabusService.deleteSyllabus(syllabusId);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Xóa chương trình khóa học thành công'));
        }
        catch (error) {
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi xóa chương trình khóa học')));
        }
    }
    // 7. Cập nhật hàng loạt (Bulk Update / Sync)
    static async updateSyllabusBulk(request, response) {
        const rawCourseId = request.params.courseId;
        if (!rawCourseId) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Course ID không được để trống'));
        }
        const courseId = CourseSyllabusController.parseCourseId(rawCourseId);
        const { syllabus } = request.body;
        if (!syllabus || !Array.isArray(syllabus)) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Dữ liệu lộ trình không hợp lệ (phải là danh sách)'));
        }
        try {
            await CourseSyllabusService_1.CourseSyllabusService.saveSyllabusBulk(courseId, syllabus);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Cập nhật lộ trình khóa học thành công', null));
        }
        catch (error) {
            console.error(`Lỗi tại CourseSyllabusController.updateSyllabusBulk (courseId: ${rawCourseId}):`, error);
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi hệ thống khi cập nhật lộ trình')));
        }
    }
    // 8. Tạo mới hàng loạt (Bulk Create)
    static async createSyllabusBulk(request, response) {
        const rawCourseId = request.params.courseId;
        if (!rawCourseId) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Course ID không được để trống'));
        }
        const courseId = CourseSyllabusController.parseCourseId(rawCourseId);
        const { syllabus } = request.body;
        if (!syllabus || !Array.isArray(syllabus) || syllabus.length === 0) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Dữ liệu lộ trình không hợp lệ hoặc rỗng'));
        }
        const hasInvalidItem = syllabus.some((item) => !item || !item.title || !item.title.trim());
        if (hasInvalidItem) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Mỗi mục trong lộ trình phải có tiêu đề không được để trống'));
        }
        try {
            const newSyllabi = await CourseSyllabusService_1.CourseSyllabusService.createSyllabusBulk(courseId, syllabus);
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Tạo mới nhiều lộ trình khóa học thành công', newSyllabi));
        }
        catch (error) {
            console.error(`Lỗi tại CourseSyllabusController.createSyllabusBulk (courseId: ${rawCourseId}):`, error);
            const status = error.status || 500;
            return response.status(status).json((0, responseHandler_1.errorHandler)(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi hệ thống khi tạo mới lộ trình')));
        }
    }
}
exports.CourseSyllabusController = CourseSyllabusController;
