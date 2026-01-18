import type { FC } from 'react';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUserMatch } from '../hooks/useUserMatch';
import { useReviewComments, useAddReviewComment } from '../hooks/useReviewComments';
import { useAuth } from '../hooks/useAuth';
import { useReviewLikeStatus, useToggleReviewLike } from '../hooks/useReviewLikes';
import { ShareReviewButton } from '../components/review/ShareReviewButton';
import { useDeleteUserMatch } from '../hooks/useUserMatch';
import toast from 'react-hot-toast';
import { ReportModal } from '../components/modals/ReportModal';
import { AnimatePresence } from 'framer-motion';
import { StarRating } from '../components/review/ReviewPosterCard';

export const ReviewDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { data: review, isLoading: isReviewLoading } = useUserMatch(id!);
    const { data: comments } = useReviewComments(id!);
    const addCommentMutation = useAddReviewComment();
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

    if (isReviewLoading) return <div className="min-h-screen bg-kickr-bg-primary pt-32 flex justify-center"><div className="animate-pulse text-kickr text-[10px] font-black uppercase tracking-[0.4em] italic">Loading Tactical Report...</div></div>;
    if (!review) return <div className="min-h-screen bg-kickr-bg-primary pt-32 flex justify-center"><div className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em] italic">Report not found</div></div>;

    return (
        <main className="min-h-screen bg-kickr-bg-primary pt-[calc(3rem+env(safe-area-inset-top))] md:pt-24 pb-12 md:pb-20">
            <div className="max-w-5xl mx-auto px-4 md:px-6">

                {/* GRID LAYOUT (Poster/Stats, Header, then Full-width Review on mobile) */}
                <div className="grid grid-cols-[80px_1fr] md:grid-cols-12 gap-x-4 md:gap-x-12 gap-y-6 md:gap-y-0">

                    {/* LEFT COLUMN: POSTER & RATING (Spans 1 row on mobile, multiple on desktop) */}
                    <div className="col-span-1 md:col-span-4 lg:col-span-3 md:row-span-3 space-y-3 md:space-y-6">
                        {/* Match Poster */}
                        <Link to={`/matches/${review.match.id}`} className="block group">
                            <div className="relative aspect-[2/3] bg-kickr-bg-secondary border border-white/5 rounded-sm overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-kickr/40">
                                <div className="absolute inset-0 bg-gradient-to-t from-kickr-bg-primary via-transparent to-transparent z-10" />
                                <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-4 gap-2 md:gap-6 group-hover:scale-110 transition-transform duration-500">
                                    <img src={review.match.homeLogo} className="w-6 h-6 md:w-20 md:h-20 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]" alt="" />
                                    <img src={review.match.awayLogo} className="w-6 h-6 md:w-20 md:h-20 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]" alt="" />
                                </div>

                                <div className="absolute bottom-1 md:bottom-3 inset-x-0 z-20 flex flex-col items-center hidden md:flex">
                                    <span className="text-[10px] md:text-2xl font-black text-main italic tabular-nums tracking-tighter leading-none">
                                        {review.match.homeScore}-{review.match.awayScore}
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* RATING & LIKE (Stacked under poster) */}
                        <div className="flex flex-col items-center md:items-start gap-3 md:gap-4 md:p-4 md:bg-white/[0.01] md:border md:border-white/5 md:rounded-sm">
                            <div className="scale-75 md:scale-125 origin-center md:origin-left">
                                <StarRating note={review.note} />
                            </div>

                            <div className="hidden md:block w-full h-px bg-white/5" />

                            <div className="flex items-center">
                                <LikeButton reviewId={review.id} likesCount={review.likesCount} simplified />
                            </div>
                        </div>
                    </div>

                    {/* HEADER: USER & MATCH INFO (Spans right column on mobile) */}
                    <div className="col-span-1 md:col-span-8 lg:col-span-9 space-y-4 md:mb-12">
                        <div className="flex items-center gap-2 md:gap-3">
                            <Link to={`/user/${review.user.id}`} className="w-5 h-5 md:w-10 md:h-10 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden flex-shrink-0">
                                {review.user.avatarUrl ? (
                                    <img src={review.user.avatarUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-kickr text-[8px] md:text-[10px] font-black">{review.user.name[0]}</div>
                                )}
                            </Link>
                            <div className="flex flex-col">
                                <span className="text-[7px] md:text-[10px] font-black text-kickr uppercase tracking-widest italic leading-none mb-0.5 md:mb-1 hidden md:block">Review by</span>
                                <Link to={`/user/${review.user.id}`} className="text-xs md:text-xl font-black text-main uppercase hover:text-kickr transition-colors tracking-tighter italic leading-none">{review.user.name}</Link>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-base md:text-5xl font-black text-main italic uppercase tracking-tighter leading-tight">
                                {review.match.homeTeam} {review.match.homeScore}-{review.match.awayScore} {review.match.awayTeam}
                            </h1>
                            <div className="text-[7px] md:text-xs font-bold text-muted uppercase tracking-widest italic flex items-center gap-1.5 opacity-60">
                                <span className="truncate max-w-[80px] md:max-w-none">{review.match.competition}</span>
                                <span className="opacity-20">•</span>
                                <span>{new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    {/* REVIEW BODY (Spans full width on mobile, right column on desktop) */}
                    <div className="col-span-2 md:col-span-8 lg:col-span-9 space-y-8 md:space-y-12">
                        {/* REVIEW TEXT */}
                        {review.comment ? (
                            <div className="bg-white/[0.01] border-l-2 border-kickr/20 pl-4 md:pl-10 py-1 md:py-2">
                                <p className="text-xs md:text-base font-medium text-main/80 leading-relaxed italic uppercase tracking-tight">
                                    {review.comment}
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted italic text-[9px] md:text-sm uppercase tracking-widest">No detailed analysis provided.</p>
                        )}

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3 md:gap-4 py-4 md:py-6 border-y border-white/5">
                            <ShareReviewButton review={review} variant="full" />
                            <div className="h-4 w-px bg-white/5" />
                            {currentUser?.id === review.user.id ? (
                                <button onClick={() => setShowConfirmDelete(true)} className="text-[8px] md:text-[9px] font-black text-red-500/40 hover:text-red-500 uppercase tracking-widest transition-colors italic">Delete Report</button>
                            ) : (
                                <button onClick={() => setReportConfig({ id: review.id, type: 'MATCH_REVIEW' })} className="text-[8px] md:text-[9px] font-black text-main/10 hover:text-red-500 uppercase tracking-widest transition-colors italic">Report Analysis</button>
                            )}
                        </div>

                        {/* COMMENTS SECTION */}
                        <section className="pt-6 md:pt-12">
                            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
                                <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-main/20 italic">Responses</h3>
                                <div className="h-px flex-1 bg-white/5" />
                                <span className="text-[9px] md:text-[10px] font-mono text-kickr">{comments?.length || 0}</span>
                            </div>

                            <div className="space-y-4 md:space-y-8 mb-8 md:mb-16">
                                {comments?.map(comment => (
                                    <div key={comment.id} className="flex gap-3 md:gap-4 group">
                                        <Link to={`/user/${comment.userId}`} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/[0.03] border border-white/5 flex-shrink-0 overflow-hidden">
                                            {comment.userAvatarUrl ? <img src={comment.userAvatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] md:text-[10px] font-black text-kickr/40">{comment.userName[0]}</div>}
                                        </Link>
                                        <div className="flex-1 space-y-0.5 md:space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] md:text-[11px] font-black text-main uppercase italic">{comment.userName}</span>
                                                <span className="text-[7px] md:text-[8px] font-mono text-muted uppercase tracking-tighter">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-[11px] md:text-sm text-main/70 leading-relaxed italic uppercase font-medium group-hover:text-main transition-colors">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {currentUser && (
                                <form onSubmit={handleAddComment} className="space-y-3 md:space-y-4">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add your tactical response..."
                                        className="w-full bg-white/[0.01] border border-white/5 rounded-sm p-3 md:p-4 text-[11px] md:text-sm font-medium text-main placeholder-white/5 focus:border-kickr/40 transition-all outline-none resize-none h-20 md:h-24 uppercase italic tracking-wider"
                                    />
                                    <div className="flex justify-end">
                                        <button disabled={!commentText.trim() || addCommentMutation.isPending} className="px-5 md:px-8 py-2 md:py-3 bg-kickr text-black text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-sm hover:brightness-110 transition-all disabled:opacity-50 italic">Transmit</button>
                                    </div>
                                </form>
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

            {/* Confirm Delete Popup */}
            <AnimatePresence>
                {showConfirmDelete && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-kickr-bg-primary/90 backdrop-blur-sm">
                        <div className="bg-kickr-bg-secondary border border-white/10 p-12 rounded-sm max-w-sm w-full text-center">
                            <h3 className="text-xl font-black text-main uppercase italic tracking-tighter mb-4">Terminate Record?</h3>
                            <p className="text-main/40 text-[10px] font-black uppercase tracking-widest mb-10">This tactical data will be permanently erased from the network.</p>
                            <div className="flex gap-4">
                                <button onClick={handleDeleteReview} className="flex-1 py-4 bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-red-500/30 transition-all">Confirm Erase</button>
                                <button onClick={() => setShowConfirmDelete(false)} className="flex-1 py-4 bg-black/5 text-main/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:text-main transition-all">Abort</button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
};

const LikeButton: FC<{ reviewId: string; likesCount: number; simplified?: boolean }> = ({ reviewId, likesCount, simplified = false }) => {
    const { user: currentUser } = useAuth();
    const { data: isLikedByMe } = useReviewLikeStatus(reviewId, currentUser?.id);
    const toggleLike = useToggleReviewLike();

    const handleLike = () => {
        if (!currentUser) {
            toast.error('Log in to like reviews');
            return;
        }
        toggleLike.mutate({ reviewId, userId: currentUser.id });
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 md:gap-3 transition-all ${isLikedByMe ? 'text-kickr' : 'text-main/10 hover:text-main'}`}
        >
            <span className="text-base md:text-xl">{isLikedByMe ? '❤' : '❤'}</span>
            <div className="flex flex-col items-start leading-none">
                <span className={`text-[10px] md:text-[11px] font-black italic tabular-nums leading-none ${isLikedByMe ? 'text-kickr' : 'text-main/40'}`}>{likesCount || 0}</span>
                {!simplified && <span className="text-[6px] md:text-[7px] font-black uppercase tracking-widest mt-0.5 hidden md:block">Supports</span>}
            </div>
        </button>
    );
};
