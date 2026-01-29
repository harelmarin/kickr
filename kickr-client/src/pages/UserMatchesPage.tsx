import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useUserMatchesByUser } from '../hooks/useUserMatch';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { MatchCard } from '../components/matches/MatchCard';
import { motion, AnimatePresence } from 'framer-motion';

export const UserMatchesPage = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: user } = useUser(id);
    const { user: currentUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(0);
    const { data: pageData, isLoading, isError } = useUserMatchesByUser(id || '', currentPage, 12);

    const reviews = pageData?.content || [];

    const isOwnProfile = currentUser?.id === id;
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [status, setStatus] = useState<'all' | 'finished' | 'upcoming'>((searchParams.get('status') as any) || 'all');
    const [minRating, setMinRating] = useState<number>(Number(searchParams.get('rating')) || 0);

    // Sync URL -> State (for back/forward buttons)
    useEffect(() => {
        const q = searchParams.get('q') || '';
        const s = (searchParams.get('status') as any) || 'all';
        const r = Number(searchParams.get('rating')) || 0;

        if (q !== search) setSearch(q);
        if (s !== status) setStatus(s);
        if (r !== minRating) setMinRating(r);
    }, [searchParams]);

    // Sync state -> URL params
    useEffect(() => {
        const params: any = {};
        if (search) params.q = search;
        if (status !== 'all') params.status = status;
        if (minRating > 0) params.rating = minRating.toString();

        const currentQ = searchParams.get('q') || '';
        const currentStatus = searchParams.get('status') || 'all';
        const currentRating = searchParams.get('rating') || '0';

        if (search !== currentQ || status !== currentStatus || minRating.toString() !== currentRating) {
            setSearchParams(params, { replace: true });
        }
    }, [search, status, minRating, setSearchParams]);

    if (isError) return <ErrorState />;

    const filteredReviews = (reviews || []).filter((review: any) => {
        const matchesSearch = search === '' ||
            review.match.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
            review.match.awayTeam.toLowerCase().includes(search.toLowerCase());

        const isPast = review.match.homeScore !== null;
        const matchesStatus = status === 'all' ||
            (status === 'finished' && isPast) ||
            (status === 'upcoming' && !isPast);

        const matchesRating = minRating === 5
            ? Math.round(review.note) === 5
            : review.note >= minRating;

        return matchesSearch && matchesStatus && matchesRating;
    }).sort((a: any, b: any) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

    return (
        <main className="min-h-screen bg-kickr-bg-primary pt-[calc(4rem+env(safe-area-inset-top))] md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6 md:mb-16">
                    <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-6">
                        <div className="h-[1px] md:h-[2px] w-3 md:w-6 bg-kickr/40" />
                        <span className="text-[7px] md:text-[10px] font-black text-kickr/80 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Match Records</span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        {isOwnProfile ? (
                            <Link
                                to="/settings"
                                className="relative group/avatar w-8 h-8 md:w-12 md:h-12 rounded-sm overflow-hidden shadow-lg transition-transform hover:scale-110 flex-shrink-0"
                                title="Change Profile Picture"
                            >
                                <div className="w-full h-full bg-black/5 border border-white/5 flex items-center justify-center text-kickr font-black italic">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover group-hover/avatar:opacity-40 transition-opacity" />
                                    ) : (
                                        user?.name[0].toUpperCase()
                                    )}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-black/40">
                                    <span className="text-[6px] md:text-[8px] font-black text-main uppercase tracking-widest italic">Edit</span>
                                </div>
                            </Link>
                        ) : (
                            <Link to={`/user/${id}`} className="w-8 h-8 md:w-12 md:h-12 rounded-sm bg-black/5 border border-white/5 flex items-center justify-center text-kickr font-black flex-shrink-0 overflow-hidden shadow-lg italic">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name[0].toUpperCase()
                                )}
                            </Link>
                        )}
                        <div className="min-w-0">
                            <h1 className="text-2xl md:text-6xl font-bold text-main tracking-tight uppercase leading-none mb-1">
                                Match <span className="text-kickr">Diary</span>
                            </h1>
                            <p className="text-secondary uppercase tracking-widest text-[9px] md:text-sm font-bold opacity-60">
                                {pageData?.totalElements || 0} Entries · {user?.name}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-12 bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-x-12 w-full">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <span className="text-[7px] md:text-[9px] uppercase font-black text-muted tracking-[0.4em] pl-1 italic">Scan Diary</span>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] opacity-10 italic">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="..."
                                        value={search}
                                        aria-label="Search match diary"
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-kickr-bg-primary/40 border border-white/10 rounded-sm pl-8 pr-4 py-2.5 text-[9px] md:text-[11px] font-black text-main placeholder-white/20 focus:border-kickr/40 transition-all outline-none italic uppercase tracking-widest"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 w-full md:w-56">
                                <span className="text-[7px] md:text-[9px] uppercase font-black text-muted tracking-[0.4em] pl-1 italic">Status</span>
                                <div className="relative">
                                    <select
                                        value={status}
                                        aria-label="Filter by match status"
                                        onChange={(e) => setStatus(e.target.value as any)}
                                        className="w-full bg-kickr-bg-primary/40 border border-white/10 rounded-sm px-4 py-2.5 text-[9px] md:text-[11px] font-black text-main focus:border-kickr/40 outline-none cursor-pointer appearance-none hover:bg-white/[0.04] transition-all uppercase italic tracking-widest"
                                    >
                                        <option value="all" className="bg-kickr-bg-secondary">All Records</option>
                                        <option value="finished" className="bg-kickr-bg-secondary">Completed</option>
                                        <option value="upcoming" className="bg-kickr-bg-secondary">Upcoming</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[7px] text-main/20 italic">▼</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 w-full md:w-56">
                                <span className="text-[7px] md:text-[9px] uppercase font-black text-muted tracking-[0.4em] pl-1 italic">Rating Filter</span>
                                <div className="relative">
                                    <select
                                        value={minRating}
                                        aria-label="Filter by minimum rating"
                                        onChange={(e) => setMinRating(Number(e.target.value))}
                                        className="w-full bg-kickr-bg-primary/40 border border-white/10 rounded-sm px-4 py-2.5 text-[9px] md:text-[11px] font-black text-main focus:border-kickr/40 outline-none cursor-pointer appearance-none hover:bg-white/[0.04] transition-all uppercase italic tracking-widest"
                                    >
                                        <option value="0" className="bg-kickr-bg-secondary">Any Rating</option>
                                        <option value="5" className="bg-kickr-bg-secondary">5 Stars</option>
                                        <option value="4" className="bg-kickr-bg-secondary">4+ Stars</option>
                                        <option value="3" className="bg-kickr-bg-secondary">3+ Stars</option>
                                        <option value="2" className="bg-kickr-bg-secondary">2+ Stars</option>
                                        <option value="1" className="bg-kickr-bg-secondary">1+ Star</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[7px] text-main/20 italic">▼</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-8 md:gap-y-12">
                    {isLoading ? (
                        Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="aspect-[2.5/1] bg-black/5 animate-pulse rounded-sm" />
                        ))
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredReviews.map((review: any, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                    className="flex flex-col gap-3 group/item active:scale-[0.98] transition-transform"
                                >
                                    <MatchCard match={review.match as any} variant="poster" />

                                    <div className="px-1 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex text-rating text-[10px] tabular-nums" aria-label={`${review.note} stars out of 5`}>
                                                {'★'.repeat(Math.round(review.note))}
                                                <span className="text-main/10">{'★'.repeat(5 - Math.round(review.note))}</span>
                                            </div>
                                            {review.isLiked && (
                                                <span className="text-kickr text-[10px] font-bold uppercase tracking-widest">Favorite</span>
                                            )}
                                        </div>

                                        {review.comment && review.comment.trim() !== "" && (
                                            <Link
                                                to={`/reviews/${review.id}`}
                                                className="block text-secondary text-[9px] md:text-[11px] italic leading-relaxed line-clamp-1 pl-2.5 border-l border-kickr/10 hover:text-main hover:border-kickr/30 transition-all uppercase font-medium"
                                            >
                                                {review.comment}
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Pagination Controls */}
                {!isLoading && pageData && pageData.totalPages > 1 && (
                    <div className="mt-12 md:mt-16 flex items-center justify-center gap-2 md:gap-8 border-t border-white/[0.03] pt-12">
                        <button
                            onClick={() => {
                                setCurrentPage(prev => Math.max(0, prev - 1));
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            disabled={pageData.first}
                            className="group flex items-center gap-2 px-6 py-2.5 bg-kickr-bg-secondary border border-white/5 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-secondary hover:text-kickr hover:border-kickr/40 disabled:opacity-5 transition-all italic active:scale-95"
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
                            className="group flex items-center gap-2 px-6 py-2.5 bg-kickr text-white rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 disabled:opacity-5 transition-all italic shadow-[0_0_20px_rgba(93,139,255,0.2)] active:scale-95"
                        >
                            NEXT
                            <span className="text-sm group-hover:translate-x-1 transition-transform leading-none mb-0.5">→</span>
                        </button>
                    </div>
                )}

                {!isLoading && filteredReviews.length === 0 && (
                    <div className="py-20 text-center bg-black/[0.1] border border-dashed border-white/5 rounded-sm">
                        <p className="text-muted text-[9px] font-black uppercase tracking-widest italic leading-none">No match logs match this signature.</p>
                    </div>
                )}

            </div >
        </main >
    );
};

const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center text-center p-12 bg-kickr-bg-primary">
        <div className="max-w-md">
            <h2 className="text-2xl font-black text-main mb-4 uppercase tracking-tighter italic">Scouting Report Error</h2>
            <p className="text-secondary text-sm mb-8 leading-relaxed">Failed to load the match diary at this time.</p>
            <button onClick={() => window.location.reload()} className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded-sm hover:bg-kickr/5 transition-all">Try Again</button>
        </div>
    </div>
);
