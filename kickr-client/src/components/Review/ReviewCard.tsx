import { Link } from 'react-router-dom';
import type { UserMatch } from '../../types/UserMatch';

interface ReviewCardProps {
    review: UserMatch;
}

export const ReviewCard = ({ review }: ReviewCardProps) => (
    <div className="flex gap-5 group/review">
        {/* Mini Poster Sidebar Look */}
        <Link
            to={`/matches/${review.match.id}`}
            className="relative w-20 aspect-[2/3] bg-[#2c3440] rounded border border-white/10 overflow-hidden shadow-xl flex-shrink-0 transition-all duration-300 group-hover/review:border-kickr/40"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1b2228] to-[#2c3440] flex flex-col items-center justify-center p-2 gap-1.5 text-center">
                <img src={review.match.homeLogo} className="w-7 h-7 object-contain drop-shadow-lg" alt="" />
                <span className="text-[6px] font-black text-white/5 tracking-[0.4em] uppercase">vs</span>
                <img src={review.match.awayLogo} className="w-7 h-7 object-contain drop-shadow-lg" alt="" />
            </div>
        </Link>

        <div className="flex flex-col flex-1">
            <div className="flex flex-col gap-1.5 mb-2">
                <div className="flex items-center justify-between">
                    <Link to={`/matches/${review.match.id}`} className="text-white text-sm font-black tracking-tight hover:text-kickr transition-colors uppercase leading-tight">
                        {review.match.homeTeam} v {review.match.awayTeam}
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex text-kickr text-[9px]">
                        {'★'.repeat(Math.round(review.note))}
                        <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#445566] uppercase tracking-widest">
                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                    </span>
                </div>
            </div>

            {review.comment && review.comment.trim() !== "" && (
                <p className="text-[#99aabb] text-[13px] leading-relaxed italic line-clamp-2 pl-3 border-l-2 border-kickr/20 mb-3">
                    {review.comment}
                </p>
            )}

            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white font-bold border border-white/5 uppercase">
                    {review.user.name[0]}
                </div>
                <Link to={`/user/${review.user.id}`} className="text-[#445566] text-[10px] font-black uppercase tracking-widest group-hover/review:text-white transition-colors">
                    {review.user.name}
                </Link>
            </div>
        </div>
    </div>
);
