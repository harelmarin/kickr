import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followService } from '../services/followservice';
import type { PageResponse, User } from '../types/user';
import toast from 'react-hot-toast';

export const useFollowStatus = (followerId: string | undefined, followedId: string | undefined) => {
    return useQuery({
        queryKey: ['followStatus', followerId, followedId],
        queryFn: () => followService.isFollowing(followerId!, followedId!),
        enabled: !!followerId && !!followedId,
    });
};

export const useFollowing = (userId: string | undefined, page: number = 0, size: number = 20) => {
    return useQuery<PageResponse<User>, Error>({
        queryKey: ['following', userId, page, size],
        queryFn: () => followService.getFollowing(userId!, page, size),
        enabled: !!userId,
    });
};

export const useFollowers = (userId: string | undefined, page: number = 0, size: number = 20) => {
    return useQuery<PageResponse<User>, Error>({
        queryKey: ['followers', userId, page, size],
        queryFn: () => followService.getFollowers(userId!, page, size),
        enabled: !!userId,
    });
};

export const useFollowAction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ followerId, followedId, action }: { followerId: string, followedId: string, action: 'follow' | 'unfollow' }) => {
            return action === 'follow'
                ? followService.follow(followerId, followedId)
                : followService.unfollow(followerId, followedId);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['followStatus', variables.followerId, variables.followedId] });
            queryClient.invalidateQueries({ queryKey: ['followers', variables.followedId] });
            queryClient.invalidateQueries({ queryKey: ['following', variables.followerId] });
            queryClient.invalidateQueries({ queryKey: ['user', variables.followedId] });

            toast.success(variables.action === 'follow' ? 'Followed successfully' : 'Unfollowed successfully');
        },
        onError: () => {
            toast.error('Failed to update follow status');
        }
    });
};
