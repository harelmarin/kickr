import { useState, useRef, useEffect, type FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead, useClearAllNotifications } from '../../hooks/useNotifications';
import { Link } from 'react-router-dom';

export const NotificationBell: FC = () => {
    const { user } = useAuth();
    const { data: notifications } = useNotifications(user?.id);
    const { data: unreadCount } = useUnreadCount(user?.id);
    const markAllAsRead = useMarkAllAsRead();
    const markAsRead = useMarkAsRead();
    const clearAll = useClearAllNotifications();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllAsRead = () => {
        if (user) markAllAsRead.mutate(user.id);
    };

    const handleClearAll = () => {
        if (user) {
            clearAll.mutate(user.id);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-[#667788] hover:text-white transition-colors"
                aria-label="Notifications"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {Number(unreadCount) > 0 ? (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-kickr text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#14181c]">
                        {unreadCount! > 9 ? '9+' : unreadCount}
                    </span>
                ) : null}
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+0.5rem)] right-0 w-[280px] sm:w-80 bg-[#1b2228] border border-white/10 rounded-lg shadow-2xl z-[100] overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-black/10">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Notifications</span>
                        <div className="flex items-center gap-3">
                            {Number(unreadCount) > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-[8px] font-black text-kickr uppercase tracking-widest hover:underline"
                                >
                                    Mark all as read
                                </button>
                            )}
                            {notifications && notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-[8px] font-black text-[#ff4444]/60 hover:text-[#ff4444] uppercase tracking-widest hover:underline"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications && notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <NotificationItem
                                    key={notif.id}
                                    notification={notif}
                                    onRead={() => markAsRead.mutate(notif.id)}
                                    onClose={() => setIsOpen(false)}
                                />
                            ))
                        ) : (
                            <div className="p-10 text-center">
                                <p className="text-[#445566] text-[10px] font-bold uppercase tracking-widest">Everything is caught up</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const NotificationItem = ({ notification, onRead, onClose }: { notification: any, onRead: () => void, onClose: () => void }) => {
    const isFollow = notification.type === 'FOLLOW';
    const isComment = notification.type === 'COMMENT';

    const getTargetUrl = () => {
        if (isFollow) return `/user/${notification.targetId}`;
        if (isComment || notification.type === 'NEW_REVIEW') return `/reviews/${notification.targetId}`;
        return `/matches/${notification.targetId}`;
    };

    const handleClick = () => {
        if (!notification.isRead) onRead();
        onClose();
    };

    return (
        <Link
            to={getTargetUrl()}
            onClick={handleClick}
            className={`flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors relative ${!notification.isRead ? 'bg-kickr/5' : ''}`}
        >
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white ${isFollow ? 'bg-blue-500/20' : isComment ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
                {isFollow ? '👤' : isComment ? '💬' : '⚽'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#99aabb] leading-tight mb-1">
                    <span className="text-white font-bold">{notification.actorName}</span>{' '}
                    {isFollow ? 'started following you' : isComment ? 'commented on your review' : 'reviewed a new match'}
                </p>
                <p className="text-[9px] text-[#445566] font-bold uppercase tracking-widest">
                    {new Date(notification.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                </p>
            </div>
            {!notification.isRead && (
                <div className="w-1.5 h-1.5 rounded-full bg-kickr absolute right-4 top-1/2 -translate-y-1/2"></div>
            )}
        </Link>
    );
};
