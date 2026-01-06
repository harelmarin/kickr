import axiosInstance from './axios';
import type { Match } from '../types/Match';
import type { MatchApiResponse } from '../types/MatchApiResponse';

export const matchService = {
  fetchNextMatches: async (page = 0, limit = 9): Promise<Match[]> => {
    const response = await axiosInstance.get('/matchs/next', {
      params: { page, limit },
    });

    const content = response.data?.content;

    if (!content || !Array.isArray(content)) {
      console.error('API ne renvoie pas de content valide', response.data);
      return [];
    }

    return content.map((m: MatchApiResponse) => ({
      id: m.id ?? `${m.home_team}-${m.away_team}-${m.match_date}`,
      homeTeam: m.home_team,
      awayTeam: m.away_team,
      homeLogo: m.home_logo,
      awayLogo: m.away_logo,
      matchDate: m.match_date,
      competition: m.competition,
      location: m.location,
      homeScore: m.home_score,
      awayScore: m.away_score,
    }));
  },

  getAllMatchesByTeam: async (teamId: string): Promise<Match[]> => {
    try {
      const response = await axiosInstance.get(`/matchs/team/${teamId}`);
      if (!Array.isArray(response.data)) {
        console.error('Réponse inattendue du backend :', response.data);
        return [];
      }
      return response.data.map((m: MatchApiResponse) => ({
        id: m.id ?? `${m.home_team}-${m.away_team}-${m.match_date}`,
        homeTeam: m.home_team,
        awayTeam: m.away_team,
        homeLogo: m.home_logo,
        awayLogo: m.away_logo,
        matchDate: m.match_date,
        competition: m.competition,
        location: m.location,
        homeScore: m.home_score,
        awayScore: m.away_score,
      }));
    } catch (err) {
      console.error(`Erreur lors de la récupération des matchs de l'équipe ${teamId} :`, err);
      return [];
    }
  },
};
