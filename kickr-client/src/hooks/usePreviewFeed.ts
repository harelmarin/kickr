import { useQuery } from '@tanstack/react-query';
import type { UserMatchResponseApi } from '../types/UserMatchResponseApi';
import { fetchPreviewFeed } from '../services/feedService';

export const usePreviewFeed = (userId: string, page = 0, limit = 9) => {
  return useQuery<UserMatchResponseApi[], Error>({
    queryKey: ['usePreviewFeed', userId, page, limit],
    queryFn: () => fetchPreviewFeed(userId, page, limit),
    staleTime: 60 * 1000, 
  });
};
