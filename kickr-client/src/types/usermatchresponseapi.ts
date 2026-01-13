import type { MatchApiResponse } from './matchapiresponse';
import type { User } from './user';

export interface UserMatchResponseApi {
  id: string;
  user: User
  match: MatchApiResponse;
  note: number;
  comment: string;
  isLiked: boolean;
  likesCount: number;
  watchedAt: string;
}
