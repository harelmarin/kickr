import axiosInstance from './axios';
import type { User } from '../types/User';
import type { ApiResponse } from '../types/Auth';

class AdminService {
    /**
     * Get all users (admin only)
     */
    async getAllUsers(): Promise<User[]> {
        try {
            console.log('[AdminService] Fetching all users...');
            const response = await axiosInstance.get<User[]>('/admin/users');
            console.log('[AdminService] Users fetched successfully:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('[AdminService] Error fetching users:', error);
            console.error('[AdminService] Error response:', error.response?.data);
            console.error('[AdminService] Error status:', error.response?.status);
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
