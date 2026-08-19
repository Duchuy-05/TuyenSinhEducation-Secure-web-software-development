import { AppDataSource } from '../models/DataSource';
import { Schedule } from '../models/entities/Schedule';
import { ClassEnrollment } from '../models/entities/ClassEnrollment';
import { MoreThanOrEqual, In } from 'typeorm';

export class ScheduleService {
  private static scheduleRepository = AppDataSource.getRepository(Schedule);
  private static enrollmentRepository = AppDataSource.getRepository(ClassEnrollment);

  static async getByClassId(classId: number) {
    return this.scheduleRepository.find({
      where: { classId },
      order: { sessionNumber: 'ASC' },
    });
  }

  static async getById(id: number) {
    return this.scheduleRepository.findOne({
      where: { id },
      relations: { class: true },
    });
  }

  // Lấy các buổi học sắp tới của 1 học viên — dùng cho tab "Lịch học" trong My Courses
  static async getUpcomingByUserId(userId: number) {
    // B1: Lấy các lớp mà học viên đang theo học (status active)
    const enrollments = await this.enrollmentRepository.find({
      where: { userId, status: 'active' },
    });
    const classIds = enrollments.map((e) => e.classId);

    if (classIds.length === 0) return [];

    // B2: Lấy các buổi học sắp tới (startTime >= hiện tại) của các lớp đó
    return this.scheduleRepository.find({
      where: {
        classId: In(classIds),
        startTime: MoreThanOrEqual(new Date()),
      },
      relations: { class: { course: true } },
      order: { startTime: 'ASC' },
    });
  }

  static async create(data: Partial<Schedule>) {
    const schedule = this.scheduleRepository.create({
      ...data,
      status: 'upcoming',
    });
    return this.scheduleRepository.save(schedule);
  }

  // Tạo nhiều buổi học cùng lúc cho 1 lớp (instructor tạo lịch hàng loạt)
  static async bulkCreate(classId: number, sessions: Partial<Schedule>[]) {
    const schedules = sessions.map((session, index) =>
      this.scheduleRepository.create({
        ...session,
        classId,
        sessionNumber: index + 1,
        status: 'upcoming',
      })
    );
    return this.scheduleRepository.save(schedules);
  }

  static async update(id: number, data: Partial<Schedule>) {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    if (!schedule) {
      throw new Error('Schedule not found');
    }
    Object.assign(schedule, data);
    return this.scheduleRepository.save(schedule);
  }

  static async remove(id: number) {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    if (!schedule) {
      throw new Error('Schedule not found');
    }
    return this.scheduleRepository.remove(schedule);
  }

  // Helper — tự tính status thực tế dựa theo thời gian hiện tại
  // Có thể gọi hàm này trước khi trả response để hiển thị đúng trạng thái
  static computeStatus(schedule: Schedule): string {
    const now = new Date();
    if (now < new Date(schedule.startTime)) return 'upcoming';
    if (now >= new Date(schedule.startTime) && now <= new Date(schedule.endTime)) return 'ongoing';
    return 'completed';
  }
}