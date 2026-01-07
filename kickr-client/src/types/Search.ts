import type { User } from './User';
import type { Team } from './Team';
import type { Competition } from './Competition';

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
