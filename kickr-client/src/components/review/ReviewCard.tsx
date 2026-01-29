import { Link } from 'react-router-dom';
import type { UserMatch } from '../../types/userMatch';
import { authService } from '../../services/authService';
import { adminService } from '../../services/adminService';
import { ShareReviewButton } from './ShareReviewButton';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { ReportModal } from '../modals/ReportModal';

interface ReviewCardProps {
    review: UserMatch;
    onModerate?: () => void;
}

export const ReviewCard = ({ review, onModerate }: ReviewCardProps) => {
    const user = authService.getUser();
    const isAdmin = user?.role === 'ADMIN';
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

    return (
        <div className={`relative bg-black/[0.02] border border-white/5 rounded-sm overflow-hidden group/review transition-all duration-500 hover:border-white/10 flex flex-col ${review.isModerated ? 'opacity-60' : ''}`}>
            {/* Full Card Link Overlay - ONLY if we have a valid target */}
            <Link
                to={review.comment && review.comment.trim() !== "" ? `/reviews/${review.id}` : `/matches/${review.match.id}`}
                className="absolute inset-0 z-0"
                onClick={(e) => {
                    // Prevent navigation if ID is missing (fail-safe)
                    if (!review.id && !review.match.id) {
                        e.preventDefault();
                        console.warn('ReviewCard: Missing ID for navigation');
                    }
                }}
            />

            <div className="relative z-10 flex flex-col h-full pointer-events-none">
                {/* Header Section */}
                <div className="relative w-full h-16 sm:h-20 bg-black/[0.02] border-b border-white/5 flex items-center justify-between px-4 sm:px-6 transition-all duration-300 group-hover/review:bg-white/[0.04]">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={review.match.homeLogo} className="w-5 h-5 sm:w-8 sm:h-8 object-contain" alt={`${review.match.homeTeam} crest`} loading="lazy" decoding="async" />
                    </div>

                    <div className="flex flex-col items-center px-4 sm:px-8">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <span className="text-xl sm:text-2xl font-bold text-main tabular-nums">{review.match.homeScore}</span>
                            <div className="w-[1px] h-4 bg-white/10"></div>
                            <span className="text-xl sm:text-2xl font-bold text-main tabular-nums">{review.match.awayScore}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                        <img src={review.match.awayLogo} className="w-5 h-5 sm:w-8 sm:h-8 object-contain" alt={`${review.match.awayTeam} crest`} loading="lazy" decoding="async" />
                    </div>
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex text-rating text-[11px]">
                                {'★'.repeat(Math.round(review.note))}
                                <span className="text-main/20">{'★'.repeat(5 - Math.round(review.note))}</span>
                            </div>
                            {review.isLiked && (
                                <span className="text-kickr text-[10px] sm:text-xs" title="Liked">❤</span>
                            )}
                            <span className="text-[11px] font-bold text-main/60 uppercase tracking-widest">
                                {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 pointer-events-auto relative z-20">
                            {isAdmin && !review.isModerated && (
                                <button
                                    onClick={handleModerate}
                                    className="text-[11px] font-black text-[#ff4444] opacity-0 group-hover/review:opacity-100 transition-opacity uppercase tracking-widest hover:underline"
                                >
                                    Moderate
                                </button>
                            )}
                            {review.isModerated && (
                                <span className="text-[8px] font-black bg-[#ff4444]/10 text-[#ff4444] px-2 py-0.5 rounded-sm border border-[#ff4444]/20 uppercase tracking-widest leading-none">
                                    MODERATED
                                </span>
                            )}
                        </div>
                    </div>

                    {review.comment && review.comment.trim() !== "" && (
                        <div className="mb-6">
                            <p className={`text-[11px] sm:text-[13px] leading-relaxed italic border-l-2 pl-4 transition-colors ${review.isModerated ? 'text-red-500/60 border-red-500/20' : 'text-secondary border-kickr/20 group-hover/review:text-main'}`}>
                                {review.comment}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/[0.03]">
                        <div className="flex items-center gap-3 min-w-0 pointer-events-auto relative z-20">
                            <Link
                                to={`/user/${review.user?.id}`}
                                className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-center text-[10px] text-kickr font-bold uppercase overflow-hidden transition-colors hover:border-kickr"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {review.user?.avatarUrl ? (
                                    <img src={review.user.avatarUrl} alt={`${review.user.name}'s profile`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{review.user ? review.user.name[0] : '?'}</span>
                                )}
                            </Link>
                            <Link
                                to={`/user/${review.user?.id}`}
                                className="text-main/80 text-[11px] font-bold uppercase tracking-widest hover:text-kickr transition-colors truncate"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {review.user?.name}
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 pointer-events-auto relative z-20">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!user) {
                                        toast.error('Log in to report reviews');
                                        return;
                                    }
                                    setIsReportModalOpen(true);
                                }}
                                className="text-[#334455] hover:text-red-500 transition-colors p-1"
                                title="Report Violation"
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </button>
                            <div onClick={(e) => e.stopPropagation()}>
                                <ShareReviewButton review={review} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                targetType="MATCH_REVIEW"
                targetId={review.id}
            />
        </div>
    );
};
