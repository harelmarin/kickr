import { useQuery } from '@tanstack/react-query';
import { competitionService } from '../services/competitionservice';
import type { Competition } from '../types/competition';

export const useCompetitions = () => {
  return useQuery<Competition[], Error>({
    queryKey: ['competitions'],
    queryFn: () => competitionService.getAll(),
    staleTime: 60 * 1000, 
  });
};

export const useCompetition = (id: string) => {
  return useQuery<Competition, Error>({
    queryKey: ['competition', id],
    queryFn: () => competitionService.getById(id),
    staleTime: 60 * 1000,
  });
};
