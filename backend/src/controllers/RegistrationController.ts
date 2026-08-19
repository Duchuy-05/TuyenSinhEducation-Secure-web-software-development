import { Request, Response } from 'express';
import { RegistrationService } from '../services/RegistrationService';
import { successHandler, errorHandler } from '../utils/responseHandler';

export class RegistrationController {
    static async getAllRegistrations(request: Request, response: Response) {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;
        const status = request.query.status as string | undefined;

        try {
            const registrations = await RegistrationService.getAllRegistrations(page, limit, status);
            return response.json(successHandler(200, 'Lấy danh sách đăng ký thành công', registrations));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy danh sách đăng ký'));
        }
    }

    static async getRegistrationById(request: Request, response: Response) {
        const registrationId = Number(request.params.id);
        try {
            const registration = await RegistrationService.getRegistrationById(registrationId);
            if (!registration) {
                return response.json(errorHandler(404, 'Đăng ký không tồn tại'));
            }
            return response.json(successHandler(200, 'Lấy thông tin đăng ký thành công', registration));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi lấy thông tin đăng ký'));
        }
    }

    static async createRegistration(request: Request, response: Response) {
        try {
            const newRegistration = await RegistrationService.createRegistration(request.body);
            return response.json(successHandler(201, 'Tạo đăng ký thành công', newRegistration));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi tạo đăng ký'));
        }
    }

    static async updateRegistration(request: Request, response: Response) {
        const registrationId = Number(request.params.id);
        try {
            const updatedRegistration = await RegistrationService.updateRegistration(registrationId, request.body);
            return response.json(successHandler(200, 'Cập nhật đăng ký thành công', updatedRegistration));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi cập nhật đăng ký'));
        }
    }

    static async updateRegistrationStatus(request: Request, response: Response) {
        const registrationId = Number(request.params.id);
        const { status } = request.body;

        const validStatuses = ['pending', 'contacted', 'confirmed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return response.json(errorHandler(400, 'Trạng thái không hợp lệ'));
        }

        try {
            const registration = await RegistrationService.getRegistrationById(registrationId);
            if (!registration) {
                return response.json(errorHandler(404, 'Đăng ký không tồn tại'));
            }

            const updated = await RegistrationService.updateRegistrationStatus(registrationId, status);
            return response.json(successHandler(200, 'Cập nhật trạng thái thành công', updated));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi cập nhật trạng thái'));
        }
    }
    
    static async deleteRegistration(request: Request, response: Response) {
        const registrationId = Number(request.params.id);
        try {
            const registration = await RegistrationService.getRegistrationById(registrationId);
            if (!registration) {
                return response.json(errorHandler(404, 'Đăng ký không tồn tại'));
            }
            await RegistrationService.deleteRegistration(registrationId);
            return response.json(successHandler(200, 'Xóa đăng ký thành công'));
        } catch (error) {
            return response.json(errorHandler(500, 'Lỗi khi xóa đăng ký'));
        }
    }
}
