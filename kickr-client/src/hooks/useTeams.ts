import { useQuery } from '@tanstack/react-query';
import { teamService } from '../services/teamService';
import type { Team } from '../types/team';

export const useTeams = () => {
  return useQuery<Team[], Error>({
    queryKey: ['teams'],
    queryFn: () => teamService.getAll(),
    staleTime: 60 * 1000,
  });
};

export const useTeam = (id: string) => {
  return useQuery<Team, Error>({
    queryKey: ['team', id],
    queryFn: () => teamService.getById(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
};

export const useTeamsByCompetition = (competitionId: string, page: number = 0, size: number = 50) => {
  return useQuery({
    queryKey: ['teams', 'competition', competitionId, page, size],
    queryFn: () => teamService.getByCompetitionId(competitionId, page, size),
    staleTime: 60 * 1000,
    enabled: !!competitionId,
  });
};

export const useSearchTeams = (search?: string, page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['teams', 'search', search, page, size],
    queryFn: () => teamService.searchTeams(search, page, size),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
};
