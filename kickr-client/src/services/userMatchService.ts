import api from './axios';
import type { UserMatch } from '../types/UserMatch';

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
    watchedAt: um.watchedAt ?? um.watched_at,
    match: um.match ? {
        homeTeam: um.match.home_team ?? um.match.homeTeam,
        homeLogo: um.match.home_logo ?? um.match.homeLogo,
        awayTeam: um.match.away_team ?? um.match.awayTeam,
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
    // Get all user matches for a specific user
    getByUserId: async (userId: string): Promise<UserMatch[]> => {
        const response = await api.get<any[]>(`/user_match/user/${userId}`);
        return response.data.map(mapApiResponseToUserMatch);
    },

    // Get all user matches for a specific match
    getByMatchId: async (matchId: string): Promise<UserMatch[]> => {
        const response = await api.get<any[]>(`/user_match/match/${matchId}`);
        return response.data.map(mapApiResponseToUserMatch);
    },

    // Get a specific user match by ID
    getById: async (id: string): Promise<UserMatch> => {
        const response = await api.get<any>(`/user_match/${id}`);
        // Handle ApiResponse wrapper if present, else use raw data
        const data = response.data.data ? response.data.data : response.data;
        return mapApiResponseToUserMatch(data);
    },

    // Create a new user match rating
    create: async (dto: CreateUserMatchDto): Promise<UserMatch> => {
        const response = await api.post<ApiResponse<any>>('/user_match', dto);
        return mapApiResponseToUserMatch(response.data.data);
    },

    // Get latest reviews globally
    getLatest: async (limit = 10): Promise<UserMatch[]> => {
        const response = await api.get<any[]>(`/user_match/latest?limit=${limit}`);
        return response.data.map(mapApiResponseToUserMatch);
    },

    // Get latest reviews from followed users
    getFollowingReviews: async (userId: string, limit = 20): Promise<UserMatch[]> => {
        const response = await api.get<any[]>(`/user_match/following/${userId}?limit=${limit}`);
        return response.data.map(mapApiResponseToUserMatch);
    },

    update: async (id: string, dto: UpdateUserMatchDto): Promise<UserMatch> => {
        const response = await api.put<ApiResponse<any>>(`/user_match/${id}`, dto);
        return mapApiResponseToUserMatch(response.data.data);
    },

    // Delete a user match rating
    delete: async (id: string): Promise<void> => {
        await api.delete(`/user_match/${id}`);
    },

    // DEV ONLY: Reset all test data
    resetTestData: async (): Promise<any> => {
        const response = await api.delete('/dev/reset-data');
        return response.data;
    }
};
