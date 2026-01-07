import api from './axios';

export const reviewLikeService = {
    toggleLike: async (reviewId: string, userId: string): Promise<void> => {
        await api.post(`/review-likes/review/${reviewId}/user/${userId}`);
    },

    checkLike: async (reviewId: string, userId: string): Promise<boolean> => {
        const response = await api.get<boolean>(`/review-likes/review/${reviewId}/user/${userId}/check`);
        return response.data;
    }
};
