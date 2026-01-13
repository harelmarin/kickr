import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewLikeService } from '../services/reviewlikeservice';
import toast from 'react-hot-toast';

export const useReviewLikeStatus = (reviewId: string, userId: string | undefined) => {
    return useQuery({
        queryKey: ['reviewLikeStatus', reviewId, userId],
        queryFn: () => reviewLikeService.checkLike(reviewId, userId!),
        enabled: !!reviewId && !!userId,
    });
};

export const useToggleReviewLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, userId }: { reviewId: string; userId: string }) =>
            reviewLikeService.toggleLike(reviewId, userId),
        onMutate: async ({ reviewId, userId }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['reviewLikeStatus', reviewId, userId] });

            // Snapshot the previous value
            const previousStatus = queryClient.getQueryData(['reviewLikeStatus', reviewId, userId]);

            // Optimistically update to the new value
            queryClient.setQueryData(['reviewLikeStatus', reviewId, userId], (old: boolean | undefined) => !old);

            // Return context with the previous value
            return { previousStatus };
        },
        onSuccess: (_, variables) => {
            // Invalidate all related queries to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ['reviewLikeStatus', variables.reviewId] });
            queryClient.invalidateQueries({ queryKey: ['userMatch', variables.reviewId] });
            queryClient.invalidateQueries({ queryKey: ['userMatches'] });
        },
        onError: (error: any, variables, context) => {
            // Rollback on error
            if (context?.previousStatus !== undefined) {
                queryClient.setQueryData(
                    ['reviewLikeStatus', variables.reviewId, variables.userId],
                    context.previousStatus
                );
            }
            toast.error(error.response?.data?.message || 'Failed to update like');
        }
    });
};
