import { useQuery } from '@tanstack/react-query';
import { teamService } from '../services/teamService';
import type { Team } from '../types/Team';

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

export const useTeamsByCompetition = (competitionId: string) => {
  return useQuery<Team[], Error>({
    queryKey: ['teams', 'competition', competitionId],
    queryFn: () => teamService.getByCompetitionId(competitionId),
    staleTime: 60 * 1000,
    enabled: !!competitionId,
  });
};
