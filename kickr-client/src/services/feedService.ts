import axios from 'axios';
import { UserMatch } from '@/types/UserMatch';

export const fetchPreviewFeed = async (
  userId: string,
  page = 0,
  size = 10
): Promise<UserMatch[]> => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/feed/preview/${userId}`,
      {
        params: { page, size },
      }
    );

    const content = response.data?.content;

    if (!content || !Array.isArray(content)) {
      console.error('API ne renvoie pas de content valide', response.data);
      return [];
    }

    return content.map((m: any) => ({
      id: m.id,
      user: m.user,
      match: {
        homeTeam: m.match.home_team,
        homeLogo: m.match.home_logo,
        awayTeam: m.match.away_team,
        awayLogo: m.match.away_logo,
        matchDate: m.match.match_date,
        competition: m.match.competition,
        location: m.match.location,
        homeScore: m.match.home_score,
        awayScore: m.match.away_score,
      },
      note: m.note,
      comment: m.comment,
      watchedAt: m.watchedAt,
    }));
  } catch (err) {
    console.error('Erreur fetchUserMatches', err);
    return [];
  }
};
