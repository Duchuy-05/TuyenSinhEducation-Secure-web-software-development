import { apiClient } from './apiClient';

export interface Teacher {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    specialization: string;
    bio: string;
    experience: string;
    title: string;
    company: string;
    // socialLinks: {
    //     facebook?: string;
    //     twitter?: string;
    //     linkedin?: string;
    //     github?: string;
    // };
    avatarUrl?: string;
}

export const teacherApi = {
    getAllTeachers: async (): Promise<Teacher[]> => {
        const response = await apiClient.get('/teachers');
        return response.data.data;
    },

    getTeachersPaginated: async (page = 1, limit = 10, search = '') => {
        const response = await apiClient.get('/teachers/pagination', {
            params: { page, limit, search }
        });
        return response.data.data;
    },

    getTeacherById: async (id: string | number): Promise<Teacher> => {
        const response = await apiClient.get(`/teachers/${id}`);
        return response.data.data;
    },

    createTeacher: async (data: Partial<Teacher>) => {
        return apiClient.post('/teachers', data);
    },

    updateTeacher: async (id: number, data: Partial<Teacher>) => {
        return apiClient.put(`/teachers/${id}`, data);
    },

    deleteTeacher: async (id: number) => {
        return apiClient.delete(`/teachers/${id}`);
    }
};
