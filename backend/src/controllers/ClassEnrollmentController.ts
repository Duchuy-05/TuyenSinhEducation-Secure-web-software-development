import { Request, Response } from 'express';
import { ClassEnrollmentService } from '../services/ClassEnrollmentService';
import { CourseServiceGV } from '../services/CourseServiceGV';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class ClassEnrollmentController {
  static async getByClassId(request: Request, response: Response) {
    const classId = Number(request.query.classId);
    if (isNaN(classId)) {
      return response.status(400).json(errorHandler(400, 'classId không hợp lệ'));
    }

    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      const enrollments = await ClassEnrollmentService.getByClassId(classId, teacherProfile.id, isAdmin);
      return response.json(successHandler(200, 'Lấy danh sách học viên trong lớp thành công', enrollments));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi lấy danh sách học viên')));
    }
  }

  static async getMyClasses(request: Request, response: Response) {
    const userId = Number((request as any).user?.id);
    try {
      const enrollments = await ClassEnrollmentService.getByUserId(userId);
      return response.json(successHandler(200, 'Lấy danh sách lớp học thành công', enrollments));
    } catch (error) {
      return response.status(500).json(errorHandler(500, 'Lỗi khi lấy danh sách lớp học'));
    }
  }

  static async create(request: Request, response: Response) {
    const { classId, userId } = request.body;
    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      const enrollment = await ClassEnrollmentService.create(classId, userId, teacherProfile.id, isAdmin);
      return response.json(successHandler(201, 'Thêm học viên vào lớp thành công', enrollment));
    } catch (error: any) {
      const status = error.status || 400;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi thêm học viên vào lớp')));
    }
  }

  static async bulkCreate(request: Request, response: Response) {
    const { classId, userIds } = request.body;
    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      const enrollments = await ClassEnrollmentService.bulkCreate(classId, userIds, teacherProfile.id, isAdmin);
      return response.status(201).json(successHandler(201, 'Thêm danh sách học viên vào lớp thành công', enrollments));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi thêm danh sách học viên')));
    }
  }

  static async updateStatus(request: Request, response: Response) {
    const id = Number(request.params.id);
    const { status } = request.body;
    if (isNaN(id)) {
      return response.status(400).json(errorHandler(400, 'ID không hợp lệ'));
    }

    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      const updated = await ClassEnrollmentService.updateStatus(id, status, teacherProfile.id, isAdmin);
      return response.json(successHandler(200, 'Cập nhật trạng thái thành công', updated));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật trạng thái')));
    }
  }

  static async remove(request: Request, response: Response) {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return response.status(400).json(errorHandler(400, 'ID không hợp lệ'));
    }

    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      await ClassEnrollmentService.remove(id, teacherProfile.id, isAdmin);
      return response.json(successHandler(200, 'Đã gỡ học viên khỏi lớp', null));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi gỡ học viên khỏi lớp')));
    }
  }
}
