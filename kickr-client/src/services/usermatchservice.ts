import api from './axios';
import type { UserMatch } from '../types/usermatch';
import type { PageResponse } from '../types/common';

export interface CreateUserMatchDto {
    userId: string;
    matchId: string;
    note: number;
    comment: string;
    isLiked?: boolean;
}

export interface UpdateUserMatchDto {
    note: number;
    comment: string;
    isLiked?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const mapApiResponseToUserMatch = (um: any): UserMatch => ({
    id: um.id,
    user: um.user,
    note: um.note,
    comment: um.comment,
    isLiked: um.liked ?? um.isLiked ?? um.is_liked ?? false, // Handle 'liked', 'isLiked', and 'is_liked'
    likesCount: um.likesCount ?? um.likes_count ?? 0,
    watchedAt: um.watchedAt ?? um.watched_at,
    match: um.match ? {
        homeTeam: um.match.home_team ?? um.match.homeTeam,
        homeTeamId: um.match.home_team_id ?? um.match.homeTeamId,
        homeLogo: um.match.home_logo ?? um.match.homeLogo,
        awayTeam: um.match.away_team ?? um.match.awayTeam,
        awayTeamId: um.match.away_team_id ?? um.match.awayTeamId,
        awayLogo: um.match.away_logo ?? um.match.awayLogo,
        matchDate: um.match.match_date ?? um.match.matchDate,
        competition: um.match.competition_name || um.match.competition,
        location: um.match.location,
        homeScore: um.match.home_score ?? um.match.homeScore,
        awayScore: um.match.away_score ?? um.match.awayScore,
        matchUuid: um.match.match_uuid ?? um.match.matchUuid,
        id: um.match.id,
    } : um.match
});

export const userMatchService = {
    getByUserId: async (userId: string, page: number = 0, size: number = 20): Promise<PageResponse<UserMatch>> => {
        const response = await api.get<PageResponse<any>>(`/user_match/user/${userId}`, {
            params: { page, size }
        });
        return {
            ...response.data,
            content: response.data.content.map(mapApiResponseToUserMatch)
        };
    },

    getByMatchId: async (matchId: string, sortBy = 'watchedAt', direction = 'desc'): Promise<UserMatch[]> => {
        const response = await api.get<any[]>(`/user_match/match/${matchId}?sortBy=${sortBy}&direction=${direction}`);
        return response.data.map(mapApiResponseToUserMatch);
    },

    getById: async (id: string): Promise<UserMatch> => {
        const response = await api.get<any>(`/user_match/${id}`);
        const data = response.data.data ? response.data.data : response.data;
        return mapApiResponseToUserMatch(data);
    },

    create: async (dto: CreateUserMatchDto): Promise<UserMatch> => {
        const response = await api.post<ApiResponse<any>>('/user_match', dto);
        return mapApiResponseToUserMatch(response.data.data);
    },

    getLatest: async (limit = 10): Promise<UserMatch[]> => {
        const response = await api.get<any[]>(`/user_match/latest?limit=${limit}`);
        return response.data.map(mapApiResponseToUserMatch);
    },

    getFollowingReviews: async (userId: string, page: number = 0, size: number = 20): Promise<PageResponse<UserMatch>> => {
        const response = await api.get<PageResponse<any>>(`/user_match/following/${userId}`, {
            params: { page, size }
        });
        return {
            ...response.data,
            content: response.data.content.map(mapApiResponseToUserMatch)
        };
    },

    getPopular: async (limit = 10): Promise<UserMatch[]> => {
        const response = await api.get<any[]>(`/user_match/latest?limit=${limit}`);
        const reviews = response.data.map(mapApiResponseToUserMatch);
        return reviews.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    },

    update: async (id: string, dto: UpdateUserMatchDto): Promise<UserMatch> => {
        const response = await api.put<ApiResponse<any>>(`/user_match/${id}`, dto);
        return mapApiResponseToUserMatch(response.data.data);
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/user_match/${id}`);
    },

    resetTestData: async (): Promise<any> => {
        const response = await api.delete('/dev/reset-data');
        return response.data;
    }
};
