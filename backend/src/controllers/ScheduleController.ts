import { Request, Response } from 'express';
import { successHandler, errorHandler } from '../utils/responseHandler';
import { ScheduleService } from '../services/ScheduleService';

export class ScheduleController {
  static async getByClassId(request: Request, response: Response) {
    const classId = Number(request.query.classId);
    try {
      const schedules = await ScheduleService.getByClassId(classId);
      return response.json(successHandler(200, 'Lấy lịch học thành công', schedules));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy lịch học'));
    }
  }

  static async getMyUpcoming(request: Request, response: Response) {
    const userId = Number((request as any).user?.id);
    try {
      const schedules = await ScheduleService.getUpcomingByUserId(userId);
      return response.json(successHandler(200, 'Lấy lịch học sắp tới thành công', schedules));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy lịch học sắp tới'));
    }
  }

  static async getById(request: Request, response: Response) {
    const id = Number(request.params.id);
    try {
      const schedule = await ScheduleService.getById(id);
      if (!schedule) {
        return response.json(errorHandler(404, 'Buổi học không tồn tại'));
      }
      return response.json(successHandler(200, 'Lấy thông tin buổi học thành công', schedule));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy thông tin buổi học'));
    }
  }

  static async create(request: Request, response: Response) {
    try {
      const schedule = await ScheduleService.create(request.body);
      return response.json(successHandler(201, 'Tạo buổi học thành công', schedule));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi tạo buổi học'));
    }
  }

  static async bulkCreate(request: Request, response: Response) {
    const { classId, sessions } = request.body;
    try {
      const schedules = await ScheduleService.bulkCreate(classId, sessions);
      return response.json(successHandler(201, 'Tạo lịch học thành công', schedules));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi tạo lịch học'));
    }
  }

  static async update(request: Request, response: Response) {
    const id = Number(request.params.id);
    try {
      const updated = await ScheduleService.update(id, request.body);
      return response.json(successHandler(200, 'Cập nhật buổi học thành công', updated));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi cập nhật buổi học'));
    }
  }

  static async remove(request: Request, response: Response) {
    const id = Number(request.params.id);
    try {
      await ScheduleService.remove(id);
      return response.json(successHandler(200, 'Xóa buổi học thành công', null));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi xóa buổi học'));
    }
  }
}
