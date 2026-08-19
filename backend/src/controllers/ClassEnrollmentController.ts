import { Request, Response } from 'express';
import { ClassEnrollmentService } from '../services/ClassEnrollmentService';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class ClassEnrollmentController {
  static async getByClassId(request: Request, response: Response) {
    const classId = Number(request.query.classId);
    try {
      const enrollments = await ClassEnrollmentService.getByClassId(classId);
      return response.json(successHandler(200, 'Lấy danh sách học viên trong lớp thành công', enrollments));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy danh sách học viên'));
    }
  }

  static async getMyClasses(request: Request, response: Response) {
    const userId = Number((request as any).user?.id);
    try {
      const enrollments = await ClassEnrollmentService.getByUserId(userId);
      return response.json(successHandler(200, 'Lấy danh sách lớp học thành công', enrollments));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy danh sách lớp học'));
    }
  }

  static async create(request: Request, response: Response) {
    const { classId, userId } = request.body;
    try {
      const enrollment = await ClassEnrollmentService.create(classId, userId);
      return response.json(successHandler(201, 'Thêm học viên vào lớp thành công', enrollment));
    } catch (error: any) {
      return response.json(errorHandler(400, error.message || 'Lỗi khi thêm học viên vào lớp'));
    }
  }

  static async bulkCreate(request: Request, response: Response) {
    const { classId, userIds } = request.body;
    try {
      const enrollments = await ClassEnrollmentService.bulkCreate(classId, userIds);
      return response.json(successHandler(201, 'Thêm danh sách học viên vào lớp thành công', enrollments));
    } catch (error) {
      console.log(error);
      return response.json(errorHandler(500, 'Lỗi khi thêm danh sách học viên'));
    }
  }

  static async updateStatus(request: Request, response: Response) {
    const id = Number(request.params.id);
    const { status } = request.body;
    try {
      const updated = await ClassEnrollmentService.updateStatus(id, status);
      return response.json(successHandler(200, 'Cập nhật trạng thái thành công', updated));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi cập nhật trạng thái'));
    }
  }

  static async remove(request: Request, response: Response) {
    const id = Number(request.params.id);
    try {
      await ClassEnrollmentService.remove(id);
      return response.json(successHandler(200, 'Đã gỡ học viên khỏi lớp', null));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi gỡ học viên khỏi lớp'));
    }
  }
}
