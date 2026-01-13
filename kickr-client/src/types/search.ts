import type { User } from './user';
import type { Team } from './team';
import type { Competition } from './competition';

export type SearchResultType = 'user' | 'team' | 'competition';

export interface SearchResult {
    id: string;
    name: string;
    type: SearchResultType;
    imageUrl?: string;
    subtitle?: string;
}

export interface SearchResponse {
    users: User[];
    teams: Team[];
    competitions: Competition[];
}
