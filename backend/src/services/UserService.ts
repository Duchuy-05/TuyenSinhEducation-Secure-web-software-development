import bcrypt from 'bcrypt';
import { AppDataSource } from '../models/DataSource';
import { User } from '../models/entities/User';

export class UserService {
    private static userRepository = AppDataSource.getRepository(User);

    static async getAllUser() {
        return this.userRepository.find({
            relations: {registrations: true},
        });
    }

    static async getUserById(id: number) {
        return this.userRepository.findOne({
            where: { id },
            relations: {registrations: true},
        });
    }

    static async deleteUser(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        return this.userRepository.remove(user);
    }

    // cập nhật tên, sdt, avatarUrl của User
    static async updateProfile(userId: number, data: { fullName?: string; avatarUrl?: string; phone?: string }) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        // Chỉ cập nhật field được gửi lên
        user.fullName = data.fullName ?? user.fullName;
        user.avatarUrl = data.avatarUrl ?? user.avatarUrl;
        user.phone = data.phone ?? user.phone;

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

    static async changePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }

        if (!user.passwordHash) {
            throw new Error('Tài khoản này đăng nhập bằng Google, không thể đổi mật khẩu theo cách này');
        }

        // So sánh mật khẩu hiện tại với hash đã lưu — KHÔNG BAO GIỜ so sánh plain text trực tiếp
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new Error('Mật khẩu hiện tại không đúng');
        }

        if (newPassword.length < 6) {
            throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
        }

        // Hash mật khẩu mới trước khi lưu — giữ đúng cơ chế hash đã dùng lúc đăng ký
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user.passwordHash = newPasswordHash;
        await this.userRepository.save(user);

        return { message: 'Đổi mật khẩu thành công' };
    }
}