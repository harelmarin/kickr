import api from './axios';
import type { User } from '../types/user';
import type { PageResponse } from '../types/common';

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export const userService = {
    getById: async (id: string): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    getAll: async (page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
        const response = await api.get<PageResponse<User>>('/users', {
            params: { page, size }
        });
        return response.data;
    },

    updateProfile: async (data: { name: string; email: string }): Promise<User> => {
        const response = await api.put<ApiResponse<User>>('/users/me', data);
        return response.data.data;
    },

    uploadAvatar: async (file: File): Promise<User> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<ApiResponse<User>>('/users/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    deleteAvatar: async (): Promise<User> => {
        const response = await api.delete<ApiResponse<User>>('/users/me/avatar');
        return response.data.data;
    }
};
