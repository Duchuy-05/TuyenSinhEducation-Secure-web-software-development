import { Request, Response } from 'express';
import { successHandler, errorHandler } from '../utils/responseHandler';
import { ScheduleService } from '../services/ScheduleService';
import { CourseServiceGV } from '../services/CourseServiceGV';

export class ScheduleController {
  static async getByClassId(request: Request, response: Response) {
    const classId = Number(request.query.classId);
    try {
      const schedules = await ScheduleService.getByClassId(classId);
      return response.json(successHandler(200, 'Lấy lịch học thành công', schedules));
    } catch (error) {
      return response.status(500).json(errorHandler(500, 'Lỗi khi lấy lịch học'));
    }
  }

  static async getMyUpcoming(request: Request, response: Response) {
    const userId = Number((request as any).user?.id);
    try {
      const schedules = await ScheduleService.getUpcomingByUserId(userId);
      return response.json(successHandler(200, 'Lấy lịch học sắp tới thành công', schedules));
    } catch (error) {
      return response.status(500).json(errorHandler(500, 'Lỗi khi lấy lịch học sắp tới'));
    }
  }

  static async getById(request: Request, response: Response) {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return response.json(errorHandler(400, 'ID buổi học không hợp lệ'));
    }

    try {
      const schedule = await ScheduleService.getById(id);
      if (!schedule) {
        return response.status(404).json(errorHandler(404, 'Buổi học không tồn tại'));
      }
      return response.json(successHandler(200, 'Lấy thông tin buổi học thành công', schedule));
    } catch (error) {
      return response.status(500).json(errorHandler(500, 'Lỗi khi lấy thông tin buổi học'));
    }
  }

  static async create(request: Request, response: Response) {
    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';

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

      const { classId, sessionTitle, sessionNumber, startTime, endTime, location, status } = request.body;
      
      // Truyền teacherId + isAdmin để Service kiểm tra classId có thuộc giáo viên này không
      const createdSchedule = await ScheduleService.create(
        { classId, sessionTitle, sessionNumber, startTime, endTime, location, status },
        teacherId,
        isAdmin
      );

      return response.status(201).json(successHandler(201, 'Tạo buổi học thành công', createdSchedule));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi tạo buổi học')));
    }
  }

  static async bulkCreate(request: Request, response: Response) {
    const { classId, sessions } = request.body;
    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      const schedules = await ScheduleService.bulkCreate(classId, sessions, teacherProfile.id, isAdmin);
      return response.json(successHandler(201, 'Tạo lịch học thành công', schedules));
    } catch (error : any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi tạo lịch học')));
    }
  }

  static async update(request: Request, response: Response) {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return response.json(errorHandler(400, 'ID buổi học không hợp lệ'));
    }

    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      const { sessionTitle, sessionNumber, startTime, endTime, location, status } = request.body;

      const updatedSchedule = await ScheduleService.update(
        id,
        { sessionTitle, sessionNumber, startTime, endTime, location, status },
        teacherProfile.id,
        isAdmin
      );

      return response.json(successHandler(200, 'Cập nhật buổi học thành công', updatedSchedule));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật buổi học')));
    }
  }

  static async remove(request: Request, response: Response) {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return response.json(errorHandler(400, 'ID buổi học không hợp lệ'));
    }

    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      await ScheduleService.remove(id, teacherProfile.id, isAdmin);
      return response.json(successHandler(200, 'Xóa buổi học thành công'));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi xóa buổi học')));
    }
  }
}
