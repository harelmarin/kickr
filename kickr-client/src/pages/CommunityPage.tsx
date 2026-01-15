import { useState, useMemo, useEffect } from 'react';
import { useUsers } from '../hooks/useUser';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserCardSkeleton } from '../components/ui/LoadingSkeletons';
import { EmptyState } from '../components/ui/EmptyState';
import { TopTeamsWidget } from '../components/widgets/TopTeamsWidget';
import { TopReviewsWidget } from '../components/widgets/TopReviewsWidget';

export const CommunityPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const { data: pageData, isLoading } = useUsers(currentPage, 12);
    const { user: currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'logs' | 'network'>('logs');

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

    const statsTotalMinds = pageData?.totalElements || 0;
    const statsTotalLogs = pageData?.totalElements ? Math.round((pageData.content.reduce((acc: number, u: any) => acc + (u.matchesCount || 0), 0) / (pageData.content.length || 1)) * pageData.totalElements) : 0;
    const statsTotalNetwork = pageData?.totalElements ? Math.round((pageData.content.reduce((acc: number, u: any) => acc + (u.followersCount || 0), 0) / (pageData.content.length || 1)) * pageData.totalElements) : 0;

    return (
        <main className="min-h-screen bg-[#14181c] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[2px] w-6 bg-kickr" />
                        <span className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Community</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase">
                        The Global <span className="text-kickr">Tactician</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.25em] text-[11px] font-bold">
                        Analyze. Track. Connect. The elite football network.
                    </p>

                    <div className="mt-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-white/5 p-6 bg-white/[0.02] rounded-sm gap-8">
                            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
                                <div className="flex flex-col gap-2 w-full sm:w-64">
                                    <span className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] pl-1">Identify Tactician</span>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
                                        <input
                                            type="text"
                                            placeholder="Enter name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-[#0a0b0d]/20 border border-white/5 rounded-sm pl-9 pr-4 py-2.5 text-base sm:text-[11px] font-bold text-white placeholder-white/20 focus:border-kickr/40 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] pl-1">Sort by Rank</span>
                                    <div className="flex bg-[#0a0b0d]/20 p-1 rounded-sm border border-white/5">
                                        {(['logs', 'network', 'recent'] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSortBy(s)}
                                                className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${sortBy === s ? 'bg-kickr text-black' : 'text-white/40 hover:text-white/60'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-10 lg:border-l lg:border-white/5 lg:pl-10">
                                <div className="flex flex-col items-end">
                                    <span className="text-[20px] font-black text-white italic leading-none tracking-tighter">
                                        {isLoading ? '...' : statsTotalMinds}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1">Active Minds</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[20px] font-black text-white italic leading-none tracking-tighter">
                                        {isLoading ? '...' : (statsTotalLogs >= 1000 ? `${(statsTotalLogs / 1000).toFixed(1)}k` : statsTotalLogs)}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1">Global Logs</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[20px] font-black text-kickr italic leading-none tracking-tighter">
                                        {isLoading ? '...' : (statsTotalNetwork >= 1000 ? `${(statsTotalNetwork / 1000).toFixed(1)}k` : statsTotalNetwork)}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1">Network Size</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90 italic mb-8">All Tacticians</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                Array.from({ length: 8 }).map((_, i) => <UserCardSkeleton key={i} />)
                            ) : (
                                filteredUsers?.map((user) => (
                                    <UserCard key={user.id} user={user} isMe={user.id === currentUser?.id} />
                                ))
                            )}
                        </div>

                        {!isLoading && pageData && pageData.totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(0, prev - 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.first}
                                    className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-sm text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-2">
                                    {[...Array(pageData.totalPages)].map((_, i) => {
                                        if (pageData.totalPages > 5) {
                                            if (i < currentPage - 2 && i !== 0) return null;
                                            if (i > currentPage + 2 && i !== pageData.totalPages - 1) return null;
                                            if (i === currentPage - 2 && i !== 0) return <span key={i} className="text-white/20">...</span>;
                                            if (i === currentPage + 2 && i !== pageData.totalPages - 1) return <span key={i} className="text-white/20">...</span>;
                                        }

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setCurrentPage(i);
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                                className={`w-10 h-10 rounded-sm text-[10px] font-black transition-all cursor-pointer ${currentPage === i
                                                    ? 'bg-kickr text-black'
                                                    : 'bg-white/[0.02] border border-white/5 text-white/40 hover:text-white hover:border-white/10'
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
                                    className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-sm text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    Next
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

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <TopTeamsWidget />
                        <TopReviewsWidget />
                    </div>
                </div>
            </div>
        </main>
    );
};

const UserCard = ({ user, isMe }: { user: any; isMe: boolean }) => {
    return (
        <Link
            to={`/user/${user.id}`}
            className="group relative bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden hover:border-white/10 transition-all flex flex-col"
        >
            <div className="p-4 flex flex-col">
                {isMe && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-kickr text-black text-[7px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded-sm">
                            You
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-sm bg-white/[0.02] border border-white/10 flex items-center justify-center text-lg font-black text-white group-hover:text-kickr group-hover:border-kickr/30 transition-all overflow-hidden flex-shrink-0">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name[0]
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-white uppercase italic tracking-tighter group-hover:text-kickr transition-colors truncate">
                            {user.name}
                        </h3>
                        <p className="text-[8px] text-white/40 font-bold uppercase tracking-wide">
                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-around pt-3 border-t border-white/5 gap-2">
                    <div className="flex flex-col items-center">
                        <span className="text-base font-black text-white italic tracking-tighter leading-none">
                            {user.matchesCount || 0}
                        </span>
                        <span className="text-[7px] font-bold text-white/40 uppercase tracking-wider leading-none mt-0.5">Logs</span>
                    </div>
                    <div className="w-px h-6 bg-white/5"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-base font-black text-white italic tracking-tighter leading-none">
                            {user.followersCount || 0}
                        </span>
                        <span className="text-[7px] font-bold text-white/40 uppercase tracking-wider leading-none mt-0.5">Network</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
