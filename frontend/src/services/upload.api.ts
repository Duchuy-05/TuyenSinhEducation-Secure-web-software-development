// upload.api.ts
import { apiClient } from './apiClient';

export const uploadApi = {
    uploadAvatar: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.post('/upload/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data.url;
    },

    uploadCourseImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await apiClient.post('/upload/course-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data.url;
    },
};