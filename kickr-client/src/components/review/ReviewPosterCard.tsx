import { Link } from 'react-router-dom';

export const StarRating = ({ note }: { note: number }) => {
    const rating = note; // 1:1 mapping as requested
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
        <div className="flex items-center gap-0.5">
            {/* Full Stars */}
            {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-kickr md:w-2.5 md:h-2.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}

            {/* Half Star */}
            {hasHalfStar && (
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-kickr md:w-2.5 md:h-2.5">
                    <path d="M12 2V17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
            )}

            {/* Empty Stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-white/5 md:w-2.5 md:h-2.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
};

interface ReviewPosterCardProps {
    review: any;
    variant?: 'default' | 'mini';
}

export const ReviewPosterCard = ({ review, variant = 'default' }: ReviewPosterCardProps) => {
    if (variant === 'mini') {
        return (
            <Link to={`/reviews/${review.id}`} className="group/log block">
                <div className="relative aspect-[2/3] bg-kickr-bg-secondary border border-white/5 rounded-[1px] overflow-hidden transition-all duration-300 group-hover/log:border-kickr/40 group-hover/log:shadow-lg group-hover/log:shadow-kickr/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-kickr-bg-primary via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5 gap-2 group-hover/log:scale-105 transition-transform duration-500">
                        <img src={review.match.homeLogo} className="w-5 h-5 md:w-8 md:h-8 object-contain" alt="" />
                        <img src={review.match.awayLogo} className="w-5 h-5 md:w-8 md:h-8 object-contain" alt="" />
                    </div>
                    <div className="absolute bottom-0.5 inset-x-0 z-20 flex flex-col items-center scale-[0.8]">
                        <StarRating note={review.note} />
                    </div>
                </div>
                <div className="mt-1 flex flex-col items-center">
                    <span className="text-[7px] font-mono text-muted uppercase tracking-tighter">
                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}
                    </span>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/reviews/${review.id}`} className="group block">
            <div className="relative aspect-[3/4] bg-kickr-bg-secondary border border-white/5 rounded-sm overflow-hidden transition-all duration-300 group-hover:border-kickr/40 group-hover:shadow-2xl group-hover:shadow-kickr/10 active:scale-[0.97]">
                <div className="absolute inset-0 bg-gradient-to-t from-kickr-bg-primary via-transparent to-transparent z-10" />
                <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-3 md:gap-4 group-hover:scale-105 transition-transform duration-500">
                    <img src={review.match.homeLogo} className="w-8 h-8 md:w-12 md:h-12 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" alt="Home" />
                    <img src={review.match.awayLogo} className="w-8 h-8 md:w-12 md:h-12 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" alt="Away" />
                </div>

                <div className="absolute bottom-1 md:bottom-2 inset-x-0 z-20 flex flex-col items-center">
                    <span className="text-[11px] md:text-[13px] font-black text-main italic tabular-nums tracking-tighter leading-none mb-0.5 md:mb-1">
                        {review.match.homeScore}-{review.match.awayScore}
                    </span>
                    <StarRating note={review.note} />
                </div>

                {review.comment && (
                    <div className="absolute top-1.5 right-1.5 z-20 text-kickr/40 group-hover:text-kickr transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-3.5 md:h-3.5">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="mt-1.5 md:mt-2 flex flex-col gap-0.5 md:gap-1">
                <div className="flex items-center gap-1 md:gap-1.5">
                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {review.user?.avatarUrl ? (
                            <img src={review.user.avatarUrl} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[6px] md:text-[7px] font-black text-kickr">{review.user?.name[0]}</span>
                        )}
                    </div>
                    <span className="text-[7px] md:text-[9px] font-black text-secondary uppercase italic tracking-wider truncate group-hover:text-main transition-colors">
                        {review.user?.name}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[6px] md:text-[7px] font-mono text-muted uppercase tracking-[0.2em] leading-none">
                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}
                    </span>
                </div>
            </div>
        </Link>
    );
};
