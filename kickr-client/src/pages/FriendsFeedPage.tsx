import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFollowingReviews } from '../hooks/useUserMatch';
import { FeedReviewCard } from '../components/review/FeedReviewCard';
import { Link } from 'react-router-dom';

export const FriendsFeedPage = () => {
    const { user: currentUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 12;

    const { data: pageData, isLoading, isError } = useFollowingReviews(currentUser?.id, currentPage, pageSize);

    const reviews = pageData?.content || [];

    return (
        <main className="min-h-screen bg-[#0a0b0d] py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-20 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <div className="h-[1px] w-12 bg-kickr/40" />
                        <span className="text-[10px] font-black text-kickr uppercase tracking-[0.4em]">Tactical Intelligence</span>
                    </div>
                    <h1 className="text-4xl sm:text-7xl font-black text-white italic tracking-tighter uppercase leading-tight mb-4">
                        Friends <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-kickr to-kickr/40">Feed.</span>
                    </h1>
                    <p className="text-[#667788] text-xs sm:text-sm uppercase tracking-[0.2em] font-bold max-w-xl mx-auto md:mx-0">
                        Monitor the tactical observations from the field. Intel gathered from your network of tacticians.
                    </p>
                </header>

                <div className="space-y-12">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="py-20 text-center bg-white/[0.02] border border-white/5 rounded-3xl">
                            <h2 className="text-lg font-black text-white uppercase italic mb-2">Transmission Interrupted</h2>
                            <p className="text-[#667788] text-xs uppercase tracking-widest mb-6">Failed to retrieve intel from your network.</p>
                            <button onClick={() => window.location.reload()} className="text-kickr text-[10px] font-black uppercase tracking-[0.3em] border border-kickr/20 px-8 py-3 rounded-xl hover:bg-kickr/5 transition-all">Retry Link</button>
                        </div>
                    ) : reviews.length === 0 ? (
                        // No changes needed to the empty state section
                        <div className="py-24 text-center bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                            <div className="text-4xl mb-6">📡</div>
                            <h2 className="text-xl font-black text-white italic uppercase mb-3">No Intel Found</h2>
                            <p className="text-[#667788] text-[11px] uppercase tracking-[0.2em] font-bold max-w-xs mx-auto leading-relaxed mb-8">
                                Your current follows haven't logged any recent match data. Expand your network to gather more intel.
                            </p>
                            <Link to="/community" className="inline-block bg-kickr text-black text-[10px] font-black uppercase tracking-[0.3em] px-10 py-4 rounded-xl hover:scale-105 transition-all">
                                Discover Tacticians →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reviews.map((review: any) => (
                                <FeedReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && pageData && pageData.totalPages > 1 && (
                        <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-center gap-4">
                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.max(0, prev - 1));
                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                }}
                                disabled={pageData.first}
                                className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#667788] hover:text-white hover:border-kickr/40 disabled:opacity-30 transition-all"
                            >
                                Prev
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(pageData.totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setCurrentPage(i);
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i
                                            ? 'bg-kickr text-black'
                                            : 'bg-white/[0.02] border border-white/5 text-[#445566] hover:text-white'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.min(pageData.totalPages - 1, prev + 1));
                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                }}
                                disabled={pageData.last}
                                className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#667788] hover:text-white hover:border-kickr/40 disabled:opacity-30 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
