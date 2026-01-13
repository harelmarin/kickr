import { Link } from 'react-router-dom';
import type { UserMatch } from '../../types/userMatch';

interface FeedReviewCardProps {
    review: UserMatch;
}

export const FeedReviewCard = ({ review }: FeedReviewCardProps) => {
    return (
        <div className="group/card bg-[#14181c] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full">
            {/* Match Header (Small Poster Style) */}
            <Link
                to={review.comment && review.comment.trim() !== "" ? `/reviews/${review.id}` : `/matches/${review.match.id}`}
                className="relative h-24 sm:h-32 overflow-hidden block"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] to-transparent z-10" />
                <div className="absolute inset-0 bg-[#000] opacity-20" />

                {/* Team Logos & Score */}
                <div className="absolute inset-0 flex items-center justify-around px-2 sm:px-4 z-20">
                    <img src={review.match.homeLogo} className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-xl group-hover/card:scale-110 transition-transform" alt="" />
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-lg sm:text-xl font-black text-white italic">{review.match.homeScore}</span>
                            <span className="text-kickr/40 font-black">-</span>
                            <span className="text-lg sm:text-xl font-black text-white italic">{review.match.awayScore}</span>
                        </div>
                    </div>
                    <img src={review.match.awayLogo} className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-xl group-hover/card:scale-110 transition-transform" alt="" />
                </div>
            </Link>

            {/* Content Body */}
            <div className="p-3 sm:p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <Link to={`/user/${review.user?.id}`} className="flex items-center gap-2 group/user">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-kickr border border-white/5 overflow-hidden">
                            {review.user?.avatarUrl ? (
                                <img src={review.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                review.user?.name[0]
                            )}
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-black text-[#667788] group-hover/user:text-white transition-colors uppercase tracking-widest truncate max-w-[80px] sm:max-w-[100px]">
                            {review.user?.name}
                        </span>
                    </Link>

                    <div className="flex text-kickr text-[7px] sm:text-[8px]">
                        {'★'.repeat(Math.round(review.note))}
                        <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                    </div>
                </div>


                {review.comment && (
                    <p className="text-[#99aabb] text-[10px] sm:text-[12px] leading-relaxed italic line-clamp-3 mb-3 sm:mb-4 pl-2 sm:pl-3 border-l border-kickr/20 flex-1">
                        "{review.comment}"
                    </p>
                )}

                <div className="mt-auto pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[7px] sm:text-[8px] font-bold text-[#445566] uppercase tracking-[0.2em]">
                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                    </span>
                    <Link
                        to={`/reviews/${review.id}`}
                        className="text-[8px] sm:text-[9px] font-black text-kickr/60 hover:text-kickr uppercase tracking-widest transition-colors"
                    >
                        Review details →
                    </Link>
                </div>
            </div>
        </div>
    );
};
