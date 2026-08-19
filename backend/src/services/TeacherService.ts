import { AppDataSource } from "../models/DataSource";
import { Teacher } from "../models/entities/Teacher";
import { User, UserRole } from "../models/entities/User";
import { ILike } from "typeorm";
import bcrypt from "bcrypt";

export class TeacherService {
    private static teacherRepository = AppDataSource.getRepository(Teacher);
    private static userRepository = AppDataSource.getRepository(User);

    static async getAllTeachersPagination(page: number = 1, limit: number = 10, search?: string) {
        const whereCondition = search ? [
            { fullName: ILike(`%${search}%`) },
            { email: ILike(`%${search}%`) },
            { specialization: ILike(`%${search}%`) },
        ] : {};

        const [teachers, total] = await this.teacherRepository.findAndCount({
            where: whereCondition,
            relations: { courses: true, user: true },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });


        return {
            data: teachers,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    static async getAllTeachers() {
        return this.teacherRepository.find({
            relations: { courses: true, user: true },
            order: { createdAt: 'DESC' },
        });
    }

    static async getTeacherById(id: number) {
        return this.teacherRepository.findOne({
            where: { id },
            relations: { courses: true, user: true },
        });
    }

    static async createTeacher(teacherData: any) {
        if (!teacherData.email) {
            throw new Error("Bắt buộc phải nhập email để tạo tài khoản!");
        }

        const existingUser = await this.userRepository.findOneBy({ email: teacherData.email });
        if (existingUser) {
            throw new Error("Email này đã được sử dụng bởi một tài khoản khác!");
        }

        // Mật khẩu mặc định là 123456
        const rawPassword = '123456';
        const passwordHash = await bcrypt.hash(rawPassword, 10);

        // Tạo User
        const newUser = this.userRepository.create({
            email: teacherData.email,
            fullName: teacherData.fullName,
            phone: teacherData.phone,
            avatarUrl: teacherData.avatarUrl,
            passwordHash,
            role: UserRole.TEACHER,
            isVerified: true
        });

        const savedUser = await this.userRepository.save(newUser);

        // Tạo Teacher liên kết
        const newTeacher = this.teacherRepository.create({
            ...teacherData,
            user: savedUser
        });
        
        const savedTeacher = await this.teacherRepository.save(newTeacher);

        return {
            teacher: savedTeacher,
            generatedPassword: rawPassword
        };
    }

    static async updateTeacher(id: number, teacherData: any) {
        const teacher = await this.teacherRepository.findOneBy({ id });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        Object.assign(teacher, teacherData);
        return this.teacherRepository.save(teacher);
    }

    static async deleteTeacher(id: number) {
        const teacher = await this.teacherRepository.findOne({
            where: { id },
            relations: { user: true }
        });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        const userId = teacher.user?.id;
        
        // Xóa Teacher trước
        await this.teacherRepository.remove(teacher);
        
        // Xóa luôn User liên quan để sạch dữ liệu
        if (userId) {
            const user = await this.userRepository.findOneBy({ id: userId });
            if (user) {
                await this.userRepository.remove(user);
            }
        }
        
        return true;
    }
}
