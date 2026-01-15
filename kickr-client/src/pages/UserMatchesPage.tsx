import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useUserMatchesByUser } from '../hooks/useUserMatch';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { MatchCard } from '../components/matches/MatchCard';

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

        // Filter is exact if 5, otherwise min rating
        const matchesRating = minRating === 5
            ? Math.round(review.note) === 5
            : review.note >= minRating;

        return matchesSearch && matchesStatus && matchesRating;
    }).sort((a: any, b: any) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

    return (
        <main className="min-h-screen bg-[#14181c] py-20 px-6">
            <div className="max-w-7xl mx-auto">

                <header className="mb-20">
                    <div className="flex items-center gap-4 mb-4">
                        {isOwnProfile ? (
                            <Link
                                to="/settings"
                                className="relative group/avatar w-10 h-10 rounded-sm overflow-hidden shadow-lg transition-transform hover:scale-110"
                                title="Change Profile Picture"
                            >
                                <div className="w-full h-full bg-white/5 border border-white/10 flex items-center justify-center text-kickr font-black italic">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover group-hover/avatar:opacity-40 transition-opacity" />
                                    ) : (
                                        user?.name[0].toUpperCase()
                                    )}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-[#0a0b0d]/40">
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest italic">Edit</span>
                                </div>
                            </Link>
                        ) : (
                            <Link to={`/user/${id}`} className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-kickr font-black hover:bg-white/10 transition-all overflow-hidden shadow-lg italic">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name[0].toUpperCase()
                                )}
                            </Link>
                        )}
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase display-font">
                                Tactical <span className="text-kickr">Diary</span>
                            </h1>
                            <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold mt-1">
                                Historical log of {pageData?.totalElements || 0} observations by {user?.name}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-12 flex flex-col items-stretch md:items-center justify-between border-y border-white/5 py-6 gap-6 section-contrast bg-white/[0.01] px-4 md:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-16 w-full">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] uppercase font-black text-kickr/40 tracking-[0.3em]">Target Entity</span>
                                <input
                                    type="text"
                                    placeholder="Filter by match..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent text-[12px] md:text-[11px] font-bold text-white placeholder-white/10 outline-none w-full uppercase italic"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] uppercase font-black text-kickr/40 tracking-[0.3em]">Log Status</span>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="bg-transparent text-[11px] font-bold text-white/60 focus:text-kickr outline-none cursor-pointer border-none p-0 m-0 uppercase italic"
                                >
                                    <option value="all" className="bg-[#14181c]">All Entries</option>
                                    <option value="finished" className="bg-[#14181c]">Completed</option>
                                    <option value="upcoming" className="bg-[#14181c]">Projected</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] uppercase font-black text-kickr/40 tracking-[0.3em]">Min Assessment</span>
                                <select
                                    value={minRating}
                                    onChange={(e) => setMinRating(Number(e.target.value))}
                                    className="bg-transparent text-[11px] font-bold text-white/60 focus:text-kickr outline-none cursor-pointer border-none p-0 m-0 uppercase italic"
                                >
                                    <option value="0" className="bg-[#14181c]">No Threshold</option>
                                    <option value="1" className="bg-[#14181c]">1+ Star</option>
                                    <option value="2" className="bg-[#14181c]">2+ Stars</option>
                                    <option value="3" className="bg-[#14181c]">3+ Stars</option>
                                    <option value="4" className="bg-[#14181c]">4+ Stars</option>
                                    <option value="5" className="bg-[#14181c]">Elite Performance</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-12">
                    {isLoading ? (
                        Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="aspect-[2.5/1] bg-white/5 animate-pulse rounded-sm" />
                        ))
                    ) : (
                        filteredReviews.map((review: any) => (
                            <div key={review.id} className="flex flex-col gap-3 group/item">
                                <MatchCard match={review.match as any} variant="poster" />

                                <div className="px-1 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex text-kickr text-[10px]">
                                            {'★'.repeat(Math.round(review.note))}
                                            <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                                        </div>
                                        {review.isLiked && (
                                            <span className="text-[#ff8000] text-xs">❤</span>
                                        )}
                                    </div>

                                    {review.comment && review.comment.trim() !== "" && (
                                        <Link
                                            to={`/reviews/${review.id}`}
                                            className="block text-[#667788] text-[11px] italic leading-relaxed line-clamp-2 pl-3 border-l border-kickr/20 hover:text-white hover:border-kickr/50 transition-all"
                                        >
                                            "{review.comment}"
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                {!isLoading && pageData && pageData.totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                setCurrentPage(prev => Math.max(0, prev - 1));
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            disabled={pageData.first}
                            className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-sm text-[10px] font-black uppercase tracking-widest text-[#667788] hover:text-white hover:border-kickr/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                                        className={`w-10 h-10 rounded-sm text-[10px] font-black transition-all cursor-pointer ${currentPage === i
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
                            className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-sm text-[10px] font-black uppercase tracking-widest text-[#667788] hover:text-white hover:border-kickr/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                )}

                {
                    !isLoading && filteredReviews.length === 0 && (
                        <div className="py-20 text-center bg-white/5 rounded-sm border border-dashed border-white/10">
                            <p className="text-[#445566] text-xs font-bold uppercase tracking-widest">No matching diary entries found.</p>
                        </div>
                    )
                }

            </div >
        </main >
    );
};

const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center text-center p-12 bg-[#14181c]">
        <div className="max-w-md">
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Scouting Report Error</h2>
            <p className="text-[#667788] text-sm mb-8 leading-relaxed">Failed to load the match diary at this time.</p>
            <button onClick={() => window.location.reload()} className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded-sm hover:bg-kickr/5 transition-all">Try Again</button>
        </div>
    </div>
);
