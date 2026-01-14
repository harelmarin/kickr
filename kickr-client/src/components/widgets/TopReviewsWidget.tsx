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
                        <Link key={review.id} to={`/user/${review.user.id}/match/${review.match.id}`} className="block group">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 rounded-full overflow-hidden bg-white/10">
                                    {review.user.avatarUrl ? <img src={review.user.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/10 flex items-center justify-center text-[8px]">{review.user.name[0]}</div>}
                                </div>
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">{review.user.name || 'Analyst'}</span>
                                <span className="text-[9px] font-black text-kickr ml-auto">{review.note.toFixed(1)}</span>
                            </div>

                            <div className="bg-black/20 border border-white/5 p-3 rounded-sm group-hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex -space-x-2">
                                        <img src={review.match.homeLogo} className="w-6 h-6 object-contain z-10" alt="" />
                                        <img src={review.match.awayLogo} className="w-6 h-6 object-contain opacity-70" alt="" />
                                    </div>
                                    <span className="text-[9px] font-black text-white uppercase italic tracking-tighter truncate max-w-[140px]">
                                        {review.match.homeTeam} vs {review.match.awayTeam}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="text-[10px] text-white/60 line-clamp-2 italic leading-relaxed">
                                        "{review.comment}"
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-[10px] text-white/20 italic">No reviews yet.</p>
                )}
            </div>
        </section>
    );
};
