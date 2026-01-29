import { useState, useMemo, useEffect } from 'react';
import { useUsers } from '../hooks/useUser';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { EmptyState } from '../components/ui/EmptyState';
import { TopTeamsWidget } from '../components/widgets/TopTeamsWidget';
import { TopReviewsWidget } from '../components/widgets/TopReviewsWidget';

export const CommunityPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const { data: pageData, isLoading } = useUsers(currentPage, 12);
    const { user: currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [sortBy] = useState<'recent' | 'logs' | 'network'>('logs');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(0);
    }, [debouncedQuery]);

    const users = pageData?.content || [];

    const filteredUsers = useMemo(() => {
        if (!users) return [];

        return [...users]
            .filter(u => u.name.toLowerCase().includes(debouncedQuery.toLowerCase()))
            .sort((a, b) => {
                if (sortBy === 'recent') {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
                if (sortBy === 'logs') {
                    return (b.matchesCount || 0) - (a.matchesCount || 0);
                }
                if (sortBy === 'network') {
                    return (b.followersCount || 0) - (a.followersCount || 0);
                }
                return 0;
            });
    }, [users, debouncedQuery, sortBy]);

    const statsTotalLogs = pageData?.totalElements ? Math.round((pageData.content.reduce((acc: number, u: any) => acc + (u.matchesCount || 0), 0) / (pageData.content.length || 1)) * pageData.totalElements) : 0;

    return (
        <main className="min-h-screen bg-kickr-bg-primary pt-16 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6 md:mb-16">
                    <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                        <h1 className="cinematic-header text-sm md:text-base">Fans Network</h1>
                    </div>

                    <div className="mt-4 md:mt-12 bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
                        <div className="flex items-end justify-between border-b border-white/[0.03] pb-6 gap-4">
                            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-x-8 flex-1">
                                {/* Search */}
                                <div className="flex flex-col gap-1 w-full md:w-60">
                                    <span className="text-[10px] md:text-[11px] uppercase font-black text-muted tracking-[0.2em] pl-0.5 italic">Find Members</span>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted">🔍</span>
                                        <input
                                            type="text"
                                            placeholder="SCAN..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            aria-label="Search members"
                                            className="w-full bg-kickr-bg-primary/40 border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-[11px] md:text-[12px] font-black text-main placeholder-white/20 focus:border-kickr/40 transition-all outline-none italic uppercase tracking-widest"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-base md:text-xl font-black text-main italic leading-none tracking-tighter tabular-nums">
                                    {isLoading ? '...' : (statsTotalLogs >= 1000 ? `${(statsTotalLogs / 1000).toFixed(1)}k` : statsTotalLogs)}
                                </span>
                                <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-muted font-bold mt-1">Total Reviews</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
                            <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                                <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted italic">All Members</h2>
                                <span className="text-[10px] md:text-[10px] font-black text-muted uppercase tracking-widest italic font-mono">STATUS: LIVE</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                {isLoading ? (
                                    Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-[1.5/1] bg-black/5 animate-pulse rounded-sm" />)
                                ) : (
                                    filteredUsers?.map((user) => (
                                        <UserCard key={user.id} user={user} isMe={user.id === currentUser?.id} />
                                    ))
                                )}
                            </div>

                            {!isLoading && pageData && pageData.totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-between border-t border-white/[0.03] pt-6">
                                    <button
                                        onClick={() => {
                                            setCurrentPage(prev => Math.max(0, prev - 1));
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        disabled={pageData.first}
                                        aria-label="Previous page"
                                        className="group flex items-center gap-2 px-6 py-2.5 bg-black/[0.02] border border-white/5 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-secondary hover:text-kickr hover:border-kickr/40 disabled:opacity-5 transition-all italic active:scale-95"
                                    >
                                        <span className="text-sm group-hover:-translate-x-1 transition-transform leading-none mb-0.5">←</span>
                                        PREV
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] md:text-[11px] font-black text-muted uppercase tracking-widest italic tabular-nums font-mono">
                                            Page <span className="text-main">{currentPage + 1}</span> / {pageData.totalPages}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setCurrentPage(prev => Math.min(pageData.totalPages - 1, prev + 1));
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        disabled={pageData.last}
                                        aria-label="Next page"
                                        className="group flex items-center gap-2 px-6 py-2.5 bg-kickr text-white rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 disabled:opacity-5 transition-all italic shadow-[0_0_20px_rgba(93,139,255,0.2)] active:scale-95"
                                    >
                                        NEXT
                                        <span className="text-sm group-hover:translate-x-1 transition-transform leading-none mb-0.5">→</span>
                                    </button>
                                </div>
                            )}
                        </section>

                        {!isLoading && filteredUsers.length === 0 && (
                            <EmptyState
                                icon="👤"
                                title="No members identified"
                                description="No records match this signature. Try resetting your search parameters."
                                actionLabel="Reset Search"
                                onAction={() => setSearchQuery('')}
                            />
                        )}
                    </div>

                    {/* Sidebar - Adapted for Mobile (Bottom placement) */}
                    <div className="lg:col-span-4 space-y-6 md:space-y-8 mt-12 lg:mt-0">
                        <TopTeamsWidget />
                        <TopReviewsWidget />
                    </div>
                </div>
            </div >
        </main >
    );
};

const UserCard = ({ user, isMe }: { user: any; isMe: boolean }) => {
    return (
        <Link
            to={`/user/${user.id}`}
            className="group relative bg-kickr-bg-primary/40 border border-white/[0.03] rounded-sm overflow-hidden hover:border-kickr/40 hover:bg-black/10 transition-all flex flex-col poster-shadow"
        >
            <div className="p-4 md:p-6 flex flex-col items-center md:items-start text-center md:text-left h-full">
                {isMe && (
                    <div className="absolute top-1 right-1">
                        <span className="bg-kickr text-white text-[9px] md:text-[8px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded-sm shadow-sm italic">
                            YOU
                        </span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-4 md:mb-6 w-full">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-sm bg-black/10 border border-white/5 flex items-center justify-center text-xs md:text-lg font-black text-main group-hover:text-kickr group-hover:border-kickr/20 transition-all overflow-hidden flex-shrink-0">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={`${user.name} avatar`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                            user.name[0].toUpperCase()
                        )}
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                        <h3 className="text-[12px] md:text-sm font-black text-main uppercase italic tracking-tighter group-hover:text-kickr transition-colors truncate">
                            {user.name}
                        </h3>
                        <p className="hidden md:block text-[9px] text-muted font-bold uppercase tracking-widest mt-1 italic">
                            Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center md:justify-around w-full mt-auto pt-4 border-t border-white/[0.03] gap-3 md:gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[11px] md:text-base font-black text-main italic tracking-tighter leading-none tabular-nums">
                            {user.matchesCount || 0}
                        </span>
                        <span className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-widest leading-none mt-1 italic">Reviews</span>
                    </div>
                    <div className="w-px h-6 bg-black/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-[11px] md:text-base font-black text-main italic tracking-tighter leading-none tabular-nums">
                            {user.followersCount || 0}
                        </span>
                        <span className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-widest leading-none mt-1 italic">Network</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
