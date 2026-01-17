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
                            <h1 className="text-2xl md:text-6xl font-black text-main italic tracking-tighter uppercase leading-none mb-1">
                                Match <span className="text-kickr/80">Logs</span>
                            </h1>
                            <p className="text-main/10 uppercase tracking-[0.15em] md:tracking-[0.25em] text-[7px] md:text-[11px] font-black italic truncate">
                                {pageData?.totalElements || 0} Entries // {user?.name}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-12 border border-white/5 bg-white/[0.01] p-2.5 md:p-6 rounded-sm">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-x-10 w-full">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] opacity-10 italic">🔍</span>
                                <input
                                    type="text"
                                    placeholder="SCAN DIARY..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-white/[0.01] border border-white/5 rounded-sm pl-8 pr-4 py-1.5 text-[9px] md:text-[11px] font-black text-main placeholder-white/5 focus:border-kickr/20 transition-all outline-none italic uppercase tracking-widest"
                                />
                            </div>

                            <div className="relative w-full md:w-48">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full bg-white/[0.01] border border-white/5 rounded-sm pl-3 pr-8 py-1.5 text-[9px] font-black text-main/20 focus:text-main focus:border-kickr/20 outline-none cursor-pointer appearance-none uppercase tracking-widest hover:bg-black/[0.03] transition-all italic"
                                >
                                    <option value="all" className="bg-kickr-bg-primary">ALL STATUS</option>
                                    <option value="finished" className="bg-kickr-bg-primary">COMPLETED</option>
                                    <option value="upcoming" className="bg-kickr-bg-primary">PROJECTED</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[7px] text-main/10 italic">▼</div>
                            </div>

                            <div className="relative w-full md:w-48">
                                <select
                                    value={minRating}
                                    onChange={(e) => setMinRating(Number(e.target.value))}
                                    className="w-full bg-white/[0.01] border border-white/5 rounded-sm pl-3 pr-8 py-1.5 text-[9px] font-black text-main/20 focus:text-main focus:border-kickr/20 outline-none cursor-pointer appearance-none uppercase tracking-widest hover:bg-black/[0.03] transition-all italic"
                                >
                                    <option value="0" className="bg-kickr-bg-primary">UNFILTERED</option>
                                    <option value="1" className="bg-kickr-bg-primary">1+ STAR</option>
                                    <option value="2" className="bg-kickr-bg-primary">2+ STARS</option>
                                    <option value="3" className="bg-kickr-bg-primary">3+ STARS</option>
                                    <option value="4" className="bg-kickr-bg-primary">4+ STARS</option>
                                    <option value="5" className="bg-kickr-bg-primary">ELITE CLASS</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[7px] text-main/10 italic">▼</div>
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
                                            <div className="flex text-kickr text-[8px] md:text-[10px] tabular-nums">
                                                {'★'.repeat(Math.round(review.note))}
                                                <span className="text-main/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                                            </div>
                                            {review.isLiked && (
                                                <span className="text-[#ff8000] text-[10px] md:text-xs italic">PRIME</span>
                                            )}
                                        </div>

                                        {review.comment && review.comment.trim() !== "" && (
                                            <Link
                                                to={`/reviews/${review.id}`}
                                                className="block text-main/20 text-[9px] md:text-[11px] italic leading-relaxed line-clamp-1 pl-2.5 border-l border-kickr/10 hover:text-main hover:border-kickr/30 transition-all uppercase font-medium"
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
                    <div className="mt-12 md:mt-16 flex items-center justify-center gap-3 md:gap-4">
                        <button
                            onClick={() => {
                                setCurrentPage(prev => Math.max(0, prev - 1));
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            disabled={pageData.first}
                            className="px-4 md:px-6 py-2 md:py-3 bg-white/[0.01] border border-white/5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest text-main/20 hover:text-main hover:border-kickr/40 disabled:opacity-5 transition-all cursor-pointer italic"
                        >
                            Prev
                        </button>

                        <div className="flex items-center gap-1.5 md:gap-2">
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
                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-sm text-[8px] md:text-[10px] font-black transition-all cursor-pointer tabular-nums ${currentPage === i
                                            ? 'bg-kickr text-black'
                                            : 'bg-white/[0.01] border border-white/5 text-main/10 hover:text-main hover:border-white/10'
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
                            className="px-4 md:px-6 py-2 md:py-3 bg-white/[0.01] border border-white/5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest text-main/20 hover:text-main hover:border-kickr/40 disabled:opacity-5 transition-all cursor-pointer italic"
                        >
                            Next
                        </button>
                    </div>
                )}

                {!isLoading && filteredReviews.length === 0 && (
                    <div className="py-20 text-center bg-black/[0.02] border border-white/5 rounded-sm">
                        <p className="text-main/10 text-[9px] font-black uppercase tracking-widest italic">No match logs match this signature.</p>
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
            <p className="text-[#667788] text-sm mb-8 leading-relaxed">Failed to load the match diary at this time.</p>
            <button onClick={() => window.location.reload()} className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded-sm hover:bg-kickr/5 transition-all">Try Again</button>
        </div>
    </div>
);
