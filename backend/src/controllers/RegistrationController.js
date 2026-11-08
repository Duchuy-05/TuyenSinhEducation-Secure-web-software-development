"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationController = void 0;
const RegistrationService_1 = require("../services/RegistrationService");
const responseHandler_1 = require("../utils/responseHandler");
const inputValidation_1 = require("../security/inputValidation");
const REGISTRATION_WRITE_FIELDS = ['courseId', 'contactName', 'contactEmail', 'contactPhone', 'note'];
class RegistrationController {
    static async getAllRegistrations(request, response) {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;
        const status = request.query.status;
        try {
            const registrations = await RegistrationService_1.RegistrationService.getAllRegistrations(page, limit, status);
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy danh sách đăng ký thành công', registrations));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy danh sách đăng ký'));
        }
    }
    static async getRegistrationById(request, response) {
        const registrationId = Number(request.params.id);
        try {
            const registration = await RegistrationService_1.RegistrationService.getRegistrationById(registrationId);
            if (!registration) {
                return response.json((0, responseHandler_1.errorHandler)(404, 'Đăng ký không tồn tại'));
            }
            return response.json((0, responseHandler_1.successHandler)(200, 'Lấy thông tin đăng ký thành công', registration));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi lấy thông tin đăng ký'));
        }
    }
    static async createRegistration(request, response) {
        try {
            const registrationData = (0, inputValidation_1.pickAllowedFields)(request.body, REGISTRATION_WRITE_FIELDS);
            const newRegistration = await RegistrationService_1.RegistrationService.createRegistration(registrationData);
            return response.json((0, responseHandler_1.successHandler)(201, 'Tạo đăng ký thành công', newRegistration));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi tạo đăng ký'));
        }
    }
    static async updateRegistration(request, response) {
        const registrationId = Number(request.params.id);
        try {
            const registrationData = (0, inputValidation_1.pickAllowedFields)(request.body, REGISTRATION_WRITE_FIELDS);
            const updatedRegistration = await RegistrationService_1.RegistrationService.updateRegistration(registrationId, registrationData);
            return response.json((0, responseHandler_1.successHandler)(200, 'Cập nhật đăng ký thành công', updatedRegistration));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi cập nhật đăng ký'));
        }
    }
    static async updateRegistrationStatus(request, response) {
        const registrationId = Number(request.params.id);
        const { status } = request.body;
        const validStatuses = ['pending', 'contacted', 'confirmed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return response.json((0, responseHandler_1.errorHandler)(400, 'Trạng thái không hợp lệ'));
        }
        try {
            const registration = await RegistrationService_1.RegistrationService.getRegistrationById(registrationId);
            if (!registration) {
                return response.json((0, responseHandler_1.errorHandler)(404, 'Đăng ký không tồn tại'));
            }
            const updated = await RegistrationService_1.RegistrationService.updateRegistrationStatus(registrationId, status);
            return response.json((0, responseHandler_1.successHandler)(200, 'Cập nhật trạng thái thành công', updated));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi cập nhật trạng thái'));
        }
    }
    static async deleteRegistration(request, response) {
        const registrationId = Number(request.params.id);
        try {
            const registration = await RegistrationService_1.RegistrationService.getRegistrationById(registrationId);
            if (!registration) {
                return response.json((0, responseHandler_1.errorHandler)(404, 'Đăng ký không tồn tại'));
            }
            await RegistrationService_1.RegistrationService.deleteRegistration(registrationId);
            return response.json((0, responseHandler_1.successHandler)(200, 'Xóa đăng ký thành công'));
        }
        catch (error) {
            return response.json((0, responseHandler_1.errorHandler)(500, 'Lỗi khi xóa đăng ký'));
        }
    }
}
exports.RegistrationController = RegistrationController;
