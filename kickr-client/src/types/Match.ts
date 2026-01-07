export interface Match {
  id: string;
  homeTeam: string;
  homeTeamId: string;
  awayTeam: string;
  awayTeamId: string;
  homeLogo: string;
  awayLogo: string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchDate: string;
  competition: string;
  location: string;
  matchUuid?: string;
  averageRating?: number;
  reviewsCount?: number;
}
