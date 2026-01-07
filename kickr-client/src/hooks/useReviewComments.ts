import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewCommentService } from '../services/reviewCommentService';
import type { ReviewComment } from '../types/ReviewComment';
import toast from 'react-hot-toast';

export const useReviewComments = (reviewId: string) => {
    return useQuery<ReviewComment[], Error>({
        queryKey: ['reviewComments', reviewId],
        queryFn: () => reviewCommentService.getComments(reviewId),
        enabled: !!reviewId,
    });
};

export const useAddReviewComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, userId, content }: { reviewId: string; userId: string; content: string }) =>
            reviewCommentService.addComment(reviewId, userId, content),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['reviewComments', data.userMatchId] });
            toast.success('Comment added!');
        },
    });
};

export const useDeleteReviewComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reviewCommentService.deleteComment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviewComments'] });
            toast.success('Comment deleted');
        },
    });
};
