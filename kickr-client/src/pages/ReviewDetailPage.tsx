import type { FC } from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserMatch } from '../hooks/useUserMatch';
import { useReviewComments, useAddReviewComment } from '../hooks/useReviewComments';
import { useAuth } from '../hooks/useAuth';
import { useUpdateUserMatch } from '../hooks/useUserMatch';
import { useReviewLikeStatus, useToggleReviewLike } from '../hooks/useReviewLikes';
import { adminService } from '../services/adminService';
import { ShareReviewButton } from '../components/review/ShareReviewButton';
import { useDeleteUserMatch } from '../hooks/useUserMatch';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ReportModal } from '../components/modals/ReportModal';

export const ReviewDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { data: review, isLoading: isReviewLoading } = useUserMatch(id!);
    const { data: comments, isLoading: isCommentsLoading } = useReviewComments(id!);
    const addCommentMutation = useAddReviewComment();
    const updateReviewMutation = useUpdateUserMatch();
    const deleteReviewMutation = useDeleteUserMatch();

    const [commentText, setCommentText] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [reportConfig, setReportConfig] = useState<{ id: string, type: 'MATCH_REVIEW' | 'COMMENT' } | null>(null);

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser || !id) return;

        addCommentMutation.mutate({
            reviewId: id,
            userId: currentUser.id,
            content: commentText
        }, {
            onSuccess: () => setCommentText('')
        });
    };

    const handleToggleLike = () => {
        if (!review || !currentUser) return;
        updateReviewMutation.mutate({
            id: review.id,
            dto: {
                note: review.note,
                comment: review.comment,
                isLiked: !review.isLiked
            }
        });
    };

    const handleDeleteReview = () => {
        if (!review || !currentUser) return;
        deleteReviewMutation.mutate(review.id, {
            onSuccess: () => {
                toast.success('Log entry removed');
                navigate(`/matches/${review.match.id}`);
            },
            onError: () => {
                toast.error('Failed to remove log entry');
                setShowConfirmDelete(false);
            }
        });
    };

    if (isReviewLoading) {
        return (
            <div className="min-h-screen bg-[#14181c] pt-32 flex justify-center">
                <div className="animate-pulse text-kickr uppercase tracking-[0.3em] font-black">Loading review...</div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="min-h-screen bg-[#14181c] pt-32 flex justify-center">
                <div className="text-red-500 uppercase tracking-widest font-black">Review not found</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0b0d] pt-16 sm:pt-20 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <header className="mb-6 sm:mb-8">
                    <Link to={`/matches/${review.match.id}`} className="block group">
                        <div className="aspect-[2.5/1] sm:aspect-[4.5/1] bg-[#1b2228] rounded-xl sm:rounded-2xl overflow-hidden relative border border-white/5 transition-all duration-500 poster-hover-effect">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1b2228] to-[#252a31]"></div>

                            <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-16 py-4">
                                <div className="flex items-center gap-3 sm:gap-6 flex-1">
                                    <img src={review.match.homeLogo} alt="" className="w-8 h-8 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
                                    <div className="hidden md:flex flex-col">
                                        <span className="text-white font-black uppercase italic tracking-tighter text-2xl leading-none">{review.match.homeTeam}</span>
                                        <span className="text-[#445566] text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">Host Team</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 sm:gap-12">
                                    <span className="text-3xl sm:text-6xl font-black text-white italic leading-none">{review.match.homeScore}</span>
                                    <div className="w-[1px] sm:w-[2px] h-8 sm:h-12 bg-kickr/40 rounded-full"></div>
                                    <span className="text-3xl sm:text-6xl font-black text-white italic leading-none">{review.match.awayScore}</span>
                                </div>

                                <div className="flex items-center gap-3 sm:gap-6 flex-1 justify-end">
                                    <div className="hidden md:flex flex-col items-end text-right">
                                        <span className="text-white font-black uppercase italic tracking-tighter text-2xl leading-none">{review.match.awayTeam}</span>
                                        <span className="text-[#445566] text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">Visitor</span>
                                    </div>
                                    <img src={review.match.awayLogo} alt="" className="w-8 h-8 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link to={`/matches/${review.match.id}`} className="mt-4 px-1 flex items-center justify-between hover:opacity-70 transition-opacity">
                        <div className="flex items-center gap-3">
                            <span className="text-[#667788] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">{review.match.competition}</span>
                            <span className="text-white/10 text-[8px]">●</span>
                            <span className="text-[#445566] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">{new Date(review.match.matchDate).getFullYear()}</span>
                        </div>
                        <div className="text-[9px] sm:text-[10px] font-black text-kickr/40 uppercase tracking-[0.2em] group-hover:text-kickr transition-colors">Details →</div>
                    </Link>
                </header>
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-8 sm:space-y-12">
                        <header className="border-b border-white/10 pb-6 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Link to={`/user/${review.user.id}`} className="w-8 h-8 rounded-full bg-gradient-to-br from-kickr to-kickr/50 flex items-center justify-center text-xs font-black text-black overflow-hidden border border-white/10">
                                        {review.user.avatarUrl ? (
                                            <img src={review.user.avatarUrl} alt={review.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            review.user.name[0].toUpperCase()
                                        )}
                                    </Link>
                                    <p className="text-[#99aabb] text-[11px] sm:text-xs font-medium uppercase tracking-widest">
                                        By <Link to={`/user/${review.user.id}`} className="text-white font-black hover:text-kickr transition-colors">{review.user.name}</Link>
                                    </p>
                                </div>
                                <Link
                                    to={`/user/${review.user.id}/diary`}
                                    className="text-[9px] sm:text-[10px] font-black text-[#445566] uppercase tracking-[0.2em] hover:text-white transition-colors border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg"
                                >
                                    Diary →
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:flex sm:items-center gap-6 sm:gap-8 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[8px] sm:text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Rating</span>
                                    <div className="flex gap-0.5 sm:gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`text-base sm:text-xl ${star <= Math.round(review.note) ? 'text-[#4466ff]' : 'text-white/5'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-[8px] sm:text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Date Logged</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-xs sm:text-sm tracking-tight">
                                            {new Date(review.watchedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        {review.isLiked && (
                                            <span
                                                className={`text-[#ff8000] text-sm ${currentUser?.id === review.user.id ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                                                onClick={currentUser?.id === review.user.id ? handleToggleLike : undefined}
                                                title={currentUser?.id === review.user.id ? "Unfavorite match" : undefined}
                                            >
                                                ❤
                                            </span>
                                        )}
                                        {!review.isLiked && currentUser?.id === review.user.id && (
                                            <span
                                                className="text-[#445566] hover:text-orange-500/50 text-sm cursor-pointer transition-colors"
                                                onClick={handleToggleLike}
                                                title="Favorite match"
                                            >
                                                ❤
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {currentUser?.role === 'ADMIN' && (
                                    <div className="flex flex-col">
                                        <span className="text-[8px] sm:text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Moderation</span>
                                        {!review.isModerated && (
                                            <button
                                                onClick={() => {
                                                    const promise = adminService.moderateReview(review.id);
                                                    toast.promise(promise, {
                                                        loading: 'Moderating...',
                                                        success: () => {
                                                            setTimeout(() => window.location.reload(), 500);
                                                            return 'Review moderated';
                                                        },
                                                        error: 'Failed to moderate'
                                                    });
                                                }}
                                                className="text-[9px] sm:text-[10px] font-black text-[#ff4444]/60 hover:text-[#ff4444] uppercase tracking-widest transition-colors text-left"
                                            >
                                                Moderate
                                            </button>
                                        )}
                                    </div>
                                )}

                                {currentUser?.id === review.user.id && (
                                    <div className="flex flex-col">
                                        <span className="text-[8px] sm:text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Actions</span>
                                        <div className="relative">
                                            {!showConfirmDelete ? (
                                                <button
                                                    onClick={() => setShowConfirmDelete(true)}
                                                    className="text-[9px] sm:text-[10px] font-black text-[#667788] hover:text-[#ff4444] uppercase tracking-widest transition-colors text-left"
                                                >
                                                    Delete
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                                    <button
                                                        onClick={handleDeleteReview}
                                                        disabled={deleteReviewMutation.isPending}
                                                        className="text-[9px] sm:text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                                                    >
                                                        {deleteReviewMutation.isPending ? '...' : 'Confirm'}
                                                    </button>
                                                    <span className="text-[#445566] text-[10px]">/</span>
                                                    <button
                                                        onClick={() => setShowConfirmDelete(false)}
                                                        className="text-[9px] sm:text-[10px] font-black text-[#667788] hover:text-white uppercase tracking-widest"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {currentUser?.id !== review.user.id && (
                                    <div className="flex flex-col">
                                        <span className="text-[8px] sm:text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Feedback</span>
                                        <button
                                            onClick={() => setReportConfig({ id: review.id, type: 'MATCH_REVIEW' })}
                                            className="text-[9px] sm:text-[10px] font-black text-[#667788] hover:text-red-500 uppercase tracking-widest transition-colors text-left"
                                        >
                                            Report
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={`${review.isModerated ? 'text-[#ff4444]/60 border-[#ff4444]/20' : 'text-[#99aabb] border-kickr/20'} text-lg sm:text-2xl leading-relaxed whitespace-pre-wrap font-serif italic border-l-2 sm:border-l-4 pl-4 sm:pl-8 py-2 mb-8 sm:mb-12 bg-white/[0.02] rounded-r-xl`}>
                                "{review.comment || "No comment provided."}"
                            </div>

                            <div className="flex items-center justify-between mb-8 sm:mb-12 pt-6 border-t border-white/5">
                                <ShareReviewButton review={review} variant="full" />
                                <LikeButton reviewId={review.id} likesCount={review.likesCount} />
                            </div>
                        </header>


                        <section>
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#667788] mb-8 border-b border-white/5 pb-4">
                                {comments?.length || 0} Comments
                            </h3>

                            <div className="space-y-8 mb-12">
                                {isCommentsLoading ? (
                                    <div className="text-[#445566] text-xs">Loading comments...</div>
                                ) : comments && comments.length > 0 ? (
                                    comments.map(comment => (
                                        <div key={comment.id} className={`flex gap-4 group ${comment.isModerated ? 'opacity-50' : ''}`}>
                                            <Link
                                                to={`/user/${comment.userId}`}
                                                className="w-8 h-8 rounded-md bg-gradient-to-br from-[#1b2228] to-[#2c3440] border border-white/10 flex items-center justify-center text-[10px] font-black text-kickr uppercase hover:border-kickr/50 hover:scale-110 transition-all flex-shrink-0 overflow-hidden"
                                            >
                                                {comment.userAvatarUrl ? (
                                                    <img src={comment.userAvatarUrl} alt={comment.userName} className="w-full h-full object-cover" />
                                                ) : (
                                                    comment.userName[0].toUpperCase()
                                                )}
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            to={`/user/${comment.userId}`}
                                                            className="text-white text-xs font-black hover:text-kickr transition-colors"
                                                        >
                                                            {comment.userName}
                                                        </Link>
                                                        <span className="text-[#445566] text-[10px] uppercase tracking-widest">
                                                            {new Date(comment.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    {currentUser?.role === 'ADMIN' && !comment.isModerated && (
                                                        <button
                                                            onClick={() => {
                                                                const promise = adminService.moderateComment(comment.id);
                                                                toast.promise(promise, {
                                                                    loading: 'Moderating...',
                                                                    success: () => {
                                                                        setTimeout(() => window.location.reload(), 500);
                                                                        return 'Comment moderated';
                                                                    },
                                                                    error: 'Failed to moderate'
                                                                });
                                                            }}
                                                            className="text-[9px] font-black text-[#ff4444]/40 hover:text-[#ff4444] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            Moderate
                                                        </button>
                                                    )}
                                                </div>
                                                <p className={`text-[#99aabb] text-sm leading-relaxed truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:text-white transition-colors ${comment.isModerated ? 'italic text-[#ff4444]/60' : ''}`}>
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-[#445566] text-xs italic">No comments yet. Share your thoughts!</div>
                                )}
                            </div>

                            {currentUser ? (
                                <form onSubmit={handleAddComment} className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-4 outline-none text-[#99aabb] text-sm mb-4 min-h-[100px] resize-none focus:border-kickr/50 focus:ring-1 focus:ring-kickr/20 transition-all"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!commentText.trim() || addCommentMutation.isPending}
                                            className="bg-kickr text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                                    <p className="text-[#667788] text-xs uppercase tracking-widest">You must be logged in to comment.</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            <ReportModal
                isOpen={!!reportConfig}
                onClose={() => setReportConfig(null)}
                targetType={reportConfig?.type || 'MATCH_REVIEW'}
                targetId={reportConfig?.id || ''}
            />
        </main>
    );
};

const LikeButton: FC<{ reviewId: string; likesCount: number }> = ({ reviewId, likesCount }) => {
    const { user: currentUser } = useAuth();
    const { data: isLikedByMe } = useReviewLikeStatus(reviewId, currentUser?.id);
    const toggleLike = useToggleReviewLike();

    const handleLike = () => {
        if (!currentUser) {
            toast.error('You need to be logged in to like reviews', {
                duration: 4000,
                position: 'top-center',
            });
            setTimeout(() => {
                window.location.href = '/register';
            }, 500);
            return;
        }
        toggleLike.mutate({ reviewId, userId: currentUser.id });
    };

    return (
        <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Like</span>
            <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs transition-all ${isLikedByMe ? 'text-kickr' : 'text-[#667788] hover:text-kickr'
                    }`}
                title={isLikedByMe ? 'Unlike' : 'Like this review'}
            >
                <span className="text-lg">{isLikedByMe ? '👍' : '👍'}</span>
                {likesCount > 0 && (
                    <span className="font-bold">{likesCount}</span>
                )}
            </button>
        </div>
    );
};
