import { PaginatedResponse, Post } from '../types';
import api from './apiClient';

export const PostService = {
    getPosts: async (page: number = 1, limit: number = 10, search?: string, category?: string): Promise<PaginatedResponse<Post>> => {
        let url = `/posts?page=${page}&limit=${limit}`;
        if (category) {
            url += `&category=${encodeURIComponent(category)}`;
        }

        if (search) {
            url = `/posts/search?query=${encodeURIComponent(search)}&page=${page}&limit=${limit}`;
            if (category) {
                url += `&category=${encodeURIComponent(category)}`;
            }
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
    },

    updateComment: async (postId: string, commentId: string, content: string): Promise<Post> => {
        const response = await api.patch(`/posts/${postId}/comments/${commentId}`, { content });
        return response.data;
    },

    deleteComment: async (postId: string, commentId: string): Promise<Post> => {
        const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
        return response.data;
    }
};
