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
        <main className="min-h-screen bg-[#14181c] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[2px] w-6 bg-kickr" />
                        <span className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Tactical Intelligence</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase">
                        Network <span className="text-kickr">Feed</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.25em] text-[11px] font-bold">
                        Analyze recent observations gathered from your network of tacticians.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90 italic">Intelligence Log</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-kickr animate-pulse"></div>
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Live Updates</span>
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
                                <p className="text-[#667788] text-xs uppercase tracking-widest mb-6">Failed to retrieve intel from your network.</p>
                                <button onClick={() => window.location.reload()} className="text-kickr text-[10px] font-black uppercase tracking-[0.3em] border border-kickr/20 px-8 py-3 rounded-sm hover:bg-kickr/5 transition-all">Retry Link</button>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="py-24 text-center bg-white/[0.02] border border-white/5 rounded-sm px-6">
                                <div className="text-4xl mb-6 font-black italic">📡</div>
                                <h2 className="text-xl font-black text-white italic uppercase mb-3">No Intel Found</h2>
                                <p className="text-[#667788] text-[11px] uppercase tracking-[0.2em] font-bold max-w-xs mx-auto leading-relaxed mb-8">
                                    Your current follows haven't logged any recent match data. Expand your network to gather more intel.
                                </p>
                                <Link to="/community" className="inline-block bg-kickr text-black text-[10px] font-black uppercase tracking-[0.3em] px-10 py-4 rounded-sm hover:scale-105 transition-all">
                                    Discover Tacticians →
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
                            <div className="mt-8 flex items-center justify-center gap-8 border-t border-white/5 pt-6">
                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.max(0, prev - 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.first}
                                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 disabled:opacity-20 hover:text-white transition-all"
                                >
                                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                                    Prev
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                        Page <span className="text-white">{currentPage + 1}</span> of {pageData.totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        setCurrentPage(prev => Math.min(pageData.totalPages - 1, prev + 1));
                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                    }}
                                    disabled={pageData.last}
                                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 disabled:opacity-20 hover:text-white transition-all"
                                >
                                    Next
                                    <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <TopTeamsWidget />
                        <TopReviewsWidget />
                    </div>
                </div>
            </div>
        </main>
    );
};
