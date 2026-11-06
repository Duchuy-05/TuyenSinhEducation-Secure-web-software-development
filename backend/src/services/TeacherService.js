"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherService = void 0;
const DataSource_1 = require("../models/DataSource");
const Teacher_1 = require("../models/entities/Teacher");
const User_1 = require("../models/entities/User");
const typeorm_1 = require("typeorm");
const bcrypt_1 = __importDefault(require("bcrypt"));
class TeacherService {
    static async getAllTeachersPagination(page = 1, limit = 10, search) {
        const whereCondition = search ? [
            { fullName: (0, typeorm_1.ILike)(`%${search}%`) },
            { email: (0, typeorm_1.ILike)(`%${search}%`) },
            { specialization: (0, typeorm_1.ILike)(`%${search}%`) },
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
    static async getTeacherById(id) {
        return this.teacherRepository.findOne({
            where: { id },
            relations: { courses: true, user: true },
        });
    }
    static async createTeacher(teacherData) {
        if (!teacherData.email) {
            throw new Error("Bắt buộc phải nhập email để tạo tài khoản!");
        }
        const existingUser = await this.userRepository.findOneBy({ email: teacherData.email });
        if (existingUser) {
            throw new Error("Email này đã được sử dụng bởi một tài khoản khác!");
        }
        // Mật khẩu mặc định là 123456
        const rawPassword = '123456';
        const passwordHash = await bcrypt_1.default.hash(rawPassword, 10);
        // Tạo User
        const newUser = this.userRepository.create({
            email: teacherData.email,
            fullName: teacherData.fullName,
            phone: teacherData.phone,
            avatarUrl: teacherData.avatarUrl,
            passwordHash,
            role: User_1.UserRole.TEACHER,
            isVerified: true
        });
        const savedUser = await this.userRepository.save(newUser);
        // Tạo Teacher liên kết
        const newTeacher = this.teacherRepository.create(Object.assign(Object.assign({}, teacherData), { user: savedUser }));
        const savedTeacher = await this.teacherRepository.save(newTeacher);
        return {
            teacher: savedTeacher,
            generatedPassword: rawPassword
        };
    }
    static async updateTeacher(id, teacherData) {
        const teacher = await this.teacherRepository.findOneBy({ id });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        Object.assign(teacher, teacherData);
        return this.teacherRepository.save(teacher);
    }
    static async deleteTeacher(id) {
        var _a;
        const teacher = await this.teacherRepository.findOne({
            where: { id },
            relations: { user: true }
        });
        if (!teacher) {
            throw new Error('Teacher not found');
        }
        const userId = (_a = teacher.user) === null || _a === void 0 ? void 0 : _a.id;
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
exports.TeacherService = TeacherService;
TeacherService.teacherRepository = DataSource_1.AppDataSource.getRepository(Teacher_1.Teacher);
TeacherService.userRepository = DataSource_1.AppDataSource.getRepository(User_1.User);
