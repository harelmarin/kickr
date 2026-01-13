import api from './axios';
import type { ReviewComment } from '../types/reviewComment';

export const reviewCommentService = {
    getComments: async (reviewId: string): Promise<ReviewComment[]> => {
        const response = await api.get<ReviewComment[]>(`/review-comments/review/${reviewId}`);
        return response.data;
    },

    addComment: async (reviewId: string, userId: string, content: string): Promise<ReviewComment> => {
        const response = await api.post<ReviewComment>(`/review-comments/review/${reviewId}/user/${userId}`, { content });
        return response.data;
    },

    deleteComment: async (id: string): Promise<void> => {
        await api.delete(`/review-comments/${id}`);
    }
};
