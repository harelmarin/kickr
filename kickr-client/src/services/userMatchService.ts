import api from './axios';
import type { UserMatch } from '../types/UserMatch';

export interface CreateUserMatchDto {
    userId: string;
    matchId: string;
    note: number;
    comment: string;
}

export interface UpdateUserMatchDto {
    note: number;
    comment: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const mapApiResponseToUserMatch = (um: any): UserMatch => ({
    ...um,
    match: um.match ? {
        homeTeam: um.match.home_team,
        homeLogo: um.match.home_logo,
        awayTeam: um.match.away_team,
        awayLogo: um.match.away_logo,
        matchDate: um.match.match_date,
        competition: um.match.competition_name || um.match.competition,
        location: um.match.location,
        homeScore: um.match.home_score,
        awayScore: um.match.away_score,
        matchUuid: um.match.match_uuid,
        id: um.match.id, // external fixture ID
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

    // Update an existing user match rating
    update: async (id: string, dto: UpdateUserMatchDto): Promise<UserMatch> => {
        const response = await api.put<ApiResponse<any>>(`/user_match/${id}`, dto);
        return mapApiResponseToUserMatch(response.data.data);
    },
};
