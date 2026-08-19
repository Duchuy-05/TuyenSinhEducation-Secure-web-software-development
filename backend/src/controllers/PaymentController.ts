import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { errorHandler, successHandler } from '../utils/responseHandler';

export class PaymentController {
    static async createCoursePaymentLink(request: Request, response: Response) {
        const userId = Number((request as any).user?.id);
        const courseId = Number(request.params.courseId);

        if (!Number.isInteger(userId) || userId <= 0) {
            return response.status(401).json(errorHandler(401, 'Vui lòng đăng nhập để thanh toán'));
        }
        if (!Number.isInteger(courseId) || courseId <= 0) {
            return response.status(400).json(errorHandler(400, 'Mã khóa học không hợp lệ'));
        }

        try {
            const order = await PaymentService.createCoursePaymentLink(userId, courseId);
            return response.status(201).json(
                successHandler(201, 'Tạo mã QR thanh toán thành công', {
                    id: order.id,
                    orderCode: order.orderCode,
                    amount: order.amount,
                    status: order.status,
                    checkoutUrl: order.checkoutUrl,
                    qrCode: order.qrCodeUrl,
                    paymentLinkExpiresAt: order.paymentLinkExpiresAt,
                }),
            );
        } catch (error: any) {
            return response.status(400).json(errorHandler(400, error.message || 'Không thể tạo thanh toán'));
        }
    }

    static async getOrderByCode(request: Request, response: Response) {
        const userId = Number((request as any).user?.id);
        const role = String((request as any).user?.role || '');
        const orderCode = String(request.params.orderCode || '');

        if (!orderCode) {
            return response.status(400).json(errorHandler(400, 'Thiếu mã đơn hàng'));
        }

        try {
            const order = await PaymentService.getOrderByCode(orderCode, userId, role);
            return response.status(200).json(successHandler(200, 'Lấy trạng thái đơn hàng thành công', order));
        } catch (error: any) {
            return response.status(404).json(errorHandler(404, error.message || 'Không tìm thấy đơn hàng'));
        }
    }

    static async handlePayOSWebhook(request: Request, response: Response) {
        try {
            await PaymentService.handlePayOSWebhook(request.body);
            return response.status(200).json({ error: 0, message: 'ok', data: null });
        } catch (error) {
            console.error('Webhook error:', error);
            return response.status(200).json({ error: 0, message: 'received', data: null });
        }
    }
}