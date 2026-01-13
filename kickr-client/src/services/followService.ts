import api from './axios';
import type { User, PageResponse } from '../types/user';

export interface FollowResponse {
    followerId: string;
    followedId: string;
    following: boolean;
}

export const followService = {
    follow: async (followerId: string, followedId: string): Promise<FollowResponse> => {
        const response = await api.post<FollowResponse>('/follows/follow', { followerId, followedId });
        return response.data;
    },

    unfollow: async (followerId: string, followedId: string): Promise<FollowResponse> => {
        const response = await api.post<FollowResponse>('/follows/unfollow', { followerId, followedId });
        return response.data;
    },

    getFollowing: async (userId: string, page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
        const response = await api.get<PageResponse<User>>(`/follows/following/${userId}`, {
            params: { page, size }
        });
        return response.data;
    },

    getFollowers: async (userId: string, page: number = 0, size: number = 20): Promise<PageResponse<User>> => {
        const response = await api.get<PageResponse<User>>(`/follows/followers/${userId}`, {
            params: { page, size }
        });
        return response.data;
    },

    isFollowing: async (followerId: string, followedId: string): Promise<boolean> => {
        const response = await api.get<boolean>(`/follows/is-following/${followerId}/${followedId}`);
        return response.data;
    }
};
