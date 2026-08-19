import { apiClient } from './apiClient';

export type AnnouncementType = 'general' | 'urgent' | 'homework';

export interface Announcement {
    id: number;
    classId: number;
    teacherId: number;
    title: string;
    content: string;
    type: AnnouncementType;
    isPinned: boolean;
    createdAt: string;
    updatedAt: string;
    teacher?: {
        id: number;
        fullName: string;
        avatarUrl?: string;
    };
    class?: {
        id: number;
        className: string;
        course?: {
            id: number;
            title: string;
            imageUrl?: string;
        };
    };
}

export const announcementApi = {
    getMyAnnouncements: async (_userId?: number): Promise<Announcement[]> => {
        const response = await apiClient.get('/announcements/my');
        return response.data.data;
    },
};
