import api from './axios';
import type { User } from '../types/User';

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

    getFollowing: async (userId: string): Promise<User[]> => {
        const response = await api.get<User[]>(`/follows/following/${userId}`);
        return response.data;
    },

    getFollowers: async (userId: string): Promise<User[]> => {
        const response = await api.get<User[]>(`/follows/followers/${userId}`);
        return response.data;
    },

    isFollowing: async (followerId: string, followedId: string): Promise<boolean> => {
        const response = await api.get<boolean>(`/follows/is-following/${followerId}/${followedId}`);
        return response.data;
    }
};
