import { useState, useMemo, useEffect } from 'react';
import { useUsers } from '../hooks/useUser';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCardSkeleton } from '../components/ui/LoadingSkeletons';
import { EmptyState } from '../components/ui/EmptyState';

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

    // Reset current page when query changes
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

    // Stats calculations
    const statsTotalMinds = pageData?.totalElements || 0;
    const statsTotalLogs = pageData?.totalElements ? Math.round((pageData.content.reduce((acc: number, u: any) => acc + (u.matchesCount || 0), 0) / (pageData.content.length || 1)) * pageData.totalElements) : 0;
    const statsTotalNetwork = pageData?.totalElements ? Math.round((pageData.content.reduce((acc: number, u: any) => acc + (u.followersCount || 0), 0) / (pageData.content.length || 1)) * pageData.totalElements) : 0;

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#0a0b0d] text-[#99aabb]"
        >
            {/* Cinematic Backdrop */}
            <div className="relative h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-[#0a0b0d]/70 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[#14181c] opacity-50">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                </div>
                <div className="absolute inset-x-0 h-full opacity-5 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-kickr/10 to-transparent"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-[400px] relative z-20 pb-20">

                <header className="mb-16">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase display-font">
                            The Global <span className="text-kickr">Tactician</span>
                        </h1>
                        <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold">
                            Analyze. Track. Connect. The elite football network.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-12"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-white/5 p-6 section-contrast rounded-2xl gap-8 relative overflow-hidden">

                            <div className="flex flex-wrap items-center gap-x-10 gap-y-6 relative z-10">
                                <div className="flex flex-col gap-2 w-full sm:w-64">
                                    <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em] pl-1">Identify Tactician</span>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
                                        <input
                                            type="text"
                                            placeholder="Enter name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-black/20 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-bold text-white placeholder-[#445566] focus:border-kickr/40 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em] pl-1">Sort by Rank</span>
                                    <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                                        {(['logs', 'network', 'recent'] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setSortBy(s)}
                                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${sortBy === s ? 'bg-kickr text-white' : 'text-[#445566] hover:text-[#99aabb]'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-10 relative z-10 lg:border-l lg:border-white/5 lg:pl-10">
                                <div className="flex flex-col items-end">
                                    <span className="text-[20px] font-black text-white italic leading-none tracking-tighter">
                                        {isLoading ? '...' : statsTotalMinds}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-widest text-[#445566] font-bold mt-1">Active Minds</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[20px] font-black text-white italic leading-none tracking-tighter">
                                        {isLoading ? '...' : (statsTotalLogs >= 1000 ? `${(statsTotalLogs / 1000).toFixed(1)}k` : statsTotalLogs)}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-widest text-[#445566] font-bold mt-1">Global Logs</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[20px] font-black text-kickr italic leading-none tracking-tighter">
                                        {isLoading ? '...' : (statsTotalNetwork >= 1000 ? `${(statsTotalNetwork / 1000).toFixed(1)}k` : statsTotalNetwork)}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-widest text-[#445566] font-bold mt-1">Network Size</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </header>

                <section className="pb-32">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => <UserCardSkeleton key={i} />)
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {filteredUsers?.map((user, index) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <UserCard user={user} isMe={user.id === currentUser?.id} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
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
                                className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#667788] hover:text-white hover:border-kickr/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(pageData.totalPages)].map((_, i) => {
                                    if (pageData.totalPages > 5) {
                                        if (i < currentPage - 2 && i !== 0) return null;
                                        if (i > currentPage + 2 && i !== pageData.totalPages - 1) return null;
                                        if (i === currentPage - 2 && i !== 0) return <span key={i} className="text-[#334455]">...</span>;
                                        if (i === currentPage + 2 && i !== pageData.totalPages - 1) return <span key={i} className="text-[#334455]">...</span>;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setCurrentPage(i);
                                                window.scrollTo({ top: 300, behavior: 'smooth' });
                                            }}
                                            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all cursor-pointer ${currentPage === i
                                                ? 'bg-kickr text-black'
                                                : 'bg-white/[0.02] border border-white/5 text-[#445566] hover:text-white hover:border-white/10'
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
                                className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#667788] hover:text-white hover:border-kickr/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                </section>
            </div>
        </motion.main>
    );
};

const UserCard = ({ user, isMe }: { user: any; isMe: boolean }) => {
    return (
        <Link
            to={`/user/${user.id}`}
            className="group relative bg-[#14181c]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-kickr/40 hover:bg-[#1b2228]/80 transition-all duration-500 shadow-2xl flex flex-col h-full"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="p-4 sm:p-8 relative z-10 flex flex-col h-full">
                {isMe && (
                    <div className="absolute top-4 right-4 animate-fade-in">
                        <span className="bg-kickr text-black text-[8px] font-black uppercase tracking-tight px-2 py-0.5 rounded-[3px]">
                            You
                        </span>
                    </div>
                )}

                <div className="relative mb-4 sm:mb-8 self-center">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#1b2228] to-[#0a0b0d] border border-white/10 flex items-center justify-center text-2xl sm:text-4xl font-black text-white group-hover:text-kickr group-hover:scale-105 group-hover:border-kickr/30 transition-all duration-500 shadow-2xl relative z-10 overflow-hidden">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                            user.name[0]
                        )}
                        <div className="absolute inset-0 bg-kickr/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>

                <div className="text-center mb-4 sm:mb-8 flex-1">
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-kickr transition-colors duration-300 mb-1">
                        {user.name}
                    </h3>
                    <p className="text-[9px] text-[#445566] font-extrabold uppercase tracking-[0.2em]">
                        Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 sm:pt-6 border-t border-white/5 bg-black/10 -mx-4 sm:-mx-8 px-4 sm:px-8 mt-auto group-hover:bg-kickr/[0.03] transition-colors">
                    <div className="flex flex-col items-center py-2 sm:py-4">
                        <span className="text-base sm:text-lg font-black text-white italic tracking-tighter leading-none mb-1">
                            {user.matchesCount || 0}
                        </span>
                        <span className="text-[8px] font-bold text-[#445566] uppercase tracking-[0.2em] leading-none">Logs</span>
                    </div>
                    <div className="flex flex-col items-center py-2 sm:py-4 border-l border-white/5">
                        <span className="text-base sm:text-lg font-black text-white italic tracking-tighter leading-none mb-1">
                            {user.followersCount || 0}
                        </span>
                        <span className="text-[8px] font-bold text-[#445566] uppercase tracking-[0.2em] leading-none">Network</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 h-1 bg-kickr w-0 group-hover:w-full transition-all duration-500"></div>
        </Link>
    );
};
