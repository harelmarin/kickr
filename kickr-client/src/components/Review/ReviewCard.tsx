import { Link } from 'react-router-dom';
import type { UserMatch } from '../../types/UserMatch';
import { authService } from '../../services/authService';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

interface ReviewCardProps {
    review: UserMatch;
    onModerate?: () => void;
}

export const ReviewCard = ({ review, onModerate }: ReviewCardProps) => {
    const user = authService.getUser();
    const isAdmin = user?.role === 'ADMIN';

    const handleModerate = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm('Moderate this review? The comment will be replaced by a moderation message.')) {
            return;
        }

        try {
            await adminService.moderateReview(review.id);
            toast.success('Review moderated');
            if (onModerate) onModerate();
            else window.location.reload();
        } catch (error) {
            toast.error('Failed to moderate review');
        }
    };

    return (
        <div className={`flex gap-5 group/review ${review.isModerated ? 'opacity-60' : ''}`}>
            {/* Mini Ticket Look */}
            <Link
                to={review.comment && review.comment.trim() !== "" ? `/reviews/${review.id}` : `/matches/${review.match.id}`}
                className="relative w-32 h-20 bg-[#1b2228] rounded-xl border border-white/5 overflow-hidden shadow-xl flex-shrink-0 transition-all duration-300 flex items-center justify-center gap-3 px-3 poster-hover-effect"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b2228] to-[#252a31]"></div>
                <img src={review.match.homeLogo} className="w-8 h-8 object-contain drop-shadow-lg z-10" alt="" />
                <div className="flex items-center gap-2 z-10">
                    <span className="text-[16px] font-black text-white italic leading-none">{review.match.homeScore}</span>
                    <div className="w-[1px] h-4 bg-kickr/40"></div>
                    <span className="text-[16px] font-black text-white italic leading-none">{review.match.awayScore}</span>
                </div>
                <img src={review.match.awayLogo} className="w-8 h-8 object-contain drop-shadow-lg z-10" alt="" />
            </Link>

            <div className="flex flex-col flex-1">
                <div className="flex flex-col gap-1.5 mb-2">
                    <div className="flex items-center justify-between">
                        <Link to={`/matches/${review.match.id}`} className="text-white text-sm font-black tracking-tight hover:text-kickr transition-colors uppercase leading-tight">
                            {review.match.homeTeam} v {review.match.awayTeam}
                        </Link>

                        {isAdmin && !review.isModerated && (
                            <button
                                onClick={handleModerate}
                                className="text-[10px] font-bold text-[#ff4444] opacity-0 group-hover/review:opacity-100 transition-opacity uppercase tracking-widest hover:underline"
                            >
                                Moderate
                            </button>
                        )}
                        {review.isModerated && (
                            <span className="text-[8px] font-black bg-[#ff4444]/10 text-[#ff4444] px-2 py-0.5 rounded border border-[#ff4444]/20 uppercase tracking-widest">
                                Moderated
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex text-[#4466ff] text-[9px]">
                            {'★'.repeat(Math.round(review.note))}
                            <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                        </div>
                        {review.isLiked && (
                            <span className="text-[#ff8000] text-xs ml-0.5" title="Liked">❤</span>
                        )}
                        <span className="text-[9px] font-bold text-[#445566] uppercase tracking-widest">
                            {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                        </span>
                    </div>
                </div>

                {review.comment && review.comment.trim() !== "" && (
                    <Link to={`/reviews/${review.id}`} className="block hover:opacity-80 transition-opacity">
                        <p className={`text-[13px] leading-relaxed italic line-clamp-2 pl-3 border-l-2 mb-3 ${review.isModerated ? 'text-[#ff4444]/60 border-[#ff4444]/20' : 'text-[#99aabb] border-kickr/20'}`}>
                            {review.comment}
                        </p>
                    </Link>
                )}

                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white font-bold border border-white/5 uppercase">
                        {review.user ? review.user.name[0] : '?'}
                    </div>
                    <Link to={`/user/${review.user?.id}`} className="text-[#445566] text-[10px] font-black uppercase tracking-widest group-hover/review:text-white transition-colors">
                        {review.user?.name}
                    </Link>
                </div>
            </div>
        </div>
    );
};
