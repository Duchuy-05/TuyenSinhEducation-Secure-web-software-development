import { apiClient } from './apiClient';

export interface CoursePaymentOrder {
    id: number;
    orderCode: string;
    amount: number;
    status: string;
    checkoutUrl: string | null;
    qrCode: string | null;
    paymentLinkExpiresAt: string | null;
}

export const paymentApi = {
    createCoursePaymentLink: async (courseId: number): Promise<CoursePaymentOrder> => {
        const response = await apiClient.post(`/payments/courses/${courseId}/create-link`);
        return response.data.data;
    },

    getOrderByCode: async (orderCode: string): Promise<CoursePaymentOrder> => {
        const response = await apiClient.get(`/payments/orders/${orderCode}`);
        return response.data.data;
    },
};
