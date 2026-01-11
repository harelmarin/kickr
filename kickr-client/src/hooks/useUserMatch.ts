import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userMatchService, type CreateUserMatchDto, type UpdateUserMatchDto } from '../services/userMatchService';
import type { UserMatch } from '../types/UserMatch';
import type { PageResponse } from '../types/Common';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

// Hook to get user matches for a specific match
export const useUserMatchesByMatch = (matchId: string, sortBy = 'watchedAt', direction = 'desc') => {
    return useQuery<UserMatch[], Error>({
        queryKey: ['userMatches', 'match', matchId, sortBy, direction],
        queryFn: () => userMatchService.getByMatchId(matchId, sortBy, direction),
        enabled: !!matchId,
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Hook to get a single user match by ID
export const useUserMatch = (id: string) => {
    return useQuery<UserMatch, Error>({
        queryKey: ['userMatch', id],
        queryFn: () => userMatchService.getById(id),
        enabled: !!id,
    });
};

// Hook to get user matches for a specific user
export const useUserMatchesByUser = (userId?: string, page: number = 0, size: number = 20) => {
    return useQuery<PageResponse<UserMatch>, Error>({
        queryKey: ['userMatches', 'user', userId, page, size],
        queryFn: () => userId ? userMatchService.getByUserId(userId, page, size) : Promise.reject('No user ID'),
        enabled: !!userId,
        staleTime: 30 * 1000,
    });
};

// Hook to get matches for current logged in user
export const useMyUserMatches = () => {
    const { user } = useAuth();
    return useUserMatchesByUser(user?.id);
};

// Hook to get latest global reviews
export const useLatestReviews = (limit = 10) => {
    return useQuery<UserMatch[], Error>({
        queryKey: ['userMatches', 'latest', limit],
        queryFn: () => userMatchService.getLatest(limit),
        staleTime: 30 * 1000,
        retry: false,
    });
};

// Hook to get popular reviews (sorted by likes)
export const usePopularReviews = (limit = 10) => {
    return useQuery<UserMatch[], Error>({
        queryKey: ['userMatches', 'popular', limit],
        queryFn: () => userMatchService.getPopular(limit),
        staleTime: 30 * 1000,
        retry: false,
    });
};

// Hook to get reviews from followed users
export const useFollowingReviews = (userId?: string, page: number = 0, size: number = 20) => {
    return useQuery<PageResponse<UserMatch>, Error>({
        queryKey: ['userMatches', 'following', userId, page, size],
        queryFn: () => userId ? userMatchService.getFollowingReviews(userId, page, size) : Promise.reject('No user ID'),
        enabled: !!userId,
        staleTime: 30 * 1000,
    });
};

// Hook to create a new user match rating
export const useCreateUserMatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateUserMatchDto) => userMatchService.create(dto),
        onSuccess: (data) => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['userMatches', 'match', data.match.matchUuid] });
            queryClient.invalidateQueries({ queryKey: ['userMatches', 'user', data.user.id] });
            queryClient.invalidateQueries({ queryKey: ['user', data.user.id] });
            queryClient.invalidateQueries({ queryKey: ['matches'] }); // Refresh match stats
        },
    });
};

// Hook to update an existing user match rating
export const useUpdateUserMatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateUserMatchDto }) =>
            userMatchService.update(id, dto),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['userMatches'] });
            queryClient.invalidateQueries({ queryKey: ['matches'] }); // Refresh match stats
        },
    });
};

// Hook to delete a user match rating
export const useDeleteUserMatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userMatchService.delete(id),
        onSuccess: () => {
            // Invalidate and refetch everything related
            queryClient.invalidateQueries({ queryKey: ['userMatches'] });
            queryClient.invalidateQueries({ queryKey: ['matches'] });
            toast.success('Entry removed successfully');
        },
    });
};
