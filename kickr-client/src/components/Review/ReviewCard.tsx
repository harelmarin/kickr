import { Link } from 'react-router-dom';
import type { UserMatch } from '../../types/UserMatch';
import { authService } from '../../services/authService';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

interface ReviewCardProps {
    review: UserMatch;
    onModerate?: () => void;
    onDelete?: () => void;
}

export const ReviewCard = ({ review, onModerate, onDelete }: ReviewCardProps) => {
    const user = authService.getUser();
    const isAdmin = user?.role === 'ADMIN';

    const handleModerate = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const moderatePromise = adminService.moderateReview(review.id);

        toast.promise(moderatePromise, {
            loading: 'Moderating...',
            success: () => {
                if (onModerate) onModerate();
                else window.location.reload();
                return 'Review moderated';
            },
            error: 'Failed to moderate review'
        });
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to remove this log entry?')) return;

        if (onDelete) onDelete();
    };

    return (
        <div className={`flex gap-3 sm:gap-5 group/review ${review.isModerated ? 'opacity-60' : ''}`}>
            {/* Mini Ticket Look */}
            <Link
                to={review.comment && review.comment.trim() !== "" ? `/reviews/${review.id}` : `/matches/${review.match.id}`}
                className="relative w-24 h-16 sm:w-32 sm:h-20 bg-[#1b2228] rounded-xl border border-white/5 overflow-hidden shadow-xl flex-shrink-0 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-3 px-2 sm:px-3 poster-hover-effect"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b2228] to-[#252a31]"></div>
                <img src={review.match.homeLogo} className="w-6 h-6 sm:w-8 sm:h-8 object-contain drop-shadow-lg z-10" alt="" />
                <div className="flex items-center gap-1 sm:gap-2 z-10">
                    <span className="text-sm sm:text-[16px] font-black text-white italic leading-none">{review.match.homeScore}</span>
                    <div className="w-[1px] h-3 sm:h-4 bg-kickr/40"></div>
                    <span className="text-sm sm:text-[16px] font-black text-white italic leading-none">{review.match.awayScore}</span>
                </div>
                <img src={review.match.awayLogo} className="w-6 h-6 sm:w-8 sm:h-8 object-contain drop-shadow-lg z-10" alt="" />
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
                        {!isAdmin && user?.id === review.user?.id && (
                            <button
                                onClick={handleDelete}
                                className="text-[10px] font-bold text-[#445566] hover:text-red-500 opacity-0 group-hover/review:opacity-100 transition-opacity uppercase tracking-widest"
                            >
                                Delete Log
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
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white font-black border border-white/5 uppercase overflow-hidden shadow-sm">
                        {review.user?.avatarUrl ? (
                            <img src={review.user.avatarUrl} alt={review.user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span>{review.user ? review.user.name[0] : '?'}</span>
                        )}
                    </div>
                    <Link to={`/user/${review.user?.id}`} className="text-[#445566] text-[10px] font-black uppercase tracking-widest group-hover/review:text-white transition-colors">
                        {review.user?.name}
                    </Link>
                </div>
            </div>
        </div>
    );
};
