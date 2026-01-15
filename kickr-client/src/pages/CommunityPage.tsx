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
        <main className="min-h-screen bg-[#14181c] pt-20 md:pt-32 pb-24 md:pb-20 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6 md:mb-16">
                    <div className="flex items-center gap-3 mb-2 md:mb-4">
                        <div className="h-[1px] w-6 bg-kickr opacity-50" />
                        <span className="text-[8px] md:text-[9px] font-black text-kickr uppercase tracking-[0.4em] italic">Community</span>
                    </div>
                    <h1 className="text-2xl md:text-6xl font-black text-white mb-1 md:mb-2 italic tracking-tighter uppercase display-font leading-none">
                        The Global <span className="text-kickr">Tactician</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.2em] text-[7px] md:text-[11px] font-bold">
                        Analyze. Track. Connect. Global Intelligence Network.
                    </p>

                    <div className="mt-4 md:mt-12">
                        <div className="flex items-end justify-between border-b border-white/5 pb-4 gap-4">
                            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-x-8 flex-1">
                                {/* Search */}
                                <div className="flex flex-col gap-1 w-full md:w-48">
                                    <span className="text-[7px] uppercase font-black text-white/20 tracking-[1.5px] pl-0.5">Identify</span>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] opacity-20 italic">🔍</span>
                                        <input
                                            type="text"
                                            placeholder="SCAN..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-sm pl-7 pr-3 py-1.5 text-[10px] md:text-[11px] font-black text-white placeholder-white/5 focus:border-kickr/40 transition-all outline-none italic uppercase tracking-widest"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-xl font-black text-white italic leading-none tracking-tighter">
                                    {isLoading ? '...' : (statsTotalLogs >= 1000 ? `${(statsTotalLogs / 1000).toFixed(1)}k` : statsTotalLogs)}
                                </span>
                                <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold mt-1">Global Logs</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90 italic mb-8">All Tacticians</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                            {isLoading ? (
                                Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-[1.5/1] bg-white/5 animate-pulse rounded-sm" />)
                            ) : (
                                filteredUsers?.map((user) => (
                                    <UserCard key={user.id} user={user} isMe={user.id === currentUser?.id} />
                                ))
                            )}
                        </div>

                        {!isLoading && pageData && pageData.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2 md:gap-4">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(0, prev - 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.first}
                                    className="px-3 py-2 bg-white/[0.02] border border-white/5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/10 disabled:opacity-10 transition-all cursor-pointer"
                                >
                                    [ Prev ]
                                </button>

                                <div className="flex items-center gap-1.5 md:gap-2">
                                    {[...Array(pageData.totalPages)].map((_, i) => {
                                        if (pageData.totalPages > 5) {
                                            if (i < currentPage - 1 && i !== 0) return null;
                                            if (i > currentPage + 1 && i !== pageData.totalPages - 1) return null;
                                            if (i === currentPage - 1 && i !== 0) return <span key={i} className="text-[8px] text-white/10">..</span>;
                                            if (i === currentPage + 1 && i !== pageData.totalPages - 1) return <span key={i} className="text-[8px] text-white/10">..</span>;
                                        }

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setCurrentPage(i);
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                                className={`w-7 h-7 md:w-10 md:h-10 rounded-sm text-[8px] md:text-[10px] font-black transition-all cursor-pointer ${currentPage === i
                                                    ? 'bg-kickr text-black'
                                                    : 'bg-white/[0.01] border border-white/5 text-white/20 hover:text-white/40'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(pageData.totalPages - 1, prev + 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.last}
                                    className="px-3 py-2 bg-white/[0.02] border border-white/5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/10 disabled:opacity-10 transition-all cursor-pointer"
                                >
                                    [ Next ]
                                </button>
                            </div>
                        )}

                        {!isLoading && filteredUsers.length === 0 && (
                            <EmptyState
                                icon="👤"
                                title="No tacticians identified"
                                description="No records match this signature. Try resetting your surveillance parameters."
                                actionLabel="Reset Surveillance"
                                onAction={() => setSearchQuery('')}
                            />
                        )}
                    </div>

                    {/* Sidebar - Hidden on mobile for PWA feel */}
                    <div className="hidden lg:block lg:col-span-4 space-y-8">
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
            className="group relative bg-white/[0.01] border border-white/5 rounded-sm overflow-hidden hover:border-kickr/30 hover:bg-white/[0.03] transition-all flex flex-col"
        >
            <div className="p-2 md:p-4 flex flex-col items-center md:items-start text-center md:text-left h-full">
                {isMe && (
                    <div className="absolute top-1 right-1">
                        <span className="bg-kickr text-black text-[5px] md:text-[7px] font-black uppercase tracking-tight px-1 py-0.5 rounded-sm">
                            YOU
                        </span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 mb-1.5 md:mb-3 w-full">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-sm bg-white/[0.02] border border-white/5 flex items-center justify-center text-xs md:text-lg font-black text-white group-hover:text-kickr group-hover:border-kickr/30 transition-all overflow-hidden flex-shrink-0">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name[0]
                        )}
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                        <h3 className="text-[9px] md:text-sm font-black text-white/80 uppercase italic tracking-tighter group-hover:text-kickr transition-colors truncate">
                            {user.name}
                        </h3>
                        <p className="hidden md:block text-[8px] text-white/20 font-bold uppercase tracking-wide mt-0.5">
                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center md:justify-around w-full mt-auto pt-1.5 border-t border-white/5 gap-3 md:gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs md:text-base font-black text-white/90 italic tracking-tighter leading-none">
                            {user.matchesCount || 0}
                        </span>
                        <span className="text-[5px] md:text-[7px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1">LOGS</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs md:text-base font-black text-white/90 italic tracking-tighter leading-none">
                            {user.followersCount || 0}
                        </span>
                        <span className="text-[5px] md:text-[7px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1">NET</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
