"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const responseHandler_1 = require("../utils/responseHandler");
class UserController {
    static async getAllUsers(request, response) {
        try {
            const users = await UserService_1.UserService.getAllUser();
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách người dùng thành công', users));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách người dùng'));
        }
    }
    static async getUserById(request, response) {
        const userId = Number(request.params.id);
        try {
            const user = await UserService_1.UserService.getUserById(userId);
            if (!user) {
                return response.json((0, responseHandler_1.errorHandler)(404, 'Người dùng không tồn tại'));
            }
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy thông tin người dùng thành công', user));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy thông tin người dùng'));
        }
    }
    static async deleteUser(request, response) {
        const userId = Number(request.params.id);
        try {
            const user = await UserService_1.UserService.getUserById(userId);
            if (!user) {
                return response.json((0, responseHandler_1.errorHandler)(404, 'Người dùng không tồn tại'));
            }
            await UserService_1.UserService.deleteUser(userId);
            return response.json((0, responseHandler_1.successHandler)(200, 'Xóa người dùng thành công'));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi xóa người dùng'));
        }
    }
    // Cập nhật thông tin người dùng (tên, số điện thoại, avatarUrl)
    static async updateProfile(request, response) {
        try {
            const currentUser = request.user;
            if (!currentUser) {
                return response.json((0, responseHandler_1.errorHandler)(401, 'Vui lòng đăng nhập'));
            }
            const { fullName, avatarUrl, phone } = request.body;
            const updatedUser = await UserService_1.UserService.updateProfile(Number(currentUser.id), { fullName, avatarUrl, phone });
            return response.json((0, responseHandler_1.successHandler)(200, 'Cập nhật hồ sơ thành công', updatedUser));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi cập nhật hồ sơ')));
        }
    }
    // Đổi mật khẩu người dùng
    static async changePassword(request, response) {
        try {
            const currentUser = request.user;
            if (!currentUser) {
                return response.json((0, responseHandler_1.errorHandler)(401, 'Vui lòng đăng nhập'));
            }
            const { currentPassword, newPassword } = request.body;
            if (!currentPassword || !newPassword) {
                return response.json((0, responseHandler_1.errorHandler)(400, 'Vui lòng nhập đầy đủ mật khẩu'));
            }
            const result = await UserService_1.UserService.changePassword(Number(currentUser.id), currentPassword, newPassword);
            return response.json((0, responseHandler_1.successHandler)(200, result.message));
        }
        catch (error) {
            // Lỗi sai mật khẩu hiện tại nên trả 400, không phải 500
            return response.json((0, responseHandler_1.errorHandler)(400, (error && typeof error.status === 'number' ? error.message : 'Lỗi khi đổi mật khẩu')));
        }
    }
}
exports.UserController = UserController;
