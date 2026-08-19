import { apiClient } from './apiClient';

export interface UpdateProfilePayload {
    fullName?: string;
    avatarUrl?: string;
    phone?: string;
}

export interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string;
    role: string;
}

export const userApi = {
    updateProfile: async (data: UpdateProfilePayload): Promise<UserProfile> => {
        const response = await apiClient.put('/users/me', data);
        return response.data.data;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
        const response = await apiClient.put('/users/me/password', { currentPassword, newPassword });
        return response.data;
    },
};

