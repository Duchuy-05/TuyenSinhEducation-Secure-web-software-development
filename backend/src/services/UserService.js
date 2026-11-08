"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const DataSource_1 = require("../models/DataSource");
const User_1 = require("../models/entities/User");
class UserService {
    static async getAllUser() {
        return this.userRepository.find({
            relations: { registrations: true },
        });
    }
    static async getUserById(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: { registrations: true },
        });
    }
    static async deleteUser(id) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        return this.userRepository.remove(user);
    }
    // cập nhật tên, sdt, avatarUrl của User
    static async updateProfile(userId, data) {
        var _a, _b, _c;
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }
        // Chỉ cập nhật field được gửi lên
        user.fullName = (_a = data.fullName) !== null && _a !== void 0 ? _a : user.fullName;
        user.avatarUrl = (_b = data.avatarUrl) !== null && _b !== void 0 ? _b : user.avatarUrl;
        user.phone = (_c = data.phone) !== null && _c !== void 0 ? _c : user.phone;
        await this.userRepository.save(user);
        // Trả về đúng field cần thiết cho FE
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            role: user.role,
        };
    }
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }
        if (!user.passwordHash) {
            throw new Error('Tài khoản này đăng nhập bằng Google, không thể đổi mật khẩu theo cách này');
        }
        // So sánh mật khẩu hiện tại với hash đã lưu — KHÔNG BAO GIỜ so sánh plain text trực tiếp
        const isMatch = await bcrypt_1.default.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new Error('Mật khẩu hiện tại không đúng');
        }
        if (newPassword.length < 6) {
            throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
        }
        // Hash mật khẩu mới trước khi lưu — giữ đúng cơ chế hash đã dùng lúc đăng ký
        const newPasswordHash = await bcrypt_1.default.hash(newPassword, 10);
        user.passwordHash = newPasswordHash;
        await this.userRepository.save(user);
        return { message: 'Đổi mật khẩu thành công' };
    }
}
exports.UserService = UserService;
UserService.userRepository = DataSource_1.AppDataSource.getRepository(User_1.User);
