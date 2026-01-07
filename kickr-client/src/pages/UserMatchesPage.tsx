import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserMatchesByUser } from '../hooks/useUserMatch';
import { useUser } from '../hooks/useUser';
import { MatchPoster } from '../components/Matchs/MatchPoster';

export const UserMatchesPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: user } = useUser(id);
    const { data: reviews, isLoading, isError } = useUserMatchesByUser(id || '');

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'all' | 'finished' | 'upcoming'>('all');
    const [minRating, setMinRating] = useState<number>(0);

    if (isError) return <ErrorState />;

    const filteredReviews = (reviews || []).filter(review => {
        // Search filter
        const matchesSearch = search === '' ||
            review.match.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
            review.match.awayTeam.toLowerCase().includes(search.toLowerCase());

        // Status filter
        const isPast = review.match.homeScore !== null;
        const matchesStatus = status === 'all' ||
            (status === 'finished' && isPast) ||
            (status === 'upcoming' && !isPast);

        // Rating filter
        const matchesRating = review.note >= minRating;

        return matchesSearch && matchesStatus && matchesRating;
    }).sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

    return (
        <main className="min-h-screen bg-[#0a0b0d] py-20 px-6">
            <div className="max-w-7xl mx-auto">

                <header className="mb-20">
                    <div className="flex items-center gap-4 mb-4">
                        <Link to={`/user/${id}`} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-kickr font-black hover:bg-white/10 transition-all">
                            {user?.name[0].toUpperCase()}
                        </Link>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase display-font">
                                {user?.name}'s Diary
                            </h1>
                            <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold mt-1">
                                {filteredReviews.length} Matches Logged by {user?.name}
                            </p>
                        </div>
                    </div>

                    {/* Cinematic Filter Bar */}
                    <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between border-y border-white/5 py-4 gap-8">
                        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">

                            {/* Search Filter */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em]">Team</span>
                                <input
                                    type="text"
                                    placeholder="Search teams..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent text-[11px] font-bold text-white placeholder-[#445566] outline-none w-32"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em]">Status</span>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="bg-transparent text-[11px] font-bold text-[#8899aa] focus:text-white outline-none cursor-pointer border-none p-0 m-0"
                                >
                                    <option value="all" className="bg-[#14181c]">All Matches</option>
                                    <option value="finished" className="bg-[#14181c]">Finished</option>
                                    <option value="upcoming" className="bg-[#14181c]">Upcoming</option>
                                </select>
                            </div>

                            {/* Rating Filter */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em]">Min Rating</span>
                                <select
                                    value={minRating}
                                    onChange={(e) => setMinRating(Number(e.target.value))}
                                    className="bg-transparent text-[11px] font-bold text-[#8899aa] focus:text-white outline-none cursor-pointer border-none p-0 m-0"
                                >
                                    <option value="0" className="bg-[#14181c]">Any Rating</option>
                                    <option value="1" className="bg-[#14181c]">1+ Star</option>
                                    <option value="2" className="bg-[#14181c]">2+ Stars</option>
                                    <option value="3" className="bg-[#14181c]">3+ Stars</option>
                                    <option value="4" className="bg-[#14181c]">4+ Stars</option>
                                    <option value="5" className="bg-[#14181c]">5 Stars Only</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
                    {isLoading ? (
                        Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded" />
                        ))
                    ) : (
                        filteredReviews.map((review) => (
                            <MatchPoster key={review.id} match={review.match as any} />
                        ))
                    )}
                </div>

                {!isLoading && filteredReviews.length === 0 && (
                    <div className="py-20 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <p className="text-[#445566] text-xs font-bold uppercase tracking-widest">No matching diary entries found.</p>
                    </div>
                )}

            </div>
        </main>
    );
};

const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center text-center p-12 bg-[#0a0b0d]">
        <div className="max-w-md">
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Scouting Report Error</h2>
            <p className="text-[#667788] text-sm mb-8 leading-relaxed">Impossible de charger le journal des matchs pour le moment.</p>
            <button onClick={() => window.location.reload()} className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded hover:bg-kickr/5 transition-all">Réessayer</button>
        </div>
    </div>
);
