import { AppDataSource } from '../models/DataSource';
import { ClassEnrollment } from '../models/entities/ClassEnrollment';

export class ClassEnrollmentService {
  private static enrollmentRepository = AppDataSource.getRepository(ClassEnrollment);

  // Lấy danh sách học viên trong 1 lớp (cho admin/instructor xem)
  static async getByClassId(classId: number) {
    return this.enrollmentRepository.find({
      where: { classId },
      relations: { user: true, class: true },
      order: { enrolledAt: 'DESC' },
    });
  }

  // Lấy danh sách lớp mà 1 học viên đang theo học (cho My Courses)
  static async getByUserId(userId: number) {
    return this.enrollmentRepository.find({
      where: { userId },
      relations: { class: { course: true, teacher: true } },
      order: { enrolledAt: 'DESC' },
    });
  }

  static async create(classId: number, userId: number) {
    const existing = await this.enrollmentRepository.findOne({
      where: { classId, userId },
    });
    if (existing) {
      throw new Error('Học viên đã có trong lớp này');
    }

    const enrollment = this.enrollmentRepository.create({
      classId,
      userId,
      enrolledAt: new Date(),
      status: 'active',
    });
    return this.enrollmentRepository.save(enrollment);
  }

  // Thêm nhiều học viên vào lớp cùng lúc
  static async bulkCreate(classId: number, userIds: number[]) {
    // Lọc bỏ những userId đã có trong lớp để tránh trùng
    const existingEnrollments = await this.enrollmentRepository.find({
      where: { classId },
    });
    const existingUserIds = new Set(existingEnrollments.map((e) => e.userId));
    const newUserIds = userIds.filter((id) => !existingUserIds.has(id));

    const enrollments = newUserIds.map((userId) =>
      this.enrollmentRepository.create({
        classId,
        userId,
        enrolledAt: new Date(),
        status: 'active',
      })
    );

    return this.enrollmentRepository.save(enrollments);
  }

  // Cập nhật trạng thái: active / completed / dropped
  static async updateStatus(id: number, status: string) {
    const enrollment = await this.enrollmentRepository.findOneBy({ id });
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    enrollment.status = status as any;
    return this.enrollmentRepository.save(enrollment);
  }

  static async remove(id: number) {
    const enrollment = await this.enrollmentRepository.findOneBy({ id });
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    return this.enrollmentRepository.remove(enrollment);
  }
}