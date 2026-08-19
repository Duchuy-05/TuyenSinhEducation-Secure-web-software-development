import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:3000/api';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const refreshClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as any;
        const requestUrl = originalRequest?.url || '';
        const isAuthRequest =
            requestUrl.includes('/auth/login') ||
            requestUrl.includes('/auth/google') ||
            requestUrl.includes('/auth/refresh') ||
            requestUrl.includes('/auth/logout');

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !isAuthRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                await refreshClient.get('/auth/refresh');
                return apiClient(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
