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
  match_uuid?: string;
  competition_id?: string;
  competition_name?: string;
  competition_logo?: string;
  average_rating?: number;
  reviews_count?: number;
}

