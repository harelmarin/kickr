import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userMatchService, type CreateUserMatchDto, type UpdateUserMatchDto } from '../services/userMatchService';
import type { UserMatch } from '../types/UserMatch';

// Hook to get user matches for a specific match
export const useUserMatchesByMatch = (matchId: string) => {
    return useQuery<UserMatch[], Error>({
        queryKey: ['userMatches', 'match', matchId],
        queryFn: () => userMatchService.getByMatchId(matchId),
        enabled: !!matchId,
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Hook to get user matches for a specific user
export const useUserMatchesByUser = (userId: string) => {
    return useQuery<UserMatch[], Error>({
        queryKey: ['userMatches', 'user', userId],
        queryFn: () => userMatchService.getByUserId(userId),
        enabled: !!userId,
        staleTime: 30 * 1000,
    });
};

// Hook to get latest global reviews
export const useLatestReviews = (limit = 10) => {
    return useQuery<UserMatch[], Error>({
        queryKey: ['userMatches', 'latest', limit],
        queryFn: () => userMatchService.getLatest(limit),
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
