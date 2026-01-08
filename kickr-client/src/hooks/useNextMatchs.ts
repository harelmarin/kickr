import { useQuery } from '@tanstack/react-query';
import type { Match } from '../types/Match';
import { matchService, type MatchesPageResponse } from '../services/matchService';

export const useNextMatchs = (page = 0, limit = 9) => {
  return useQuery<MatchesPageResponse, Error>({
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

export const useSearchMatches = (params: {
  competitionId?: string;
  finished?: boolean;
  query?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<MatchesPageResponse, Error>({
    queryKey: ['matches', 'search', params],
    queryFn: () => matchService.searchMatches(params),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });
};

export const useTrendingMatches = (limit = 6) => {
  return useQuery<Match[], Error>({
    queryKey: ['matches', 'trending', limit],
    queryFn: () => matchService.getTrendingMatches(limit),
    staleTime: 60 * 1000,
    retry: false, // Éviter les boucles infinies en cas d'erreur
  });
};
