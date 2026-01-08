import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';

export const useNotifications = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['notifications', userId],
        queryFn: () => notificationService.getNotifications(userId!),
        enabled: !!userId,
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

export const useUnreadCount = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['unreadCount', userId],
        queryFn: () => notificationService.getUnreadCount(userId!),
        enabled: !!userId,
        refetchInterval: 30000,
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        },
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => notificationService.markAllAsRead(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        },
    });
};

export const useClearAllNotifications = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => notificationService.clearAllNotifications(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        },
    });
};
