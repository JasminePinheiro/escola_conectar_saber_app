import { PaginatedResponse, Post } from '../types';
import api from './apiClient';

export const PostService = {
    getPosts: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Post>> => {
        let url = `/posts?page=${page}&limit=${limit}`;
        if (search) {
            url = `/posts/search?query=${search}&page=${page}&limit=${limit}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    getAllPostsForTeacher: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> => {
        const response = await api.get(`/posts/all?page=${page}&limit=${limit}`);
        return response.data;
    },

    getPost: async (id: string): Promise<Post> => {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    },

    createPost: async (data: Partial<Post>): Promise<Post> => {
        const response = await api.post('/posts', data);
        return response.data;
    },

    updatePost: async (id: string, data: Partial<Post>): Promise<Post> => {
        const response = await api.patch(`/posts/${id}`, data);
        return response.data;
    },

    deletePost: async (id: string): Promise<void> => {
        await api.delete(`/posts/${id}`);
    },

    addComment: async (postId: string, content: string): Promise<Post> => {
        const response = await api.post(`/posts/${postId}/comments`, { content });
        return response.data;
    }
};
