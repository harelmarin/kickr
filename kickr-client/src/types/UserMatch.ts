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
  };
  note: number;
  comment: string;
  watchedAt: string;
}