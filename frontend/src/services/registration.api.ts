import { apiClient } from './apiClient';

export interface RegistrationForm {
    courseId: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    note: string;
}

export interface Registration {
    id: number;
    userId: number;
    courseId: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    note: string;
    status: string;
    handledBy: number | null;
    registeredAt: string;
    contactedAt: string | null;
    course: {
        id: number;
        title: string;
        price: string;
        imageUrl: string;
    };
    user?: {
        id: number;
        fullName: string;
        email: string;
    };
}

export const registrationApi = {
    getAllRegistrations: async (page = 1, limit = 10, status = 'all') => {
        const response = await apiClient.get('/registrations', {
            params: { page, limit, ...(status !== 'all' && { status }) }
        });
        return response.data.data;
    },

    registerForCourse: async (userData: RegistrationForm): Promise<void> => {
        await apiClient.post('/registrations', userData);
    },

    updateRegistrationStatus: async (id: number, status: string): Promise<void> => {
        await apiClient.patch(`/registrations/${id}/status`, { status });
    }
};
