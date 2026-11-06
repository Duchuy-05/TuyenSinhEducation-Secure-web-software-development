"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const node_1 = require("@payos/node");
const DataSource_1 = require("../models/DataSource");
const Course_1 = require("../models/entities/Course");
const Payment_1 = require("../models/entities/Payment");
const Registration_1 = require("../models/entities/Registration");
const User_1 = require("../models/entities/User");
const env_1 = require("../config/env");
class PaymentService {
    static userRepository = DataSource_1.AppDataSource.getRepository(User_1.User);
    static courseRepository = DataSource_1.AppDataSource.getRepository(Course_1.Course);
    static orderRepository = DataSource_1.AppDataSource.getRepository(Payment_1.Order);
    static registrationRepository = DataSource_1.AppDataSource.getRepository(Registration_1.Registration);
    static get frontendUrl() {
        return process.env.FRONTEND_URL || 'http://localhost:5173';
    }
    static get payos() {
        const missingKeys = (0, env_1.getMissingEnvKeys)(['PAYOS_CLIENT_ID', 'PAYOS_API_KEY', 'PAYOS_CHECKSUM_KEY']);
        if (missingKeys.length > 0) {
            throw new Error(this.buildMissingPayOSConfigMessage(missingKeys));
        }
        const clientId = (0, env_1.getRequiredEnvValue)('PAYOS_CLIENT_ID');
        const apiKey = (0, env_1.getRequiredEnvValue)('PAYOS_API_KEY');
        const checksumKey = (0, env_1.getRequiredEnvValue)('PAYOS_CHECKSUM_KEY');
        return new node_1.PayOS({ clientId, apiKey, checksumKey });
    }
    static buildMissingPayOSConfigMessage(missingKeys) {
        const keyStatuses = ['PAYOS_CLIENT_ID', 'PAYOS_API_KEY', 'PAYOS_CHECKSUM_KEY']
            .map((key) => {
            const value = process.env[key];
            if (value === undefined) {
                return `${key}=undefined`;
            }
            if (value.trim() === '') {
                return `${key}=empty`;
            }
            return `${key}=set`;
        })
            .join(', ');
        return `Server chưa cấu hình ${missingKeys.join(' / ')}. Chi tiết: ${keyStatuses}. Hãy kiểm tra file backend/.env và khởi động lại backend.`;
    }
    static toPayOSErrorMessage(error) {
        const status = error?.response?.status;
        const apiDescription = error?.response?.data?.desc || error?.response?.data?.message;
        if (status === 401 || status === 403) {
            return 'PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY không hợp lệ hoặc không khớp môi trường PayOS';
        }
        if (typeof apiDescription === 'string' && apiDescription.trim() !== '') {
            return `PayOS lỗi: ${apiDescription}`;
        }
        return error?.message || 'Không thể tạo thanh toán PayOS';
    }
    static async generateUniqueOrderCode() {
        while (true) {
            const orderCode = `${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            const exists = await this.orderRepository.findOneBy({ orderCode });
            if (!exists) {
                return orderCode;
            }
        }
    }
    static getCourseAmount(course) {
        const rawAmount = Number(course.discountPrice ?? course.price ?? 0);
        if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
            throw new Error('Khóa học chưa có giá hợp lệ để thanh toán');
        }
        return Math.round(rawAmount);
    }
    static getCoursePaymentDescription(courseId) {
        return `THANH TOAN KHOA HOC ${courseId}`.slice(0, 25);
    }
    static async createCoursePaymentLink(userId, courseId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('Không tìm thấy người dùng');
        }
        const course = await this.courseRepository.findOneBy({
            id: courseId,
            status: Course_1.CourseStatus.PUBLISHED,
        });
        if (!course) {
            throw new Error('Khóa học không tồn tại hoặc chưa được xuất bản');
        }
        const existingPaid = await this.orderRepository.findOne({
            where: { userId, courseId, status: Payment_1.OrderStatus.PAID },
        });
        if (existingPaid) {
            throw new Error('Bạn đã thanh toán khóa học này');
        }
        const now = new Date();
        const existingPending = await this.orderRepository.findOne({
            where: { userId, courseId, status: Payment_1.OrderStatus.PENDING },
            order: { createdAt: 'DESC' },
        });
        if (existingPending &&
            existingPending.checkoutUrl &&
            existingPending.qrCodeUrl &&
            existingPending.paymentLinkExpiresAt &&
            existingPending.paymentLinkExpiresAt > now) {
            return existingPending;
        }
        const amount = this.getCourseAmount(course);
        const orderCode = await this.generateUniqueOrderCode();
        let payosResponse;
        try {
            payosResponse = await this.payos.paymentRequests.create({
                orderCode: Number(orderCode),
                amount,
                description: this.getCoursePaymentDescription(course.id),
                returnUrl: `${this.frontendUrl}/khoa-hoc/${course.id}?payment=success`,
                cancelUrl: `${this.frontendUrl}/khoa-hoc/${course.id}?payment=cancel`,
            });
        }
        catch (error) {
            throw new Error(this.toPayOSErrorMessage(error));
        }
        const newOrder = new Payment_1.Order();
        newOrder.orderCode = orderCode;
        newOrder.userId = userId;
        newOrder.courseId = courseId;
        newOrder.amount = amount;
        newOrder.status = Payment_1.OrderStatus.PENDING;
        newOrder.checkoutUrl = payosResponse.checkoutUrl || '';
        newOrder.qrCodeUrl = payosResponse.qrCode || '';
        if (payosResponse.expiredAt) {
            newOrder.paymentLinkExpiresAt = new Date(payosResponse.expiredAt * 1000);
        }
        return this.orderRepository.save(newOrder);
    }
    static async getOrderByCode(orderCode, userId, role) {
        const order = await this.orderRepository.findOne({
            where: { orderCode },
            relations: { course: true, user: true },
        });
        if (!order) {
            throw new Error('Không tìm thấy đơn hàng');
        }
        if (role !== 'admin' && order.userId !== userId) {
            throw new Error('Bạn không có quyền xem đơn hàng này');
        }
        return order;
    }
    static async confirmPaymentAutomatically(orderCode, payosTransactionId, paymentNote) {
        const order = await this.orderRepository.findOne({
            where: { orderCode },
            relations: { user: true, course: true },
        });
        if (!order) {
            throw new Error('Không tìm thấy đơn hàng để xác nhận');
        }
        if (order.status === Payment_1.OrderStatus.PAID) {
            return order;
        }
        order.status = Payment_1.OrderStatus.PAID;
        order.paymentMethod = Payment_1.PaymentMethod.PAYOS_AUTO;
        order.payosTransactionId = payosTransactionId || order.payosTransactionId;
        order.paymentNote = paymentNote || order.paymentNote;
        await this.orderRepository.save(order);
        const existingRegistration = await this.registrationRepository.findOne({
            where: {
                userId: order.userId,
                courseId: order.courseId,
            },
        });
        if (!existingRegistration) {
            const registration = this.registrationRepository.create({
                userId: order.userId,
                courseId: order.courseId,
                contactName: order.user.fullName,
                contactEmail: order.user.email,
                contactPhone: order.user.phone || '',
                note: `Đăng ký tự động sau khi thanh toán PayOS. Mã đơn: ${order.orderCode}`,
                status: Registration_1.RegistrationStatus.CONFIRMED,
                handledBy: 'system_payos',
                contactedAt: new Date(),
            });
            await this.registrationRepository.save(registration);
        }
        else if (existingRegistration.status !== Registration_1.RegistrationStatus.CONFIRMED) {
            existingRegistration.status = Registration_1.RegistrationStatus.CONFIRMED;
            existingRegistration.contactedAt = new Date();
            existingRegistration.handledBy = 'system_payos';
            await this.registrationRepository.save(existingRegistration);
        }
        return order;
    }
    static async markOrderFailed(orderCode, paymentNote) {
        const order = await this.orderRepository.findOne({
            where: { orderCode },
        });
        if (!order || order.status === Payment_1.OrderStatus.PAID) {
            return order;
        }
        order.status = Payment_1.OrderStatus.FAILED;
        order.paymentNote = paymentNote || order.paymentNote;
        return this.orderRepository.save(order);
    }
    static async handlePayOSWebhook(payload) {
        let webhookData;
        try {
            webhookData = await this.payos.webhooks.verify(payload);
        }
        catch (error) {
            throw new Error(this.toPayOSErrorMessage(error));
        }
        const orderCode = String(webhookData.orderCode);
        const paymentStatusCode = webhookData.code;
        const note = webhookData.desc || null;
        const transactionId = webhookData.reference || webhookData.paymentLinkId;
        if (paymentStatusCode === '00') {
            await this.confirmPaymentAutomatically(orderCode, transactionId, note || undefined);
        }
        else {
            await this.markOrderFailed(orderCode, note || undefined);
        }
        return webhookData;
    }
}
exports.PaymentService = PaymentService;
