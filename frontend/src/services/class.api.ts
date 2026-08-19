import { apiClient } from './apiClient';
import type { Course } from './course.api';
import type { Teacher } from './teacher.api';

interface ApiEnvelope<T> {
    status: number;
    message: string;
    data: T;
}

const unwrapData = <T>(response: { data: ApiEnvelope<T> }): T => {
    if (response.data.status >= 400) {
        throw new Error(response.data.message);
    }
    return response.data.data;
};

export interface StudentUser {
    id: number;
    fullName: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    role: 'student' | 'admin' | 'teacher';
    isVerified?: boolean;
}

export interface ClassItem {
    id: number;
    className: string;
    courseId: number;
    teacherId: number;
    startDate: string;
    endDate?: string | null;
    maxStudents: number;
    status: 'upcoming' | 'ongoing' | 'completed';
    course?: Course;
    teacher?: Teacher;
    enrollments?: Enrollment[];
}

export interface Enrollment {
    id: number;
    classId: number;
    userId: number;
    enrolledAt: string;
    status: string;
    user?: StudentUser;

    class: {
        id: number;
        className: string;
        courseId: number;
        teacherId: number;
        startDate: string;
        endDate: string;
        maxStudents: number;
        status: "upcoming" | "ongoing" | "completed";

        course: {
            id: number;
            title: string;
            shortDesc: string;
            imageUrl: string;
            duration: string;
            format: string;
        };

        teacher: {
            id: number;
            fullName: string;
            avatarUrl: string;
        };
    };
}

export interface ClassSchedule {
    id: number;
    classId: number;
    sessionTitle: string;
    sessionNumber: number;
    startTime: string;
    endTime: string;
    location: string;
    status: "upcoming" | "ongoing" | "completed";
}

export const classApi = {
    getMyClasses : async (_userId?: number): Promise<Enrollment[]> => {
        const response = await apiClient.get('/class-enrollments/myclasses');
        return unwrapData(response);
    },

    getAllClasses: async (): Promise<ClassItem[]> => {
        const response = await apiClient.get('/classes');
        return unwrapData(response);
    },

    getClassEnrollments: async (classId: number): Promise<Enrollment[]> => {
        const response = await apiClient.get('/class-enrollments', {
            params: { classId },
        });
        return unwrapData(response);
    },

    addStudentToClass: async (classId: number, userId: number): Promise<Enrollment> => {
        const response = await apiClient.post('/class-enrollments', { classId, userId });
        return unwrapData(response);
    },

    removeStudentFromClass: async (enrollmentId: number): Promise<null> => {
        const response = await apiClient.delete(`/class-enrollments/${enrollmentId}`);
        return unwrapData(response);
    },

    getClassSchedule: async (classId: number): Promise<ClassSchedule[]> => {
        const response = await apiClient.get(`/schedules?classId=${classId}`);
        return unwrapData(response);
    }

}

export const userApi = {
    getStudents: async (): Promise<StudentUser[]> => {
        const response = await apiClient.get('/users');
        const users = unwrapData<StudentUser[]>(response);
        return users.filter((user) => user.role === 'student');
    },
};
