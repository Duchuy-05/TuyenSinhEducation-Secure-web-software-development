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

  static async update(id: number, data: Partial<Announcement>) {
    const announcement = await this.announcementRepository.findOneBy({ id });
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    Object.assign(announcement, data);
    return this.announcementRepository.save(announcement);
  }

  static async remove(id: number) {
    const announcement = await this.announcementRepository.findOneBy({ id });
    if (!announcement) {
      throw new Error('Announcement not found');
    }
    return this.announcementRepository.remove(announcement);
  }
}