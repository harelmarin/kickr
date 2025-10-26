import type { MatchApiResponse } from "./MatchApiResponse";
import type { User } from "./User";

export interface UserMatchResponseApi {
  id: string;
  user: User
  match: MatchApiResponse;
  note: number;
  comment: string;
  watchedAt: string;
}
