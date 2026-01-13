import { Link } from 'react-router-dom';
import type { UserMatch } from '../../types/usermatch';

interface FeedReviewCardProps {
    review: UserMatch;
}

export const FeedReviewCard = ({ review }: FeedReviewCardProps) => {
    return (
        <div className="group/card bg-[#14181c] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full">
            {/* Match Header (Small Poster Style) */}
            <Link
                to={review.comment && review.comment.trim() !== "" ? `/reviews/${review.id}` : `/matches/${review.match.id}`}
                className="relative h-32 overflow-hidden block"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] to-transparent z-10" />
                <div className="absolute inset-0 bg-[#000] opacity-20" />

                {/* Team Logos & Score */}
                <div className="absolute inset-0 flex items-center justify-around px-4 z-20">
                    <img src={review.match.homeLogo} className="w-10 h-10 object-contain drop-shadow-xl group-hover/card:scale-110 transition-transform" alt="" />
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-white italic">{review.match.homeScore}</span>
                            <span className="text-kickr/40 font-black">-</span>
                            <span className="text-xl font-black text-white italic">{review.match.awayScore}</span>
                        </div>
                    </div>
                    <img src={review.match.awayLogo} className="w-10 h-10 object-contain drop-shadow-xl group-hover/card:scale-110 transition-transform" alt="" />
                </div>
            </Link>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                    <Link to={`/user/${review.user?.id}`} className="flex items-center gap-2 group/user">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-kickr border border-white/5 overflow-hidden">
                            {review.user?.avatarUrl ? (
                                <img src={review.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                review.user?.name[0]
                            )}
                        </div>
                        <span className="text-[10px] font-black text-[#667788] group-hover/user:text-white transition-colors uppercase tracking-widest truncate max-w-[100px]">
                            {review.user?.name}
                        </span>
                    </Link>

                    <div className="flex text-kickr text-[8px]">
                        {'★'.repeat(Math.round(review.note))}
                        <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                    </div>
                </div>


                {review.comment && (
                    <p className="text-[#99aabb] text-[12px] leading-relaxed italic line-clamp-3 mb-4 pl-3 border-l border-kickr/20 flex-1">
                        "{review.comment}"
                    </p>
                )}

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-bold text-[#445566] uppercase tracking-[0.2em]">
                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                    </span>
                    <Link
                        to={`/reviews/${review.id}`}
                        className="text-[9px] font-black text-kickr/60 hover:text-kickr uppercase tracking-widest transition-colors"
                    >
                        Review details →
                    </Link>
                </div>
            </div>
        </div>
    );
};
