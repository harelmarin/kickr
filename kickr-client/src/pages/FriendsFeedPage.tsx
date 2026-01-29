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
        <main className="min-h-screen bg-kickr-bg-primary pt-16 md:pt-32 pb-12 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <header className="mb-6 md:mb-16">
                    <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-6">
                        <div className="h-[1px] md:h-[2px] w-3 md:w-6 bg-kickr/40" />
                        <span className="text-[7px] md:text-[10px] font-black text-kickr/80 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Activity Feed</span>
                    </div>
                    <h1 className="text-2xl md:text-6xl font-black text-main mb-1 md:mb-4 italic tracking-tighter uppercase leading-none">
                        Social <span className="text-kickr/80">Feed</span>
                    </h1>
                    <p className="text-muted uppercase tracking-[0.15em] md:tracking-[0.25em] text-[8px] md:text-[11px] font-black italic">
                        The latest match logs from your network.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/5 pb-4">
                            <h2 className="text-sm md:text-lg font-bold uppercase tracking-wider text-secondary">Match Logs</h2>
                            <div className="flex items-center gap-2 bg-kickr/10 px-3 py-1 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-rating animate-pulse"></div>
                                <span className="text-[10px] md:text-xs font-bold text-rating uppercase tracking-wider">LIVE</span>
                            </div>
                        </div>

                        <div className="bg-white/[0.01] border border-white/5 p-2.5 md:p-8 rounded-sm">

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="h-64 bg-black/5 rounded-sm animate-pulse" />
                                    ))}
                                </div>
                            ) : isError ? (
                                <div className="py-20 text-center">
                                    <h2 className="text-lg font-bold text-main uppercase mb-2">Connection Error</h2>
                                    <p className="text-secondary text-xs uppercase tracking-widest mb-6">Failed to retrieve logs from your network.</p>
                                    <button onClick={() => window.location.reload()} className="btn-primary-kickr">Retry</button>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="py-24 text-center bg-black/[0.02] border border-white/5 rounded-sm px-6">
                                    <div className="text-4xl mb-6 font-black italic">📡</div>
                                    <h2 className="text-lg font-black text-main italic uppercase mb-2">No Logs Found</h2>
                                    <p className="text-main/20 text-[10px] uppercase tracking-[0.2em] font-bold max-w-xs mx-auto leading-relaxed mb-6">
                                        Your friends haven't logged any matches yet. Expand your network to see more activity.
                                    </p>
                                    <Link to="/community" className="inline-block bg-kickr text-white text-[9px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-sm hover:brightness-110 transition-all italic shadow-[0_0_20px_rgba(93,139,255,0.2)]">
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
                        </div>

                        {/* Pagination */}
                        {!isLoading && pageData && pageData.totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-8 border-t border-white/10 pt-8">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(0, prev - 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.first}
                                    className="group flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-main/20 disabled:opacity-5 hover:text-main transition-all italic"
                                >
                                    <span className="text-sm md:text-lg group-hover:-translate-x-1 transition-transform mb-0.5">←</span>
                                    PREV
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] md:text-[10px] font-black text-main/10 uppercase tracking-widest italic tabular-nums">
                                        PAGE <span className="text-main/40">{currentPage + 1}</span> / {pageData.totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(pageData.totalPages - 1, prev + 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.last}
                                    className="group flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-main/20 disabled:opacity-5 hover:text-main transition-all italic"
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
