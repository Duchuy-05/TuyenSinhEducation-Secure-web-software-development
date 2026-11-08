"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const PaymentService_1 = require("../services/PaymentService");
const responseHandler_1 = require("../utils/responseHandler");
class PaymentController {
    static async createCoursePaymentLink(request, response) {
        const userId = Number(request.user?.id);
        const courseId = Number(request.params.courseId);
        if (!Number.isInteger(userId) || userId <= 0) {
            return response.status(401).json((0, responseHandler_1.errorHandler)(401, 'Vui lòng đăng nhập để thanh toán'));
        }
        if (!Number.isInteger(courseId) || courseId <= 0) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Mã khóa học không hợp lệ'));
        }
        try {
            const order = await PaymentService_1.PaymentService.createCoursePaymentLink(userId, courseId);
            return response.status(201).json((0, responseHandler_1.successHandler)(201, 'Tạo mã QR thanh toán thành công', {
                id: order.id,
                orderCode: order.orderCode,
                amount: order.amount,
                status: order.status,
                checkoutUrl: order.checkoutUrl,
                qrCode: order.qrCodeUrl,
                paymentLinkExpiresAt: order.paymentLinkExpiresAt,
            }));
        }
        catch (error) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, (error && typeof error.status === 'number' ? error.message : 'Không thể tạo thanh toán')));
        }
    }
    static async getOrderByCode(request, response) {
        const userId = Number(request.user?.id);
        const role = String(request.user?.role || '');
        const orderCode = String(request.params.orderCode || '');
        if (!orderCode) {
            return response.status(400).json((0, responseHandler_1.errorHandler)(400, 'Thiếu mã đơn hàng'));
        }
        try {
            const order = await PaymentService_1.PaymentService.getOrderByCode(orderCode, userId, role);
            return response.status(200).json((0, responseHandler_1.successHandler)(200, 'Lấy trạng thái đơn hàng thành công', order));
        }
        catch (error) {
            return response.status(404).json((0, responseHandler_1.errorHandler)(404, (error && typeof error.status === 'number' ? error.message : 'Không tìm thấy đơn hàng')));
        }
    }
    static async handlePayOSWebhook(request, response) {
        try {
            await PaymentService_1.PaymentService.handlePayOSWebhook(request.body);
            return response.status(200).json({ error: 0, message: 'ok', data: null });
        }
        catch (error) {
            console.error('Webhook error:', error);
            return response.status(200).json({ error: 0, message: 'received', data: null });
        }
    }
}
exports.PaymentController = PaymentController;
