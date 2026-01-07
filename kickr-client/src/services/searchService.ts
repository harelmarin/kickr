import api from './axios';
import type { SearchResponse, SearchResult } from '../types/Search';

export const searchService = {
    search: async (query: string): Promise<SearchResult[]> => {
        if (!query.trim()) {
            return [];
        }

        const response = await api.get<SearchResponse>('/search', {
            params: { q: query }
        });

        const results: SearchResult[] = [];

        // Add users to results
        response.data.users.forEach(user => {
            results.push({
                id: user.id,
                name: user.name,
                type: 'user',
                subtitle: user.email
            });
        });

        // Add teams to results
        response.data.teams.forEach(team => {
            results.push({
                id: team.id,
                name: team.name,
                type: 'team',
                imageUrl: team.logoUrl,
                subtitle: team.country
            });
        });

        // Add competitions to results
        response.data.competitions.forEach(competition => {
            results.push({
                id: competition.id,
                name: competition.name,
                type: 'competition',
                imageUrl: competition.logoUrl,
                subtitle: competition.country
            });
        });

        return results;
    }
};
