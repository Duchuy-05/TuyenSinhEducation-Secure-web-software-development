import { apiClient } from './apiClient';
import type { Teacher } from './teacher.api';


export interface Syllabus {
    id: number;
    orderIndex: number;
    title: string;
    description: string;
}

export interface SubCategory {
    name: string;
    slug: string;
}

export interface MainCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    subCategories: SubCategory[];
}

export interface Course {
    id: number;
    category: string;
    title: string;
    shortDesc: string;
    target: string;
    imageUrl: string;
    duration: string;
    sessionCount?: number;
    frequency?: string;
    lessonDuration?: string;
    classSize?: string;
    format: string;
    price: number;
    discountPrice?: number | null;
    status: string;
    teacher?: {fullName: string};
    user?: {
        id: number;
        fullName: string;
        avatarUrl?: string;
    };
    syllabus: any[];
    courseData: any;
}

export const courseApi = {
    getAllCourses: async (): Promise<Course[]> => {
        const response = await apiClient.get('/courses');
        return response.data.data;
    },

    getCoursesPaginated: async (page = 1, limit = 10) => {
        const response = await apiClient.get('/courses/pagination', {
            params: { page, limit }
        });
        return response.data.data;
    },

    getCourseById: async (id: string | number): Promise<Course> => {
        const response = await apiClient.get(`/courses/${id}`);
        return response.data.data;
    },

    createCourse: async (data: unknown) => {
        return apiClient.post('/courses', data);
    },

    updateCourse: async (id: number, data: unknown) => {
        return apiClient.put(`/courses/${id}`, data);
    },

    deleteCourse: async (id: number) => {
        return apiClient.delete(`/courses/${id}`);
    },

    updateCourseSyllabus: async (courseId: number, data: { syllabus: unknown[] }) => {
        return apiClient.put(`/courses/${courseId}/syllabus`, data);
    },

    createCourseSyllabus: async (courseId: number, data: { syllabus: unknown[] }) => {
        return apiClient.post(`/courses/${courseId}/syllabi/bulk`, data);
    },
};

// gọi api khóa học của giảng viên
export const instructorCourseApi = {  
    getLecturerCourses: async () => {
        return await apiClient.get('/courses/lecturer');
    },
    createDraft: async (title: string) => {
        return await apiClient.post('/courses/draft', { title });
    },
    getDraft: async (courseGroupId: string) => {
        return await apiClient.get(`/courses/draft/${courseGroupId}`);
    },
    updateDraft: async (courseGroupId: string, data: any) => {
        return await apiClient.put(`/courses/draft/${courseGroupId}`, data);
    },
    publishCourse: async (courseGroupId: string) => {
        return await apiClient.post(`/courses/${courseGroupId}/publish`);
    },
};
