import { useState, useEffect } from 'react';
import { searchService } from '../services/searchservice';
import type { SearchResult } from '../types/search';

export const useSearch = (query: string, debounceMs: number = 300) => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const timeoutId = setTimeout(async () => {
            try {
                const searchResults = await searchService.search(query);
                setResults(searchResults);
            } catch (err) {
                setError('Failed to search');
                console.error('Search error:', err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, debounceMs);

        return () => clearTimeout(timeoutId);
    }, [query, debounceMs]);

    return { results, isLoading, error };
};
