import type { FC } from 'react';

import { Link } from 'react-router-dom';
import type { UserMatch } from '../../types/userMatch';
import { StarRating } from './ReviewPosterCard';

interface ReviewDetailedCardProps {
    review: UserMatch;
    showUser?: boolean;
}

export const ReviewDetailedCard: FC<ReviewDetailedCardProps> = ({ review, showUser = false }) => {
    return (
        <div className="grid grid-cols-[64px_1fr] md:grid-cols-[120px_1fr] gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-0 py-6 border-b border-white/[0.03] last:border-0 group">
            {/* LEFT: POSTER & STATS */}
            <div className="col-span-1 space-y-2 md:space-y-3">
                <Link to={`/reviews/${review.id}`} className="block">
                    <div className="relative aspect-[2/3] bg-kickr-bg-secondary border border-white/5 rounded-sm overflow-hidden shadow-lg transition-all group-hover:border-kickr/40">
                        <div className="absolute inset-0 bg-gradient-to-t from-kickr-bg-primary/40 to-transparent z-10" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 md:p-2 gap-1 md:gap-2">
                            <img src={review.match.homeLogo} className="w-4 h-4 md:w-8 md:h-8 object-contain" alt="" />
                            <img src={review.match.awayLogo} className="w-4 h-4 md:w-8 md:h-8 object-contain" alt="" />
                        </div>
                    </div>
                </Link>
                <div className="flex flex-col items-center md:items-start gap-1">
                    <div className="scale-[0.6] md:scale-90 origin-center md:origin-left">
                        <StarRating note={review.note} />
                    </div>
                    {review.isLiked && (
                        <span className="text-kickr text-[10px] md:text-sm">❤</span>
                    )}
                </div>
            </div>

            {/* RIGHT: CONTENT */}
            <div className="flex flex-col gap-2 md:gap-3">
                <div className="space-y-1">
                    {showUser && (
                        <div className="flex items-center gap-2 mb-1">
                            <img src={review.user.avatarUrl} className="w-4 h-4 rounded-full border border-white/5" alt="" />
                            <span className="text-[9px] font-black text-kickr uppercase italic tracking-widest">{review.user.name}</span>
                        </div>
                    )}
                    <h3 className="text-sm md:text-xl font-black text-main italic uppercase tracking-tighter leading-tight group-hover:text-kickr transition-colors">
                        <Link to={`/reviews/${review.id}`}>
                            {review.match.homeTeam} {review.match.homeScore}-{review.match.awayScore} {review.match.awayTeam}
                        </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-muted uppercase tracking-widest italic opacity-60">
                        <span>{review.match.competition}</span>
                        <span className="opacity-20">•</span>
                        <span>{new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                    </div>
                </div>

                {review.comment && (
                    <p className="text-[10px] md:text-[13px] text-main/60 line-clamp-3 md:line-clamp-4 italic uppercase font-medium leading-relaxed border-l border-kickr/20 pl-3 md:pl-4 transition-colors group-hover:text-main/80">
                        {review.comment}
                    </p>
                )}
            </div>
        </div>
    );
};
