import { AppDataSource } from '../models/DataSource';
import { Announcement } from '../models/entities/Announcement';
import { ClassEnrollment } from '../models/entities/ClassEnrollment';
import { In } from 'typeorm';

export class AnnouncementService {
  private static announcementRepository = AppDataSource.getRepository(Announcement);
  private static enrollmentRepository = AppDataSource.getRepository(ClassEnrollment);

  static async getByClassId(classId: number) {
    return this.announcementRepository.find({
      where: { classId },
      relations: { teacher: true },
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });
  }

  // Student xem tất cả thông báo từ tất cả lớp đang học — tab "Tất cả thông báo"
  static async getMyAnnouncements(userId: number) {
    const enrollments = await this.enrollmentRepository.find({
      where: { userId, status: 'active' },
    });
    const classIds = enrollments.map((e) => e.classId);

    if (classIds.length === 0) return [];

    return this.announcementRepository.find({
      where: { classId: In(classIds) },
      relations: { teacher: true, class: { course: true } },
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });
  }

  static async getById(id: number) {
    return this.announcementRepository.findOne({
      where: { id },
      relations: { teacher: true, class: true },
    });
  }

  static async create(data: Partial<Announcement>) {
    const announcement = this.announcementRepository.create(data);
    return this.announcementRepository.save(announcement);
  }

  static async update(id: number, data: Partial<Announcement>, requestingTeacherId: number, isAdmin: boolean) {
    const announcement = await this.announcementRepository.findOneBy({ id });
    if (!announcement) {
      throw { status: 404, message: 'Không tìm thấy thông báo' };
    }

    // Chặn IDOR: chỉ chủ sở hữu (giáo viên đã tạo thông báo) hoặc Admin mới được sửa
    if (!isAdmin && announcement.teacherId !== requestingTeacherId) {
      throw { status: 403, message: 'Bạn không có quyền chỉnh sửa thông báo này' };
    }

    // Chống Mass Assignment: không cho phép client tự đổi classId/teacherId của thông báo
    const { classId, teacherId, ...safeData } = data;
    Object.assign(announcement, safeData);
    return this.announcementRepository.save(announcement);
  }

  static async remove(id: number, requestingTeacherId: number, isAdmin: boolean) {
    const announcement = await this.announcementRepository.findOneBy({ id });
    if (!announcement) {
      throw { status: 404, message: 'Không tìm thấy thông báo' };
    }

    // Chặn IDOR
    if (!isAdmin && announcement.teacherId !== requestingTeacherId) {
      throw { status: 403, message: 'Bạn không có quyền xóa thông báo này' };
    }
    return this.announcementRepository.remove(announcement);
  }
}