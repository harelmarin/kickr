import axiosInstance from './axios';
import type { User } from '../types/User';
import type { PageResponse } from '../types/Common';
import type { ApiResponse } from '../types/Auth';

class AdminService {
    /**
     * Get all users (admin only)
     */
    async getAllUsers(page: number = 0, size: number = 20): Promise<PageResponse<User>> {
        try {
            const response = await axiosInstance.get<PageResponse<User>>('/admin/users', {
                params: { page, size }
            });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    /**
     * Promote user to ADMIN
     */
    async promoteUser(userId: string): Promise<ApiResponse<User>> {
        const response = await axiosInstance.put<ApiResponse<User>>(`/admin/users/${userId}/promote`);
        return response.data;
    }

    /**
     * Demote user to USER
     */
    async demoteUser(userId: string): Promise<ApiResponse<User>> {
        const response = await axiosInstance.put<ApiResponse<User>>(`/admin/users/${userId}/demote`);
        return response.data;
    }

    /**
     * Delete user (admin only)
     */
    async deleteUser(userId: string): Promise<ApiResponse<void>> {
        const response = await axiosInstance.delete<ApiResponse<void>>(`/admin/users/${userId}`);
        return response.data;
    }

    /**
     * Moderate a review (admin only)
     */
    async moderateReview(reviewId: string): Promise<ApiResponse<any>> {
        const response = await axiosInstance.put<ApiResponse<any>>(`/admin/reviews/${reviewId}/moderate`);
        return response.data;
    }

    /**
     * Moderate a comment (admin only)
     */
    async moderateComment(commentId: string): Promise<ApiResponse<any>> {
        const response = await axiosInstance.put<ApiResponse<any>>(`/admin/comments/${commentId}/moderate`);
        return response.data;
    }
}

export const adminService = new AdminService();
