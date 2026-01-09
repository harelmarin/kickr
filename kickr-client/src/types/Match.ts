export type Match = {
  id: string;
  homeTeam: string;
  homeTeamId: string;
  awayTeam: string;
  awayTeamId: string;
  homeLogo: string;
  awayLogo: string;
  homeScore?: number | null;
  awayScore?: number | null;
  homeTeamExternalId?: number;
  awayTeamExternalId?: number;
  matchDate: string;
  competition: string;
  competitionId?: string;
  competitionLogo?: string;
  location: string;
  matchUuid?: string;
  averageRating?: number;
  reviewsCount?: number;
  lineups?: any;
  stats?: any;
  events?: any;
  round?: string;
}
