export interface MatchApiResponse {
  id?: string;
  home_team: string;
  home_team_id: string;
  away_team: string;
  away_team_id: string;
  home_logo: string;
  away_logo: string;
  match_date: string;
  competition: string;
  location: string;
  home_score?: number;
  away_score?: number;
}

