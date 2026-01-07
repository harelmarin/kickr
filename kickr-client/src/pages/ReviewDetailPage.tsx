import type { FC } from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserMatch } from '../hooks/useUserMatch';
import { useReviewComments, useAddReviewComment } from '../hooks/useReviewComments';
import { useAuth } from '../hooks/useAuth';
import { useUpdateUserMatch } from '../hooks/useUserMatch';

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
        <main className="min-h-screen bg-[#0a0b0d] pt-20 pb-20 pitch-pattern">
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
                    <div className="mt-6 px-2 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-[#667788] text-[10px] font-black uppercase tracking-[0.3em]">{review.match.competition}</span>
                            <span className="text-white/10 text-[8px]">●</span>
                            <span className="text-[#445566] text-[10px] font-black uppercase tracking-[0.3em]">{new Date(review.match.matchDate).getFullYear()}</span>
                        </div>
                        <div className="text-[10px] font-black text-kickr/40 uppercase tracking-[0.2em]">Match Details →</div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                    {/* Sidebar with User Info */}
                    <aside className="lg:col-span-1 border-r border-white/5 pr-10 hidden lg:block">
                        <div className="sticky top-32 space-y-12">
                            <div className="flex flex-col items-center text-center">
                                <Link to={`/user/${review.user.id}`} className="w-20 h-20 rounded-2xl bg-gradient-to-br from-kickr to-kickr/50 flex items-center justify-center text-2xl font-black text-black mb-4 shadow-2xl relative group/avatar overflow-hidden">
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover/avatar:opacity-10 transition-opacity"></div>
                                    {review.user.name[0].toUpperCase()}
                                </Link>
                                <span className="text-[10px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Reviewed by</span>
                                <Link to={`/user/${review.user.id}`} className="text-white font-black uppercase text-base hover:text-kickr transition-colors tracking-tighter italic">{review.user.name}</Link>
                            </div>

                            <div className="pt-10 border-t border-white/5 space-y-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#445566] uppercase tracking-[0.2em] mb-3">Community Rating</span>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className={`text-lg ${star <= Math.round(review.note) ? 'text-kickr' : 'text-white/5'}`}>★</span>
                                        ))}
                                    </div>
                                </div>
                                {review.isLiked && (
                                    <div className="flex items-center gap-3 text-[#ff8000] text-[10px] font-black uppercase tracking-[0.3em] bg-[#ff8000]/5 py-2 px-3 rounded-lg border border-[#ff8000]/10">
                                        <span>❤ Liked match</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    <div className="lg:col-span-3">




                        <header className="border-b border-white/10 pb-6 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Link to={`/user/${review.user.id}`} className="w-8 h-8 rounded-full bg-gradient-to-br from-kickr to-kickr/50 flex items-center justify-center text-xs font-black text-black">
                                        {review.user.name[0].toUpperCase()}
                                    </Link>
                                    <p className="text-[#99aabb] text-xs font-medium uppercase tracking-widest">
                                        Review by <Link to={`/user/${review.user.id}`} className="text-white font-black hover:text-kickr transition-colors">{review.user.name}</Link>
                                    </p>
                                </div>
                                <Link
                                    to={`/user/${review.user.id}/matches`}
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
                                    <span className="text-white font-bold text-sm tracking-tight">
                                        {new Date(review.watchedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>

                                {review.isLiked && (
                                    <div className="ml-auto">
                                        <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                                            <svg className="w-6 h-6 text-orange-500 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="text-[#99aabb] text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-serif italic border-l-4 border-kickr/20 pl-8 py-2 mb-4 bg-white/[0.02] rounded-r-xl">
                                "{review.comment || "No comment provided."}"
                            </div>
                        </header>

                        {/* Actions */}
                        <div className="flex gap-4 mb-12">
                            <button
                                onClick={handleToggleLike}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg border border-white/10 text-[11px] font-black uppercase tracking-widest transition-all ${review.isLiked ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-white/5 text-[#667788] hover:text-white hover:bg-white/10'}`}
                            >
                                <svg className={`w-4 h-4 ${review.isLiked ? 'fill-current' : 'stroke-current fill-none'}`} strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                {review.isLiked ? 'Liked' : 'Like'}
                            </button>
                        </div>

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
                                        <div key={comment.id} className="flex gap-4 group">
                                            <div className="w-8 h-8 rounded-full bg-[#2c3440] flex items-center justify-center text-[10px] font-black text-[#99aabb] flex-shrink-0">
                                                {comment.userName[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-white text-xs font-black">{comment.userName}</span>
                                                    <span className="text-[#445566] text-[10px] uppercase tracking-widest">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-[#99aabb] text-sm leading-relaxed truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:text-white transition-colors">
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
                                        className="w-full bg-transparent border-none outline-none text-[#99aabb] text-sm mb-4 min-h-[100px] resize-none focus:ring-0"
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
                                    <p className="text-[#667788] text-xs uppercase tracking-widest mb-4">You must be logged in to comment</p>
                                    <Link to="/auth/login" className="text-kickr font-black uppercase text-[10px] tracking-widest hover:underline">Sign In</Link>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
};
