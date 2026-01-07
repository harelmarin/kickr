import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserMatchesByUser } from '../hooks/useUserMatch';
import { useUser } from '../hooks/useUser';

export const UserDiaryPage = () => {
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

    const groupedReviews = filteredReviews.reduce((acc, review) => {
        const date = new Date(review.watchedAt);
        const monthYear = date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(review);
        return acc;
    }, {} as Record<string, typeof filteredReviews>);

    return (
        <main className="min-h-screen bg-[#0a0b0d] py-20 px-6">
            <div className="max-w-5xl mx-auto">

                <header className="mb-16">
                    <div className="flex items-center gap-6 mb-8">
                        <Link to={`/user/${id}`} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1b2228] to-[#2c3440] border border-white/10 flex items-center justify-center text-2xl font-black text-kickr shadow-2xl">
                            {user?.name[0].toUpperCase()}
                        </Link>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase display-font">
                                {user?.name}'s Diary
                            </h1>
                            <p className="text-[#667788] uppercase tracking-[0.25em] text-[10px] font-bold mt-1">
                                {filteredReviews.length} Matchlogs recorded
                            </p>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-y border-white/5 py-4 gap-8">
                        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] uppercase font-black text-[#445566] tracking-[0.2em]">Filter Team</span>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent text-[11px] font-bold text-white placeholder-[#445566] outline-none w-28"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] uppercase font-black text-[#445566] tracking-[0.2em]">Status</span>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="bg-transparent text-[11px] font-bold text-[#8899aa] focus:text-white outline-none cursor-pointer border-none p-0 m-0"
                                >
                                    <option value="all" className="bg-[#14181c]">All</option>
                                    <option value="finished" className="bg-[#14181c]">Finished</option>
                                    <option value="upcoming" className="bg-[#14181c]">Upcoming</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] uppercase font-black text-[#445566] tracking-[0.2em]">Rating</span>
                                <select
                                    value={minRating}
                                    onChange={(e) => setMinRating(Number(e.target.value))}
                                    className="bg-transparent text-[11px] font-bold text-[#8899aa] focus:text-white outline-none cursor-pointer border-none p-0 m-0"
                                >
                                    <option value="0" className="bg-[#14181c]">Any</option>
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <option key={r} value={r} className="bg-[#14181c]">{r}+ Stars</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="space-y-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="h-6 w-32 bg-white/5 rounded mb-6"></div>
                                <div className="space-y-4">
                                    {[1, 2].map(j => <div key={j} className="h-16 bg-white/5 rounded-xl"></div>)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : Object.keys(groupedReviews).length > 0 ? (
                    <div className="space-y-16">
                        {Object.entries(groupedReviews).map(([monthYear, monthReviews]) => (
                            <section key={monthYear}>
                                <h2 className="text-[10px] font-black text-[#445566] uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-2">
                                    {monthYear}
                                </h2>

                                <div className="divide-y divide-white/5">
                                    {monthReviews.map((review) => (
                                        <div key={review.id} className="py-4 flex gap-6 group hover:bg-white/[0.02] -mx-4 px-4 transition-colors">
                                            {/* Date Column */}
                                            <div className="w-12 flex-shrink-0 flex flex-col items-center justify-center border-r border-white/5">
                                                <span className="text-xl font-black text-white italic leading-none">{new Date(review.watchedAt).getDate()}</span>
                                                <span className="text-[8px] font-bold text-[#445566] uppercase tracking-widest mt-1">
                                                    {new Date(review.watchedAt).toLocaleDateString('en', { weekday: 'short' })}
                                                </span>
                                            </div>

                                            {/* Poster Column */}
                                            <Link to={`/matches/${review.match.id}`} className="w-24 h-14 bg-[#1b2228] rounded-lg border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center gap-2 group-hover:border-kickr/30 transition-all poster-hover-effect">
                                                <img src={review.match.homeLogo} className="w-6 h-6 object-contain" alt="" />
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] font-black text-white italic leading-none">{review.match.homeScore}</span>
                                                    <div className="w-2 h-[1px] bg-kickr/30 my-0.5"></div>
                                                    <span className="text-[10px] font-black text-white italic leading-none">{review.match.awayScore}</span>
                                                </div>
                                                <img src={review.match.awayLogo} className="w-6 h-6 object-contain" alt="" />
                                            </Link>

                                            {/* Title & Info Column */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <Link to={`/matches/${review.match.id}`} className="text-white text-sm font-black uppercase italic tracking-tighter truncate hover:text-kickr transition-colors">
                                                        {review.match.homeTeam} v {review.match.awayTeam}
                                                    </Link>
                                                    <span className="text-[#445566] text-[10px] font-bold italic opacity-60">
                                                        {review.match.competition}
                                                    </span>
                                                </div>
                                                {review.comment && (
                                                    <Link to={`/reviews/${review.id}`} className="block text-[#667788] text-[11px] italic truncate opacity-80 group-hover:opacity-100 transition-opacity">
                                                        "{review.comment}"
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Rating & Action Column */}
                                            <div className="w-32 flex-shrink-0 flex items-center justify-end gap-4">
                                                <div className="flex text-kickr text-[10px]">
                                                    {'★'.repeat(Math.round(review.note))}
                                                    <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                                                </div>
                                                {review.isLiked && (
                                                    <span className="text-[#ff8000] text-sm">❤</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
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
