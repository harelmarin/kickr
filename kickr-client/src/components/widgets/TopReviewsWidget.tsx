import { Link } from 'react-router-dom';
import { usePopularReviews } from '../../hooks/useUserMatch';

export const TopReviewsWidget = () => {
    const { data: popularReviews, isLoading } = usePopularReviews(4);

    return (
        <section className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.5em] italic">Top Reviews</h3>
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Community</span>
            </div>
            <div className="space-y-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-2 w-full bg-white/5 animate-pulse rounded"></div>
                            <div className="h-10 bg-white/5 animate-pulse rounded"></div>
                        </div>
                    ))
                ) : popularReviews && popularReviews.length > 0 ? (
                    popularReviews.slice(0, 4).map((review) => (
                        <div key={review.id} className="relative group">
                            {/* Review Link Overlay */}
                            <Link to={`/reviews/${review.id}`} className="absolute inset-0 z-0" />

                            <div className="flex items-center gap-2 mb-2 relative z-10 pointer-events-none">
                                <Link to={`/user/${review.user?.id}`} className="w-4 h-4 rounded-sm overflow-hidden bg-white/10 border border-white/5 pointer-events-auto hover:border-kickr/40 transition-colors">
                                    {review.user.avatarUrl ? <img src={review.user.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/10 flex items-center justify-center text-[7px] font-black italic text-kickr">{review.user.name[0]}</div>}
                                </Link>
                                <Link to={`/user/${review.user?.id}`} className="text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors italic pointer-events-auto">
                                    {review.user.name || 'Analyst'}
                                </Link>
                                <span className="text-[9px] font-black text-kickr ml-auto italic">{review.note.toFixed(1)}</span>
                            </div>

                            <div className="bg-[#14181c]/20 border border-white/5 p-3 rounded-sm group-hover:border-kickr/20 transition-all relative z-10 pointer-events-none">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex -space-x-1.5">
                                        <img src={review.match.homeLogo} className="w-5 h-5 object-contain z-10" alt="" />
                                        <img src={review.match.awayLogo} className="w-5 h-5 object-contain opacity-50" alt="" />
                                    </div>
                                    <span className="text-[9px] font-black text-white/80 uppercase italic tracking-tighter truncate leading-none group-hover:text-kickr transition-colors">
                                        {review.match.homeTeam} VS {review.match.awayTeam}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="text-[10px] text-white/40 line-clamp-2 italic leading-relaxed font-medium">
                                        "{review.comment}"
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-[10px] text-white/20 italic">No reviews yet.</p>
                )}
            </div>
        </section>
    );
};
