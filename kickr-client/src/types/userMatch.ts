export interface UserMatch {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    avatarUrl?: string;
  };
  match: {
    homeTeam: string;
    homeTeamId: string;
    homeLogo: string;
    awayTeam: string;
    awayTeamId: string;
    awayLogo: string;
    matchDate: string;
    competition: string;
    competitionId?: string;
    competitionLogo?: string;
    location: string;
    homeScore: number;
    awayScore: number;
    matchUuid: string;
    id: string; // external fixture ID
  };
  note: number;
  comment: string;
  isLiked: boolean;
  likesCount: number;
  watchedAt: string;
  isModerated?: boolean;
}