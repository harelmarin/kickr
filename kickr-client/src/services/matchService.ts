import axiosInstance from './axios';
import type { Match } from '../types/Match';
import type { MatchApiResponse } from '../types/MatchApiResponse';

export interface MatchesPageResponse {
  content: Match[];
  totalPages: number;
  totalElements: number;
  last: boolean;
}

const mapApiResponseToMatch = (m: MatchApiResponse): Match => ({
  id: m.id ?? `${m.home_team}-${m.away_team}-${m.match_date}`,
  homeTeam: m.home_team,
  homeTeamId: m.home_team_id,
  awayTeam: m.away_team,
  awayTeamId: m.away_team_id,
  homeLogo: m.home_logo,
  awayLogo: m.away_logo,
  matchDate: m.match_date,
  competition: m.competition,
  location: m.location,
  homeScore: m.home_score,
  awayScore: m.away_score,
  // Check multiple possible names for the internal UUID
  matchUuid: m.match_uuid || (m as any).matchUuid || (m as any).uuid,
  competitionId: m.competition_id,
  competitionLogo: m.competition_logo,
  averageRating: m.average_rating,
  reviewsCount: m.reviews_count,
});

export const matchService = {
  fetchNextMatches: async (page = 0, limit = 9): Promise<MatchesPageResponse> => {
    const response = await axiosInstance.get('/matchs/next', {
      params: { page, limit },
    });

    const content = response.data?.content;

    if (!content || !Array.isArray(content)) {
      console.error('API ne renvoie pas de content valide', response.data);
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        last: true,
      };
    }

    return {
      content: content.map(mapApiResponseToMatch),
      totalPages: response.data.totalPages || 0,
      totalElements: response.data.totalElements || 0,
      last: response.data.last || false,
    };
  },

  searchMatches: async (params: {
    competitionId?: string;
    finished?: boolean;
    query?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<MatchesPageResponse> => {
    const response = await axiosInstance.get('/matchs/search', {
      params,
    });

    const content = response.data?.content;

    if (!content || !Array.isArray(content)) {
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        last: true,
      };
    }

    return {
      content: content.map(mapApiResponseToMatch),
      totalPages: response.data.totalPages || 0,
      totalElements: response.data.totalElements || 0,
      last: response.data.last || false,
    };
  },

  getTrendingMatches: async (limit = 6): Promise<Match[]> => {
    try {
      const response = await axiosInstance.get('/matchs/trending', {
        params: { limit: limit * 2 }, // Demander plus pour filtrer
      });
      const content = response.data?.content;
      if (!content || !Array.isArray(content)) {
        return [];
      }
      // Filtrer uniquement les matchs avec au moins une note et limiter
      return content
        .map(mapApiResponseToMatch)
        .filter(match => match.reviewsCount && match.reviewsCount > 0)
        .slice(0, limit);
    } catch (err) {
      console.error('Erreur lors de la récupération des matchs trending:', err);
      return [];
    }
  },

  getAllMatchesByTeam: async (teamId: string): Promise<Match[]> => {
    try {
      const response = await axiosInstance.get(`/matchs/team/${teamId}`);
      if (!Array.isArray(response.data)) {
        return [];
      }
      return response.data.map(mapApiResponseToMatch);
    } catch (err) {
      console.error(`Erreur lors de la récupération des matchs de l'équipe ${teamId} :`, err);
      return [];
    }
  },

  fetchMatchById: async (id: string): Promise<Match | null> => {
    try {
      const response = await axiosInstance.get(`/matchs/${id}`);
      const m = response.data;
      console.log('Raw match data from API:', m);
      if (!m) return null;
      return mapApiResponseToMatch(m);
    } catch (err) {
      console.error(`Erreur lors de la récupération du match ${id} :`, err);
      return null;
    }
  },
};
