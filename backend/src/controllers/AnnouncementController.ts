import { Request, Response } from 'express';
import { AnnouncementService } from '../services/AnnouncementService';
import { successHandler, errorHandler } from '../utils/responseHandler';
import { CourseServiceGV } from '../services/CourseServiceGV';


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
        return response.status(404).json(errorHandler(404, 'Thông báo không tồn tại'));
      }
      return response.json(successHandler(200, 'Lấy thông báo thành công', announcement));
    } catch (error) {
      return response.status(500).json(errorHandler(500, 'Lỗi khi lấy thông báo'));
    }
  }

  static async create(request: Request, response: Response) {
    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';

      // Xác định teacherId thực sự đang tạo thông báo, không tin field client tự gửi lên
      let teacherId: number;
      if (isAdmin && request.body.teacherId) {
        // Admin có thể tạo hộ, chỉ định rõ teacherId
        teacherId = Number(request.body.teacherId);
      } else {
        const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
          Number(currentUser.id),
          currentUser.fullName
        );
        teacherId = teacherProfile.id;
      }

      // Whitelist field, gắn teacherId lấy từ server — không tin client gửi teacherId tùy ý
      const { title, content, type, isPinned, classId } = request.body;
      const announcement = await AnnouncementService.create({
        title,
        content,
        type,
        isPinned,
        classId,
        teacherId,
      });

      return response.status(201).json(successHandler(201, 'Đăng thông báo thành công', announcement));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi đăng thông báo')));
    }
  }

  static async update(request: Request, response: Response) {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return response.status(400).json(errorHandler(400, 'ID thông báo không hợp lệ'));
    }

    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      const { title, content, type, isPinned } = request.body; // whitelist
      const updated = await AnnouncementService.update(
        id,
        { title, content, type, isPinned },
        teacherProfile.id,
        isAdmin
      );
      return response.json(successHandler(200, 'Cập nhật thông báo thành công', updated));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật thông báo')));
    }
  }

  static async remove(request: Request, response: Response) {
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return response.status(400).json(errorHandler(400, 'ID thông báo không hợp lệ'));
    }

    try {
      const currentUser = (request as any).user;
      const isAdmin = currentUser.role === 'admin';
      const teacherProfile = await CourseServiceGV.getOrCreateTeacherProfile(
        Number(currentUser.id),
        currentUser.fullName
      );

      await AnnouncementService.remove(id, teacherProfile.id, isAdmin);
      return response.json(successHandler(200, 'Xóa thông báo thành công', null));
    } catch (error: any) {
      const status = error.status || 500;
      return response.status(status).json(errorHandler(status, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi xóa thông báo')));
    }
  }
}
