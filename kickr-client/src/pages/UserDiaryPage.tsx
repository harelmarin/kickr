import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserMatchesByUser } from '../hooks/useUserMatch';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { EmptyState } from '../components/ui/EmptyState';

export const UserDiaryPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: user } = useUser(id);
    const { user: currentUser } = useAuth();
    const { data: reviews, isLoading, isError } = useUserMatchesByUser(id || '');

    const isOwnProfile = currentUser?.id === id;
    const [search, setSearch] = useState('');

    if (isError) return <ErrorState />;

    const filteredReviews = (reviews || []).filter(review => {
        const matchesSearch = search === '' ||
            review.match.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
            review.match.awayTeam.toLowerCase().includes(search.toLowerCase());

        return matchesSearch;
    }).sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());

    const groupedReviews = filteredReviews.reduce((acc, review) => {
        const date = new Date(review.watchedAt);
        const monthYear = date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(review);
        return acc;
    }, {} as Record<string, typeof filteredReviews>);

    return (
        <main className="min-h-screen bg-[#0a0b0d] text-[#99aabb]">
            <div className="relative h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-[#0a0b0d]/80 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[#14181c] opacity-50">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                </div>
                <div className="absolute inset-x-0 top-0 h-full opacity-10 flex items-center justify-center">
                    <div className="w-[800px] h-[800px] border border-kickr/20 rounded-full blur-3xl animate-pulse"></div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-[300px] relative z-20 pb-20">
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to={`/user/${id}`} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-kickr transition-colors flex items-center gap-2 group">
                            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                            Back to Profile
                        </Link>
                        <div className="h-4 w-px bg-white/10"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Tactical Diary</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="flex items-center gap-8">
                            {isOwnProfile ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative group/avatar"
                                >
                                    <Link
                                        to="/settings"
                                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1b2228] to-[#0a0b0d] border border-white/10 flex items-center justify-center text-3xl font-black text-kickr shadow-2xl relative overflow-hidden group/link block"
                                        title="Change Profile Picture"
                                    >
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover group-hover/link:opacity-40 transition-opacity" />
                                        ) : (
                                            user?.name[0].toUpperCase()
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/link:opacity-100 transition-opacity bg-black/40">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Edit</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1b2228] to-[#0a0b0d] border border-white/10 flex items-center justify-center text-3xl font-black text-kickr shadow-2xl relative overflow-hidden group"
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
                                    className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase display-font leading-none mb-2"
                                >
                                    {user?.name}<span className="text-kickr">'s</span> Diary
                                </motion.h1>
                                <p className="text-[#667788] uppercase tracking-[0.3em] text-[10px] font-bold">
                                    Strategic History & Match Intel
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-10 border-l border-white/5 pl-10">
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-white italic leading-none tracking-tighter">{filteredReviews.length}</span>
                                <span className="text-[8px] uppercase tracking-widest text-[#445566] font-bold mt-1">Logs Recorded</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-kickr italic leading-none tracking-tighter">
                                    {filteredReviews.filter(r => r.isLiked).length}
                                </span>
                                <span className="text-[8px] uppercase tracking-widest text-[#445566] font-bold mt-1">Prime Matches</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center bg-[#14181c]/60 backdrop-blur-xl border border-white/5 p-5 rounded-2xl gap-4 shadow-xl">
                        <span className="text-lg opacity-40">🔍</span>
                        <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em]">Identification Filter</span>
                            <input
                                type="text"
                                placeholder="Locate tactical records by team name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent text-[11px] font-bold text-white placeholder-[#445566] outline-none w-full"
                            />
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
                            <section key={monthYear} className="bg-[#14181c]/50 p-6 rounded-2xl border border-white/5">
                                <h2 className="text-[10px] font-black text-[#445566] uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-2">
                                    {monthYear}
                                </h2>

                                <div className="space-y-4">
                                    {monthReviews.map((review) => (
                                        <div key={review.id} className="group relative">
                                            <div className="flex gap-6 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-kickr/20 transition-all duration-300 items-center">
                                                <div className="w-12 text-center border-r border-white/10 pr-6 flex-shrink-0">
                                                    <div className="text-xl font-black text-white italic leading-none">{new Date(review.watchedAt).getDate()}</div>
                                                    <div className="text-[8px] font-black uppercase tracking-widest text-[#445566] mt-1">
                                                        {new Date(review.watchedAt).toLocaleDateString('en', { weekday: 'short' })}
                                                    </div>
                                                </div>

                                                <Link to={`/matches/${review.match.id}`} className="w-32 h-16 bg-[#1b2228] rounded-xl border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center gap-3 relative group/poster shadow-xl">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity"></div>
                                                    <img src={review.match.homeLogo} className="w-7 h-7 object-contain drop-shadow-lg z-10" alt="" />
                                                    <div className="flex flex-col items-center z-10">
                                                        <span className="text-xs font-black text-white italic leading-none">{review.match.homeScore}</span>
                                                        <div className="w-4 h-[1px] bg-kickr/40 my-1"></div>
                                                        <span className="text-xs font-black text-white italic leading-none">{review.match.awayScore}</span>
                                                    </div>
                                                    <img src={review.match.awayLogo} className="w-7 h-7 object-contain drop-shadow-lg z-10" alt="" />
                                                </Link>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1.5">
                                                        <Link to={`/matches/${review.match.id}`} className="text-white text-base font-black uppercase italic tracking-tighter hover:text-kickr transition-colors leading-none">
                                                            {review.match.homeTeam} v {review.match.awayTeam}
                                                        </Link>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#445566] px-2 py-0.5 rounded border border-white/5 bg-white/[0.02]">
                                                            {review.match.competition}
                                                        </span>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-[#667788] text-xs italic line-clamp-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            "{review.comment}"
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-6 pr-2">
                                                    {review.isLiked && (
                                                        <div className="w-8 h-8 rounded-full bg-[#ff8000]/10 flex items-center justify-center border border-[#ff8000]/20 animate-fade-in">
                                                            <span className="text-[#ff8000] text-sm">❤</span>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex text-kickr text-[10px] mb-1">
                                                            {'★'.repeat(Math.round(review.note))}
                                                            <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                                                        </div>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-[#445566] italic">Tactical Score</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
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
    <div className="min-h-screen flex items-center justify-center text-center p-12 bg-[#0a0b0d]">
        <div className="max-w-md">
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Tactical Log Error</h2>
            <p className="text-[#667788] text-sm mb-8 leading-relaxed">Failed to load the match diary at this time.</p>
            <button onClick={() => window.location.reload()} className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded hover:bg-kickr/5 transition-all">Try Again</button>
        </div>
    </div>
);
