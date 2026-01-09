import type { FC } from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserMatch } from '../hooks/useUserMatch';
import { useReviewComments, useAddReviewComment } from '../hooks/useReviewComments';
import { useAuth } from '../hooks/useAuth';
import { useUpdateUserMatch } from '../hooks/useUserMatch';
import { useReviewLikeStatus, useToggleReviewLike } from '../hooks/useReviewLikes';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

export const ReviewDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    const { data: review, isLoading: isReviewLoading } = useUserMatch(id!);
    const { data: comments, isLoading: isCommentsLoading } = useReviewComments(id!);
    const addCommentMutation = useAddReviewComment();
    const updateReviewMutation = useUpdateUserMatch();

    const [commentText, setCommentText] = useState('');

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
        <main className="min-h-screen bg-[#0a0b0d] pt-20 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                {/* Horizontal Match Header / Ticket */}
                <header className="mb-8">
                    <Link to={`/matches/${review.match.id}`} className="block group">
                        <div className="aspect-[3/1] sm:aspect-[4.5/1] bg-[#1b2228] rounded-2xl overflow-hidden shadow-2xl relative border border-white/5 transition-all duration-500 poster-hover-effect">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1b2228] to-[#252a31]"></div>

                            <div className="absolute inset-0 flex items-center justify-between px-8 sm:px-16 py-4">
                                {/* Home Team */}
                                <div className="flex items-center gap-6 flex-1">
                                    <img src={review.match.homeLogo} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-500" />
                                    <div className="hidden md:flex flex-col">
                                        <span className="text-white font-black uppercase italic tracking-tighter text-2xl leading-none">{review.match.homeTeam}</span>
                                        <span className="text-[#445566] text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">Host Team</span>
                                    </div>
                                </div>

                                {/* Score Cluster */}
                                <div className="flex items-center gap-8 sm:gap-12">
                                    <span className="text-4xl sm:text-6xl font-black text-white italic leading-none">{review.match.homeScore}</span>
                                    <div className="w-[2px] h-12 bg-kickr/60 rounded-full"></div>
                                    <span className="text-4xl sm:text-6xl font-black text-white italic leading-none">{review.match.awayScore}</span>
                                </div>

                                {/* Away Team */}
                                <div className="flex items-center gap-6 flex-1 justify-end">
                                    <div className="hidden md:flex flex-col items-end text-right">
                                        <span className="text-white font-black uppercase italic tracking-tighter text-2xl leading-none">{review.match.awayTeam}</span>
                                        <span className="text-[#445566] text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">Visitor</span>
                                    </div>
                                    <img src={review.match.awayLogo} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-500" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Sub-header info */}
                    <Link to={`/matches/${review.match.id}`} className="mt-6 px-2 flex items-center justify-between hover:opacity-70 transition-opacity">
                        <div className="flex items-center gap-4">
                            <span className="text-[#667788] text-[10px] font-black uppercase tracking-[0.3em]">{review.match.competition}</span>
                            <span className="text-white/10 text-[8px]">●</span>
                            <span className="text-[#445566] text-[10px] font-black uppercase tracking-[0.3em]">{new Date(review.match.matchDate).getFullYear()}</span>
                        </div>
                        <div className="text-[10px] font-black text-kickr/40 uppercase tracking-[0.2em] group-hover:text-kickr transition-colors">Match Details →</div>
                    </Link>
                </header>

                <div className="max-w-3xl mx-auto">
                    <div className="space-y-12">
                        <header className="border-b border-white/10 pb-6 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Link to={`/user/${review.user.id}`} className="w-8 h-8 rounded-full bg-gradient-to-br from-kickr to-kickr/50 flex items-center justify-center text-xs font-black text-black overflow-hidden shadow-lg border border-white/10">
                                        {review.user.avatarUrl ? (
                                            <img src={review.user.avatarUrl} alt={review.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            review.user.name[0].toUpperCase()
                                        )}
                                    </Link>
                                    <p className="text-[#99aabb] text-xs font-medium uppercase tracking-widest">
                                        Review by <Link to={`/user/${review.user.id}`} className="text-white font-black hover:text-kickr transition-colors">{review.user.name}</Link>
                                    </p>
                                </div>
                                <Link
                                    to={`/user/${review.user.id}/diary`}
                                    className="text-[10px] font-black text-[#445566] uppercase tracking-[0.2em] hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-lg"
                                >
                                    View Diary →
                                </Link>
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Rating</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`text-xl ${star <= Math.round(review.note) ? 'text-[#4466ff]' : 'text-white/5'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Date Logged</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-sm tracking-tight">
                                            {new Date(review.watchedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
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
                                        <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Moderation</span>
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
                                                className="text-[10px] font-black text-[#ff4444]/60 hover:text-[#ff4444] uppercase tracking-widest transition-colors text-left"
                                            >
                                                Moderate Review
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className={`${review.isModerated ? 'text-[#ff4444]/60 border-[#ff4444]/20' : 'text-[#99aabb] border-kickr/20'} text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-serif italic border-l-4 pl-8 py-2 mb-8 bg-white/[0.02] rounded-r-xl`}>
                                "{review.comment || "No comment provided."}"
                            </div>

                            {/* Like Button at the end */}
                            <div className="flex justify-end mb-12">
                                <LikeButton reviewId={review.id} likesCount={review.likesCount} />
                            </div>
                        </header>



                        {/* Comments Section */}
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
                                                className="w-8 h-8 rounded-md bg-gradient-to-br from-[#1b2228] to-[#2c3440] border border-white/10 flex items-center justify-center text-[10px] font-black text-kickr uppercase hover:border-kickr/50 hover:scale-110 transition-all shadow-lg flex-shrink-0 overflow-hidden"
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
        </main>
    );
};

const LikeButton: FC<{ reviewId: string; likesCount: number }> = ({ reviewId, likesCount }) => {
    const { user: currentUser } = useAuth();
    const { data: isLikedByMe } = useReviewLikeStatus(reviewId, currentUser?.id);
    const toggleLike = useToggleReviewLike();

    const handleLike = () => {
        if (!currentUser) {
            toast.error('Please log in to like reviews');
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
