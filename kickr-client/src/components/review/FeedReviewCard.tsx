import { Link } from 'react-router-dom';
import type { UserMatch } from '../../types/userMatch';

interface FeedReviewCardProps {
    review: UserMatch;
}

export const FeedReviewCard = ({ review }: FeedReviewCardProps) => {
    return (
        <div className="group/card bg-kickr-bg-secondary border border-white/5 rounded-md overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col h-full">
            {/* Match Header (Compact) */}
            <Link
                to={review.comment && review.comment.trim() !== "" ? `/reviews/${review.id}` : `/matches/${review.match.id}`}
                className="relative h-14 md:h-20 overflow-hidden block bg-black/20 border-b border-white/5"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-kickr-bg-primary via-transparent to-transparent opacity-80 z-10" />

                {/* Team Logos & Score */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 md:gap-6 px-4 z-20">
                    <img src={review.match.homeLogo} className="w-5 h-5 md:w-8 md:h-8 object-contain drop-shadow-xl group-hover/card:scale-[1.05] transition-transform" alt="" />
                    <div className="flex flex-col items-center">
                        <span className="text-xs md:text-sm font-bold text-main tabular-nums">
                            {review.match.homeScore} - {review.match.awayScore}
                        </span>
                    </div>
                    <img src={review.match.awayLogo} className="w-5 h-5 md:w-8 md:h-8 object-contain drop-shadow-xl group-hover/card:scale-[1.05] transition-transform" alt="" />
                </div>
            </Link>

            {/* Content Body */}
            <div className="p-3 md:p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                    <Link to={`/user/${review.user?.id}`} className="flex items-center gap-2 group/user min-w-0">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-bold text-secondary overflow-hidden flex-shrink-0">
                            {review.user?.avatarUrl ? (
                                <img src={review.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                review.user?.name[0]
                            )}
                        </div>
                        <span className="text-[11px] font-bold text-secondary group-hover:text-white transition-colors uppercase tracking-wide truncate">
                            {review.user?.name}
                        </span>
                    </Link>

                    <div className="flex items-center gap-1 bg-rating/10 px-2 py-0.5 rounded-sm border border-rating/20">
                        <span className="text-rating text-xs font-bold tabular-nums">{review.note.toFixed(1)}</span>
                    </div>
                </div>

                {review.comment && (
                    <p className="text-secondary text-xs leading-relaxed line-clamp-2 mb-4 font-medium italic">
                        "{review.comment}"
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted/60 uppercase tracking-widest leading-none">
                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}
                    </span>
                    <Link
                        to={`/reviews/${review.id}`}
                        className="text-[10px] font-bold text-secondary hover:text-kickr uppercase tracking-widest transition-all flex items-center gap-1"
                    >
                        DETAILS <span>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
