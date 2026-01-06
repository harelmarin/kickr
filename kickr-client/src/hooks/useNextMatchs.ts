import { useQuery } from '@tanstack/react-query';
import type { Match } from '../types/Match';
import { matchService } from '../services/matchService';

export const useNextMatchs = (page = 0, limit = 9) => {
  return useQuery<Match[], Error>({
    queryKey: ['nextMatches', page, limit],
    queryFn: () => matchService.fetchNextMatches(page, limit),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });
};

export const useMatchesByTeam = (teamId: string) => {
  return useQuery<Match[], Error>({
    queryKey: ['matches', 'team', teamId],
    queryFn: () => matchService.getAllMatchesByTeam(teamId),
    staleTime: 60 * 1000,
    enabled: !!teamId,
  });
};
