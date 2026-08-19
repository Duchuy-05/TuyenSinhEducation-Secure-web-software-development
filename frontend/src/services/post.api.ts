import { apiClient } from './apiClient';

export interface Post {
    id: number;
    title: string;
    slug: string;
    thumbnailUrl: string;
    shortDesc: string;
    content: string;
    authorName: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const postApi = {
    getAllPosts: async (): Promise<Post[]> => {
        const response = await apiClient.get('/posts');
        return response.data.data;
    },

    getAllPostsPaginated: async (page = 1, limit = 10) => {
        const response = await apiClient.get('/posts', {
            params: { page, limit }
        });
        return response.data.data;
    },

    getAllPublishedPosts: async (): Promise<Post[]> => {
        const response = await apiClient.get('/posts/published');
        return response.data.data;
    },

    getAllPublishedPostsPaginated: async (page = 1, limit = 10) => {
        const response = await apiClient.get('/posts/published', {
            params: { page, limit }
        });
        return response.data.data;
    },

    getPostById: async (id: number): Promise<Post> => {
        const response = await apiClient.get(`/posts/${id}`);
        return response.data.data;
    },

    getPostBySlug: async (slug: string): Promise<Post> => {
        const response = await apiClient.get(`/posts/${slug}`);
        return response.data.data;
    },

    createPost: async (data: FormData): Promise<Post> => {
        const response = await apiClient.post('/posts', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },

    updatePost: async (id: number, data: FormData): Promise<Post> => {
        const response = await apiClient.put(`/posts/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },

    deletePost: async (id: number): Promise<void> => {
        await apiClient.delete(`/posts/${id}`);
    },
};
