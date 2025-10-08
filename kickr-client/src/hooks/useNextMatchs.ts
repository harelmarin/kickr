'use client';

import { useQuery } from '@tanstack/react-query';
import { Match } from '@/types/Match';
import { fetchNextMatches } from '@/services/matchService';

export const useNextMatchs = () => {
  return useQuery<Match[], Error>({
    queryKey: ['nextMatches'],
    queryFn: () => fetchNextMatches(),
    staleTime: 60 * 1000,
  });
};
