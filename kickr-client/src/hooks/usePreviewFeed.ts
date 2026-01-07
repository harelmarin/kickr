import { useQuery } from '@tanstack/react-query';
import type { UserMatchResponseApi } from '../types/UserMatchResponseApi';
import { fetchPreviewFeed } from '../services/feedService';
import type { UserMatch } from '../types/UserMatch';

export const usePreviewFeed = (userId: string, page = 0, limit = 9) => {
  return useQuery<UserMatchResponseApi[], Error>({
    queryKey: ['usePreviewFeed', userId, page, limit],
    queryFn: () => fetchPreviewFeed(userId, page, limit),
    staleTime: 60 * 1000,
  });
};

export const useGlobalFeed = (limit = 20) => {
  return useQuery<UserMatch[], Error>({
    queryKey: ['userMatches', 'latest', limit], // Consistent query key
    queryFn: () => import('../services/userMatchService').then(m => m.userMatchService.getLatest(limit)),
    staleTime: 60 * 1000,
  });
};
