import axios from 'axios';
import type { Match } from '../types/Match';
import type { MatchApiResponse } from '../types/MatchApiResponse';

export const fetchNextMatches = async (page = 0, limit = 9): Promise<Match[]> => {
  const response = await axios.get('http://localhost:8080/api/matchs/next', {
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
};
