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
                className="relative p-2 text-secondary hover:text-main transition-all active:scale-90"
                aria-label="Notifications"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {Number(unreadCount) > 0 ? (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-kickr text-black text-[7px] font-black rounded-sm flex items-center justify-center border border-black shadow-lg shadow-kickr/20">
                        {unreadCount! > 9 ? '9+' : unreadCount}
                    </span>
                ) : null}
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+0.75rem)] right-0 w-[280px] sm:w-[320px] bg-kickr-bg-primary border border-white/10 rounded-sm shadow-[0_10px_50px_rgba(0,0,0,0.8)] z-[100] overflow-hidden animate-fade-in">
                    <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-black/[0.02]">
                        <span className="text-[9px] font-black text-main uppercase tracking-[0.3em] italic">Notifications</span>
                        <div className="flex items-center gap-4">
                            {Number(unreadCount) > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-[8px] font-black text-kickr uppercase tracking-widest hover:brightness-110 transition-all italic underline underline-offset-4 decoration-kickr/30"
                                >
                                    Mark all as read
                                </button>
                            )}
                            {notifications && notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-[8px] font-black text-main/20 hover:text-main/40 uppercase tracking-widest transition-all italic"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                        {notifications && notifications.length > 0 ? (
                            <div className="divide-y divide-white/[0.03]">
                                {notifications.map((notif) => (
                                    <NotificationItem
                                        key={notif.id}
                                        notification={notif}
                                        onRead={() => markAsRead.mutate(notif.id)}
                                        onClose={() => setIsOpen(false)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center gap-4">
                                <div className="w-8 h-[1px] bg-black/5 mx-auto"></div>
                                <p className="text-[#445566] text-[9px] font-black uppercase tracking-[0.4em] italic">No notifications</p>
                                <p className="text-[#445566] text-[7px] font-black uppercase tracking-[0.2em] opacity-30">// You're all caught up</p>
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

    const getTypeColor = () => {
        if (isFollow) return 'text-blue-400 bg-blue-400/5 border-blue-400/20';
        if (isComment) return 'text-kickr bg-kickr/5 border-kickr/20';
        return 'text-kickr bg-kickr/5 border-kickr/20';
    };

    return (
        <Link
            to={getTargetUrl()}
            onClick={handleClick}
            className={`flex items-start gap-4 p-5 hover:bg-black/[0.03] transition-all group/item relative ${!notification.isRead ? 'bg-kickr/[0.02]' : ''}`}
        >
            <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center border rounded-sm transition-all group-hover/item:border-black/20 ${getTypeColor()}`}>
                <span className="text-xs filter grayscale opacity-80 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all">
                    {isFollow ? '👤' : isComment ? '💬' : '⚽'}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${!notification.isRead ? 'text-kickr' : 'text-main/20'}`}>
                        {notification.type}
                    </span>
                    <span className="text-[8px] font-black text-main/20 uppercase tracking-widest italic group-hover/item:text-main/40 transition-colors">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}
                    </span>
                </div>

                <p className="text-[11px] text-main/50 leading-[1.4] italic">
                    <span className="text-main font-black not-italic group-hover/item:text-kickr transition-colors tracking-tight uppercase">{notification.actorName}</span>{' '}
                    {isFollow ? 'started following you' : isComment ? 'commented on your review' : 'posted a new match review'}
                </p>

                <div className="mt-2 flex items-center gap-2">
                    <div className={`h-[1px] bg-black/5 transition-all group-hover/item:bg-kickr/20 ${!notification.isRead ? 'w-8' : 'w-4'}`}></div>
                    <span className="text-[7px] font-black text-main/10 uppercase tracking-[0.3em]">View details</span>
                </div>
            </div>

            {!notification.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-kickr shadow-[0_0_10px_rgba(93,139,255,0.5)]"></div>
            )}
        </Link>
    );
};
