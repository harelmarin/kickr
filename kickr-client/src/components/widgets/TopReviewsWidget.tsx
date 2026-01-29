import { Link } from 'react-router-dom';
import { usePopularReviews } from '../../hooks/useUserMatch';

export const TopReviewsWidget = () => {
    const { data: popularReviews, isLoading } = usePopularReviews(4);

    return (
        <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
            <div className="flex items-center justify-between mb-8 border-b border-white/[0.03] pb-6">
                <h3 className="text-[11px] font-black text-kickr uppercase tracking-[0.5em] italic">Top Reviews</h3>
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Community</span>
            </div>
            <div className="space-y-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-2 w-full bg-black/5 animate-pulse rounded"></div>
                            <div className="h-10 bg-black/5 animate-pulse rounded"></div>
                        </div>
                    ))
                ) : popularReviews && popularReviews.length > 0 ? (
                    popularReviews.slice(0, 4).map((review) => (
                        <div key={review.id} className="relative group">
                            {/* Review Link Overlay */}
                            <Link to={`/reviews/${review.id}`} className="absolute inset-0 z-0" />

                            <div className="flex items-center gap-2 mb-2 relative z-10 pointer-events-none">
                                <Link to={`/user/${review.user?.id}`} className="w-4 h-4 rounded-sm overflow-hidden bg-black/10 border border-white/5 pointer-events-auto hover:border-kickr/40 transition-colors">
                                    {review.user.avatarUrl ? <img src={review.user.avatarUrl} alt={`${review.user.name} avatar`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-black/10 flex items-center justify-center text-[10px] font-black italic text-kickr">{review.user.name?.[0]}</div>}
                                </Link>
                                <Link to={`/user/${review.user?.id}`} className="text-[11px] font-black text-secondary uppercase tracking-widest hover:text-main transition-colors italic pointer-events-auto">
                                    {review.user.name || 'Analyst'}
                                </Link>
                                <span className="text-[11px] font-black text-rating ml-auto italic">{review.note.toFixed(1)}</span>
                            </div>

                            <div className="bg-kickr-bg-primary/20 border border-white/5 p-3 rounded-sm group-hover:border-kickr/20 transition-all relative z-10 pointer-events-none">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex -space-x-1.5">
                                        <img src={review.match.homeLogo} className="w-5 h-5 object-contain z-10" alt={`${review.match.homeTeam} logo`} />
                                        <img src={review.match.awayLogo} className="w-5 h-5 object-contain opacity-50" alt={`${review.match.awayTeam} logo`} />
                                    </div>
                                    <span className="text-[11px] font-black text-main uppercase italic tracking-tighter truncate leading-none group-hover:text-kickr transition-colors">
                                        {review.match.homeTeam} VS {review.match.awayTeam}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="text-[12px] text-secondary line-clamp-2 italic leading-relaxed font-medium">
                                        "{review.comment}"
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-[11px] text-muted italic">No reviews yet.</p>
                )}
            </div>
        </section>
    );
};
