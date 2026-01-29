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
                <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-rating md:w-3 md:h-3">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}

            {/* Half Star */}
            {hasHalfStar && (
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-rating md:w-3 md:h-3">
                    <path d="M12 2V17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
            )}

            {/* Empty Stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white/5 md:w-3 md:h-3">
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
                <div className="relative aspect-[2/3] bg-kickr-bg-secondary border border-white/10 rounded-sm overflow-hidden transition-all duration-300 group-hover/log:border-white/30 group-hover/log:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5 gap-2 transition-transform duration-500">
                        <img src={review.match.homeLogo} className="w-6 h-6 md:w-10 md:h-10 object-contain drop-shadow-lg" alt={`${review.match.homeTeam} logo`} loading="lazy" decoding="async" />
                        <img src={review.match.awayLogo} className="w-6 h-6 md:w-10 md:h-10 object-contain drop-shadow-lg" alt={`${review.match.awayTeam} logo`} loading="lazy" decoding="async" />
                    </div>
                </div>
                <div className="mt-2 flex flex-col items-center">
                    <StarRating note={review.note} />
                    <span className="text-[11px] font-bold text-secondary uppercase mt-1">
                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}
                    </span>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/reviews/${review.id}`} className="group block">
            <div className="relative aspect-[2/3] bg-kickr-bg-secondary border border-white/5 rounded-sm overflow-hidden transition-all duration-500 group-hover:border-kickr/50 group-hover:scale-[1.02] poster-shadow">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-4 md:gap-6 group-hover:scale-[1.03] transition-transform duration-500">
                    <img src={review.match.homeLogo} className="w-10 h-10 md:w-16 md:h-16 object-contain drop-shadow-2xl" alt={`${review.match.homeTeam} logo`} loading="lazy" decoding="async" />
                    <img src={review.match.awayLogo} className="w-10 h-10 md:w-16 md:h-16 object-contain drop-shadow-2xl" alt={`${review.match.awayTeam} logo`} loading="lazy" decoding="async" />
                </div>

                <div className="absolute bottom-3 inset-x-0 z-20 flex flex-col items-center">
                    <span className="text-[11px] md:text-sm font-black text-main italic tabular-nums tracking-tighter leading-none mb-1">
                        {review.match.homeScore}-{review.match.awayScore}
                    </span>
                    <StarRating note={review.note} />
                </div>

                {review.comment && (
                    <div className="absolute top-2 right-2 z-20 text-white/20 group-hover:text-rating transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="mt-3 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {review.user?.avatarUrl ? (
                            <img src={review.user.avatarUrl} alt={`${review.user.name}'s avatar`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[11px] font-bold text-secondary">{review.user?.name[0]}</span>
                        )}
                    </div>
                    <span className="text-[11px] font-bold text-secondary group-hover:text-main transition-colors uppercase tracking-wide">
                        {review.user?.name}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted/60 uppercase">
                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                    </span>
                </div>
            </div>
        </Link>
    );
};
