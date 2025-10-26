import { useQuery } from '@tanstack/react-query';
import type { Match } from '../types/Match';
import { fetchNextMatches } from '../services/matchService';

export const useNextMatchs = (page = 0, limit = 9) => {
  return useQuery<Match[], Error>({
    queryKey: ['nextMatches', page, limit],
    queryFn: () => fetchNextMatches(page, limit),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });
};
