import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFollowingReviews } from '../hooks/useUserMatch';
import { FeedReviewCard } from '../components/review/FeedReviewCard';
import { Link } from 'react-router-dom';
import { TopTeamsWidget } from '../components/widgets/TopTeamsWidget';
import { TopReviewsWidget } from '../components/widgets/TopReviewsWidget';

export const FriendsFeedPage = () => {
    const { user: currentUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 12;

    const { data: pageData, isLoading, isError } = useFollowingReviews(currentUser?.id, currentPage, pageSize);

    const reviews = pageData?.content || [];

    return (
        <main className="min-h-screen bg-[#14181c] pt-16 md:pt-32 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <header className="mb-6 md:mb-16">
                    <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-6">
                        <div className="h-[1px] md:h-[2px] w-3 md:w-6 bg-kickr/40" />
                        <span className="text-[7px] md:text-[10px] font-black text-kickr/80 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Activity Feed</span>
                    </div>
                    <h1 className="text-2xl md:text-6xl font-black text-white mb-1 md:mb-4 italic tracking-tighter uppercase leading-none">
                        Social <span className="text-kickr/80">Feed</span>
                    </h1>
                    <p className="text-white/10 uppercase tracking-[0.15em] md:tracking-[0.25em] text-[7px] md:text-[11px] font-black italic">
                        Real-time match logs from your social network.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-3 md:mb-8 border-b border-white/5 pb-1.5">
                            <h2 className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/10 italic">Match Logs</h2>
                            <div className="flex items-center gap-1 md:gap-2">
                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-kickr animate-pulse opacity-40"></div>
                                <span className="text-[6px] md:text-[9px] font-black text-white/5 uppercase tracking-widest italic leading-none">LIVE</span>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-64 bg-white/5 rounded-sm animate-pulse" />
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="py-20 text-center bg-white/[0.02] border border-white/5 rounded-sm">
                                <h2 className="text-lg font-black text-white uppercase italic mb-2">Transmission Interrupted</h2>
                                <p className="text-white/20 text-xs uppercase tracking-widest mb-6">Failed to retrieve intel from your network.</p>
                                <button onClick={() => window.location.reload()} className="text-kickr text-[10px] font-black uppercase tracking-[0.3em] border border-kickr/20 px-8 py-3 rounded-sm hover:bg-kickr/5 transition-all">Retry Link</button>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="py-24 text-center bg-white/[0.02] border border-white/5 rounded-sm px-6">
                                <div className="text-4xl mb-6 font-black italic">📡</div>
                                <h2 className="text-lg font-black text-white italic uppercase mb-2">No Logs Found</h2>
                                <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold max-w-xs mx-auto leading-relaxed mb-6">
                                    Your friends haven't logged any matches yet. Expand your network to see more activity.
                                </p>
                                <Link to="/community" className="inline-block bg-kickr text-black text-[9px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-sm hover:scale-105 transition-all italic">
                                    Find Friends →
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {reviews.map((review: any) => (
                                    <FeedReviewCard key={review.id} review={review} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!isLoading && pageData && pageData.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-4 md:gap-8 border-t border-white/5 pt-6">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(0, prev - 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.first}
                                    className="group flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/20 disabled:opacity-5 hover:text-white transition-all italic"
                                >
                                    <span className="text-sm md:text-lg group-hover:-translate-x-1 transition-transform mb-0.5">←</span>
                                    PREV
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] md:text-[10px] font-black text-white/10 uppercase tracking-widest italic tabular-nums">
                                        PAGE <span className="text-white/40">{currentPage + 1}</span> / {pageData.totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(pageData.totalPages - 1, prev + 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.last}
                                    className="group flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/20 disabled:opacity-5 hover:text-white transition-all italic"
                                >
                                    NEXT
                                    <span className="text-sm md:text-lg group-hover:translate-x-1 transition-transform mb-0.5">→</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6 md:space-y-8">
                        <TopTeamsWidget />
                        <TopReviewsWidget />
                    </div>
                </div>
            </div>
        </main>
    );
};
