export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchDate: string;
  competition: string;
  location: string;

}
