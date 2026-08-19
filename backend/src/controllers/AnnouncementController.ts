import { Request, Response } from 'express';
import { AnnouncementService } from '../services/AnnouncementService';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class AnnouncementController {
  static async getByClassId(request: Request, response: Response) {
    const classId = Number(request.query.classId);
    try {
      const announcements = await AnnouncementService.getByClassId(classId);
      return response.json(successHandler(200, 'Lấy danh sách thông báo thành công', announcements));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy danh sách thông báo'));
    }
  }

  //student xem tất cả thông báo từ các lớp đang học
  static async getMyAnnouncements(request: Request, response: Response) {
    const userId = Number((request as any).user?.id);
    try {
      const announcements = await AnnouncementService.getMyAnnouncements(userId);
      return response.json(successHandler(200, 'Lấy danh sách thông báo thành công', announcements));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy danh sách thông báo'));
    }
  }

  static async getById(request: Request, response: Response) {
    const id = Number(request.params.id);
    try {
      const announcement = await AnnouncementService.getById(id);
      if (!announcement) {
        return response.json(errorHandler(404, 'Thông báo không tồn tại'));
      }
      return response.json(successHandler(200, 'Lấy thông báo thành công', announcement));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi lấy thông báo'));
    }
  }

  static async create(request: Request, response: Response) {
    try {
      const announcement = await AnnouncementService.create(request.body);
      return response.json(successHandler(201, 'Đăng thông báo thành công', announcement));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi đăng thông báo'));
    }
  }

  static async update(request: Request, response: Response) {
    const id = Number(request.params.id);
    try {
      const updated = await AnnouncementService.update(id, request.body);
      return response.json(successHandler(200, 'Cập nhật thông báo thành công', updated));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi cập nhật thông báo'));
    }
  }

  static async remove(request: Request, response: Response) {
    const id = Number(request.params.id);
    try {
      await AnnouncementService.remove(id);
      return response.json(successHandler(200, 'Xóa thông báo thành công', null));
    } catch (error) {
      return response.json(errorHandler(500, 'Lỗi khi xóa thông báo'));
    }
  }
}
