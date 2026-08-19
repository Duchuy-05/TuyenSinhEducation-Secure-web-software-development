import { apiClient } from './apiClient';

export const authApi = {
    logout: async () => {
        return apiClient.post('/auth/logout');
    },
};
