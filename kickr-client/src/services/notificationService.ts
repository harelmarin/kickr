import api from './axios';

export type NotificationType = 'FOLLOW' | 'NEW_REVIEW';

export interface Notification {
    id: string;
    recipientId: string;
    actorId: string;
    actorName: string;
    type: NotificationType;
    message: string;
    targetId: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationService = {
    getNotifications: async (userId: string): Promise<Notification[]> => {
        const response = await api.get<Notification[]>(`/notifications/user/${userId}`);
        return response.data;
    },

    getUnreadCount: async (userId: string): Promise<number> => {
        const response = await api.get<number>(`/notifications/unread-count/${userId}`);
        return response.data;
    },

    markAsRead: async (id: string): Promise<void> => {
        await api.post(`/notifications/${id}/read`);
    },

    markAllAsRead: async (userId: string): Promise<void> => {
        await api.post(`/notifications/user/${userId}/read-all`);
    }
};
