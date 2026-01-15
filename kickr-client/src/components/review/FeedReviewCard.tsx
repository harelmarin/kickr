import { Link } from 'react-router-dom';
import type { UserMatch } from '../../types/userMatch';

interface FeedReviewCardProps {
    review: UserMatch;
}

export const FeedReviewCard = ({ review }: FeedReviewCardProps) => {
    return (
        <div className="group/card bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden hover:border-kickr/20 transition-all duration-300 flex flex-col h-full">
            {/* Match Header (Compact) */}
            <Link
                to={review.comment && review.comment.trim() !== "" ? `/reviews/${review.id}` : `/matches/${review.match.id}`}
                className="relative h-14 md:h-20 overflow-hidden block bg-[#14181c]/20 border-b border-white/5"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] to-transparent opacity-40 z-10" />

                {/* Team Logos & Score */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 md:gap-6 px-4 z-20">
                    <img src={review.match.homeLogo} className="w-5 h-5 md:w-8 md:h-8 object-contain drop-shadow-lg group-hover/card:scale-105 transition-transform" alt="" />
                    <div className="flex flex-col items-center">
                        <span className="text-[11px] md:text-sm font-black text-white italic tracking-tighter tabular-nums">
                            {review.match.homeScore} - {review.match.awayScore}
                        </span>
                    </div>
                    <img src={review.match.awayLogo} className="w-5 h-5 md:w-8 md:h-8 object-contain drop-shadow-lg group-hover/card:scale-105 transition-transform" alt="" />
                </div>
            </Link>

            {/* Content Body */}
            <div className="p-1.5 md:p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1 md:mb-3 pb-1 md:pb-3 border-b border-white/5">
                    <Link to={`/user/${review.user?.id}`} className="flex items-center gap-1 md:gap-2 group/user min-w-0">
                        <div className="w-3 h-3 md:w-5 md:h-5 rounded-sm bg-kickr/10 border border-white/5 flex items-center justify-center text-[5px] md:text-[8px] font-black text-kickr overflow-hidden flex-shrink-0">
                            {review.user?.avatarUrl ? (
                                <img src={review.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                review.user?.name[0]
                            )}
                        </div>
                        <span className="text-[6px] md:text-[9px] font-black text-white/90 group-hover/user:text-kickr transition-colors uppercase italic truncate">
                            {review.user?.name}
                        </span>
                    </Link>

                    <div className="flex items-center gap-1 bg-kickr/5 px-1 md:px-2 py-0.5 border border-kickr/10">
                        <span className="text-kickr text-[7px] md:text-[10px] font-black italic tabular-nums">{review.note.toFixed(1)}</span>
                    </div>
                </div>

                {review.comment && (
                    <p className="text-white/70 text-[7px] md:text-[10px] leading-relaxed italic line-clamp-2 mb-1.5 md:mb-4 uppercase font-medium">
                        {review.comment}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-[6px] md:text-[9px] font-black text-white/40 uppercase tracking-widest italic leading-none">
                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}
                    </span>
                    <Link
                        to={`/reviews/${review.id}`}
                        className="text-[5px] md:text-[8px] font-black text-white/40 hover:text-kickr uppercase tracking-widest transition-all flex items-center gap-0.5 md:gap-1 italic"
                    >
                        DETAILS <span className="text-[8px] md:text-xs">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
