import { AppDataSource } from '../models/DataSource';
import { ClassEnrollment } from '../models/entities/ClassEnrollment';
import { Class } from '../models/entities/Class';

export class ClassEnrollmentService {
  private static enrollmentRepository = AppDataSource.getRepository(ClassEnrollment);
  private static classRepository = AppDataSource.getRepository(Class);

  // Helper dùng chung: xác nhận lớp này có thuộc quyền quản lý của giáo viên không
  private static async assertClassOwnership(classId: number, requestingTeacherId: number, isAdmin: boolean) {
    if (isAdmin) return;
    const cls = await this.classRepository.findOneBy({ id: classId });
    if (!cls) {
      throw { status: 404, message: 'Không tìm thấy lớp học' };
    }
    if (cls.teacherId !== requestingTeacherId) {
      throw { status: 403, message: 'Bạn không có quyền quản lý lớp học này' };
    }
  }

  // Lấy danh sách học viên trong 1 lớp (cho admin/instructor xem)
  static async getByClassId(classId: number, requestingTeacherId: number, isAdmin: boolean) {
    await this.assertClassOwnership(classId, requestingTeacherId, isAdmin);
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

  static async create(classId: number, userId: number, requestingTeacherId: number, isAdmin: boolean) {
    // Kiểm tra quyền sở hữu lớp trước khi thêm học viên
    await this.assertClassOwnership(classId, requestingTeacherId, isAdmin);

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
  static async bulkCreate(classId: number, userIds: number[], requestingTeacherId: number, isAdmin: boolean) {
    // Kiểm tra quyền sở hữu lớp trước khi thêm hàng loạt
    await this.assertClassOwnership(classId, requestingTeacherId, isAdmin);

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
  static async updateStatus(id: number, status: string, requestingTeacherId: number, isAdmin: boolean) {
    // Load kèm relation "class" để lấy teacherId thực tế
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: { class: true },
    });
    if (!enrollment) {
      throw { status: 404, message: 'Không tìm thấy học viên trong lớp' };
    }

    if (!isAdmin && enrollment.class.teacherId !== requestingTeacherId) {
      throw { status: 403, message: 'Bạn không có quyền cập nhật enrollment này' };
    }

    enrollment.status = status as any;
    return this.enrollmentRepository.save(enrollment);
  }

  static async remove(id: number, requestingTeacherId: number, isAdmin: boolean) {
    // Load kèm relation "class"
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: { class: true },
    });
    if (!enrollment) {
      throw { status: 404, message: 'Không tìm thấy học viên trong lớp' };
    }

    if (!isAdmin && enrollment.class.teacherId !== requestingTeacherId) {
      throw { status: 403, message: 'Bạn không có quyền gỡ học viên này' };
    }
    
    return this.enrollmentRepository.remove(enrollment);
  }
}