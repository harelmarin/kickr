export interface UserMatch {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  match: {
    homeTeam: string;
    homeLogo: string;
    awayTeam: string;
    awayLogo: string;
    matchDate: string;
    competition: string;
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