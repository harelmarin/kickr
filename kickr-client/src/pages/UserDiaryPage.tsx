import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserMatchesByUser } from '../hooks/useUserMatch';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { EmptyState } from '../components/ui/EmptyState';
import { ReviewPosterCard } from '../components/review/ReviewPosterCard';


export const UserDiaryPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: user } = useUser(id);
    const { user: currentUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(0);
    const { data: pageData, isLoading, isError } = useUserMatchesByUser(id || '', currentPage, 20);

    const reviews = pageData?.content || [];

    const isOwnProfile = currentUser?.id === id;
    const [search, setSearch] = useState('');

    if (isError) return <ErrorState />;

    const filteredReviews = (reviews || []).filter((review: any) => {
        const matchesSearch = search === '' ||
            review.match.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
            review.match.awayTeam.toLowerCase().includes(search.toLowerCase());

        return matchesSearch;
    }).sort((a: any, b: any) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

    const groupedReviews = filteredReviews.reduce((acc: any, review: any) => {
        const date = new Date(review.watchedAt);
        const monthYear = date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(review);
        return acc;
    }, {} as Record<string, typeof filteredReviews>);

    return (
        <main className="min-h-screen bg-kickr-bg-primary text-secondary">
            <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-kickr-bg-primary via-kickr-bg-primary/80 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-kickr-bg-primary opacity-50">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                </div>
                <div className="absolute inset-x-0 top-0 h-full opacity-5 flex items-center justify-center">
                    <div className="w-[800px] h-[800px] border border-white/5 rounded-full"></div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-[180px] md:-mt-[300px] relative z-20 pb-16 md:pb-20">
                <header className="mb-8 md:mb-16">
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                        <Link to={`/user/${id}`} className="text-[11px] md:text-[11px] font-black uppercase tracking-widest text-secondary hover:text-kickr transition-colors flex items-center gap-1.5 group italic">
                            <span className="text-sm md:text-lg group-hover:-translate-x-1 transition-transform mb-0.5">←</span>
                            Profile
                        </Link>
                        <div className="h-3 md:h-4 w-px bg-black/5"></div>
                        <span className="text-[11px] md:text-[11px] font-black uppercase tracking-widest text-muted italic">Match Records</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
                        <div className="flex items-center gap-4 md:gap-8">
                            {isOwnProfile ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative group/avatar"
                                >
                                    <Link
                                        to="/settings"
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-sm bg-gradient-to-br from-[#1b2228] to-kickr-bg-primary border border-white/5 flex items-center justify-center text-2xl md:text-3xl font-black text-kickr shadow-2xl relative overflow-hidden group/link block"
                                        title="Change Profile Picture"
                                    >
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover group-hover/link:opacity-40 transition-opacity" />
                                        ) : (
                                            user?.name[0].toUpperCase()
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/link:opacity-100 transition-opacity bg-kickr-bg-primary/60 backdrop-blur-sm">
                                            <span className="text-[11px] md:text-[11px] font-black text-main uppercase tracking-widest">Edit</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-sm bg-gradient-to-br from-[#1b2228] to-kickr-bg-primary border border-white/5 flex items-center justify-center text-2xl md:text-3xl font-black text-kickr shadow-2xl relative overflow-hidden group"
                                >
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name[0].toUpperCase()
                                    )}
                                    <div className="absolute inset-0 bg-kickr/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </motion.div>
                            )}
                            <div>
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-2xl md:text-5xl font-black text-main italic tracking-tighter uppercase display-font leading-none mb-1"
                                >
                                    {user?.name}<span className="text-kickr/80">'s</span> Match Log
                                </motion.h1>
                                <p className="text-muted uppercase tracking-[0.2em] md:tracking-[0.3em] text-[11px] md:text-[11px] font-black italic">
                                    Personal History & Football Analysis
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 md:gap-10 md:border-l border-white/5 md:pl-10">
                            <div className="flex flex-col items-center md:items-end">
                                <span className="text-base md:text-2xl font-black text-main italic leading-none tracking-tighter tabular-nums">{pageData?.totalElements || 0}</span>
                                <span className="text-[11px] md:text-[10px] uppercase tracking-widest text-muted font-black mt-1">LOGS</span>
                            </div>
                            <div className="flex flex-col items-center md:items-end">
                                <span className="text-base md:text-2xl font-black text-kickr italic leading-none tracking-tighter tabular-nums">
                                    {reviews.filter((r: any) => r.isLiked).length}
                                </span>
                                <span className="text-[11px] md:text-[10px] uppercase tracking-widest text-muted font-black mt-1">SAVES</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center bg-white/[0.01] border border-white/5 p-2 md:p-4 rounded-sm gap-2 md:gap-4">
                        <span className="text-xs md:text-lg opacity-40">🔍</span>
                        <div className="flex flex-col gap-0 flex-1">
                            <span className="text-[11px] md:text-[10px] uppercase font-black text-muted tracking-[0.2em] italic">FIND TEAMS</span>
                            <input
                                type="text"
                                placeholder="..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent text-[11px] md:text-[12px] font-black text-secondary placeholder-white/10 outline-none w-full uppercase italic tracking-widest"
                            />
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="space-y-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="h-6 w-32 bg-black/5 rounded-sm mb-6"></div>
                                <div className="space-y-4">
                                    {[1, 2].map(j => <div key={j} className="h-16 bg-black/5 rounded-sm"></div>)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : Object.keys(groupedReviews).length > 0 ? (
                    <div className="space-y-8 md:space-y-16">
                        {Object.entries(groupedReviews).map(([monthYear, monthReviews]: [string, any]) => (
                            <section key={monthYear} className="bg-white/[0.01] p-4 md:p-6 rounded-sm border border-white/5">
                                <h2 className="text-[11px] md:text-[11px] font-black text-muted uppercase tracking-[0.3em] mb-4 md:mb-6 border-b border-white/5 pb-1.5 italic">
                                    {monthYear}
                                </h2>

                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 md:gap-6">
                                    {monthReviews.map((review: any) => (
                                        <ReviewPosterCard key={review.id} review={review} />
                                    ))}
                                </div>
                            </section>
                        ))}

                        {/* Pagination Controls */}
                        {!isLoading && pageData && pageData.totalPages > 1 && (
                            <div className="mt-8 md:mt-16 flex items-center justify-center gap-2 md:gap-4 pb-12">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(0, prev - 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.first}
                                    className="px-3 md:px-6 py-2 md:py-3 bg-white/[0.01] border border-white/5 rounded-sm text-[11px] md:text-[11px] font-black uppercase tracking-widest text-secondary hover:text-main hover:border-kickr/40 disabled:opacity-5 transition-all cursor-pointer italic"
                                >
                                    Prev
                                </button>

                                <div className="flex items-center gap-1 md:gap-2">
                                    {[...Array(pageData.totalPages)].map((_, i) => {
                                        if (pageData.totalPages > 5) {
                                            if (i < currentPage - 2 && i !== 0) return null;
                                            if (i > currentPage + 2 && i !== pageData.totalPages - 1) return null;
                                            if (i === currentPage - 2 && i !== 0) return <span key={i} className="text-main/5 text-[8px]">...</span>;
                                            if (i === currentPage + 2 && i !== pageData.totalPages - 1) return <span key={i} className="text-main/5 text-[8px]">...</span>;
                                        }

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setCurrentPage(i);
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                                className={`w-7 h-7 md:w-10 md:h-10 rounded-sm text-[11px] md:text-[11px] font-black transition-all cursor-pointer tabular-nums ${currentPage === i
                                                    ? 'bg-kickr text-white'
                                                    : 'bg-white/[0.01] border border-white/5 text-muted hover:text-main hover:border-white/10'
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
                                    className="px-3 md:px-6 py-2 md:py-3 bg-white/[0.01] border border-white/5 rounded-sm text-[11px] md:text-[11px] font-black uppercase tracking-widest text-secondary hover:text-main hover:border-kickr/40 disabled:opacity-5 transition-all cursor-pointer italic"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon="📔"
                        title="Your tactical diary is empty"
                        description="No matchlogs matches your current search filters. Try clear the identification filter."
                        actionLabel="Clear Search"
                        onAction={() => setSearch('')}
                    />
                )}
            </div>
        </main>
    );
};

const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center text-center p-12 bg-kickr-bg-primary">
        <div className="max-w-md">
            <h2 className="text-2xl font-black text-main mb-4 uppercase tracking-tighter italic">Tactical Log Error</h2>
            <p className="text-secondary text-sm mb-8 leading-relaxed">Failed to load the match diary at this time.</p>
            <button onClick={() => window.location.reload()} className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded-sm hover:bg-kickr/5 transition-all">Try Again</button>
        </div>
    </div>
);
