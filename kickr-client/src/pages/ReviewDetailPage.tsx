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
import { TopTeamsWidget } from '../components/widgets/TopTeamsWidget';
import { TopReviewsWidget } from '../components/widgets/TopReviewsWidget';

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

    if (isReviewLoading) return <div className="min-h-screen bg-[#14181c] pt-32 flex justify-center"><div className="animate-pulse text-kickr text-[10px] font-black uppercase tracking-[0.4em] italic">Loading Tactical Report...</div></div>;
    if (!review) return <div className="min-h-screen bg-[#14181c] pt-32 flex justify-center"><div className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em] italic">Report not found</div></div>;

    return (
        <main className="min-h-screen bg-[#14181c] pt-20 md:pt-32 pb-16 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* HEAD HEADER */}
                <header className="mb-8 md:mb-16">
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="h-[1px] md:h-[2px] w-4 md:w-6 bg-kickr/40" />
                        <span className="text-[8px] md:text-[10px] font-black text-kickr/60 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Match Analysis</span>
                    </div>
                    <h1 className="text-2xl md:text-6xl font-black text-white mb-2 md:mb-4 italic tracking-tighter uppercase leading-none">
                        Tactical <span className="text-kickr/60">Review</span>
                    </h1>
                    <p className="text-white/20 uppercase tracking-[0.2em] md:tracking-[0.25em] text-[8px] md:text-[11px] font-black italic">
                        Detailed review of {review.match.homeTeam} vs {review.match.awayTeam} by {review.user.name}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Match Context Card */}
                        <Link to={`/matches/${review.match.id}`} className="block group">
                            <div className="bg-white/[0.01] border border-white/5 p-4 md:p-8 rounded-sm hover:border-kickr/20 transition-all relative overflow-hidden">
                                <div className="flex items-center justify-between gap-4 md:gap-8 relative z-10">
                                    <div className="flex items-center gap-3 md:gap-6">
                                        <img src={review.match.homeLogo} className="w-8 h-8 md:w-12 md:h-12 object-contain" alt="" />
                                        <div className="flex flex-col">
                                            <span className="text-sm md:text-xl font-black text-white italic group-hover:text-kickr transition-colors uppercase leading-none truncate max-w-[80px] md:max-w-none">{review.match.homeTeam}</span>
                                            <span className="text-[6px] md:text-[8px] uppercase tracking-widest text-white/10 font-black mt-0.5 md:mt-1 italic">OPERATIONAL</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span className="text-lg md:text-3xl font-black text-white italic tracking-tighter tabular-nums leading-none">
                                            {review.match.homeScore} - {review.match.awayScore}
                                        </span>
                                        <span className="text-[6px] md:text-[8px] font-black text-kickr/40 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-0.5 md:mt-1 italic">FINAL</span>
                                    </div>

                                    <div className="flex items-center gap-3 md:gap-6 text-right">
                                        <div className="flex flex-col">
                                            <span className="text-sm md:text-xl font-black text-white italic group-hover:text-kickr transition-colors uppercase leading-none truncate max-w-[80px] md:max-w-none">{review.match.awayTeam}</span>
                                            <span className="text-[6px] md:text-[8px] uppercase tracking-widest text-white/10 font-black mt-0.5 md:mt-1 italic">VISITOR</span>
                                        </div>
                                        <img src={review.match.awayLogo} className="w-8 h-8 md:w-12 md:h-12 object-contain" alt="" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Review Content */}
                        <section className="space-y-6 md:space-y-10">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2 md:pb-4">
                                <div className="flex items-center gap-2 md:gap-4">
                                    <Link to={`/user/${review.user.id}`} className="w-6 h-6 md:w-8 md:h-8 bg-white/[0.01] border border-white/5 rounded-sm flex items-center justify-center overflow-hidden hover:border-kickr/40 transition-colors">
                                        {review.user.avatarUrl ? <img src={review.user.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-kickr/60 text-[8px] md:text-[10px] font-black italic">{review.user.name[0]}</span>}
                                    </Link>
                                    <span className="text-[8px] md:text-[10px] font-black text-white/20 uppercase italic">Logged by <Link to={`/user/${review.user.id}`} className="text-white hover:text-kickr transition-colors">{review.user.name}</Link></span>
                                </div>
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="flex text-kickr text-[8px] md:text-[10px] tabular-nums">
                                        {'★'.repeat(Math.round(review.note))}
                                        <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                                    </div>
                                    <span className="text-[7px] md:text-[9px] font-black text-white/10 uppercase tracking-widest italic tabular-nums">{new Date(review.watchedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                                </div>
                            </div>

                            {review.comment && review.comment.trim() !== "" && (
                                <div className="relative">
                                    <p className="text-lg md:text-2xl font-black text-white/90 italic leading-relaxed border-l-[1px] md:border-l-2 border-kickr/40 pl-6 md:pl-10 py-1 md:py-2 uppercase font-medium">
                                        {review.comment}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-4 md:pt-6 border-t border-white/5">
                                <LikeButton reviewId={review.id} likesCount={review.likesCount} />
                                <div className="h-3 md:h-4 w-px bg-white/5"></div>
                                {currentUser?.id === review.user.id && (
                                    <button onClick={() => setShowConfirmDelete(true)} className="text-[8px] md:text-[9px] font-black text-white/10 hover:text-red-900 uppercase tracking-widest transition-colors italic">Delete Entry</button>
                                )}
                                {currentUser?.id !== review.user.id && (
                                    <button onClick={() => setReportConfig({ id: review.id, type: 'MATCH_REVIEW' })} className="text-[8px] md:text-[9px] font-black text-white/10 hover:text-red-900 uppercase tracking-widest transition-colors italic">Report Review</button>
                                )}
                            </div>
                        </section>

                        {/* Comments */}
                        <section className="pt-10 md:pt-20">
                            <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/20 italic mb-6 md:mb-10">Responses ({comments?.length || 0})</h3>

                            <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                                {comments?.map(comment => (
                                    <div key={comment.id} className="group flex gap-4 md:gap-6 p-3 md:p-4 hover:bg-white/[0.01] border-b border-white/5 transition-all">
                                        <div className="w-7 h-7 md:w-8 md:h-8 bg-white/[0.01] border border-white/5 rounded-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {comment.userAvatarUrl ? <img src={comment.userAvatarUrl} className="w-full h-full object-cover" /> : <span className="text-kickr/20 text-[8px] md:text-[9px] font-black italic">{comment.userName[0]}</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1 md:mb-2 text-right">
                                                <span className="text-[9px] md:text-[10px] font-black text-white/40 uppercase italic">{comment.userName}</span>
                                                <span className="text-[7px] md:text-[9px] font-black text-white/10 uppercase tracking-widest tabular-nums italic">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-[10px] md:text-[11px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors italic uppercase font-medium">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {currentUser && (
                                <form onSubmit={handleAddComment} className="bg-white/[0.01] border border-white/5 p-4 md:p-8 rounded-sm">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="ADD RESPONSE..."
                                        className="w-full bg-transparent border border-white/5 rounded-sm p-3 md:p-4 text-[10px] md:text-[11px] font-black text-white placeholder-white/5 focus:border-kickr/20 transition-all outline-none resize-none h-20 md:h-24 mb-4 md:mb-6 uppercase italic tracking-widest"
                                    />
                                    <div className="flex justify-end">
                                        <button disabled={!commentText.trim() || addCommentMutation.isPending} className="px-6 md:px-8 py-2 md:py-3 bg-white/[0.02] border border-white/5 text-white/40 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-sm hover:text-white hover:border-kickr/40 transition-all disabled:opacity-5 italic">Transmit</button>
                                    </div>
                                </form>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8 md:space-y-12">
                        <section className="bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-sm">
                            <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-white/5 pb-4 md:pb-6">
                                <h3 className="text-[8px] md:text-[10px] font-black text-kickr/60 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Match Summary</h3>
                                <span className="text-[6px] md:text-[8px] font-black text-white/10 uppercase tracking-widest italic leading-none">MATCHLOG</span>
                            </div>
                            <div className="space-y-6">
                                <ShareReviewButton review={review} variant="full" />
                            </div>
                        </section>

                        <TopTeamsWidget />
                        <TopReviewsWidget />
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
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#14181c]/90 backdrop-blur-sm">
                        <div className="bg-[#1b2228] border border-white/10 p-12 rounded-sm max-w-sm w-full text-center">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">Terminate Record?</h3>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-10">This tactical data will be permanently erased from the network.</p>
                            <div className="flex gap-4">
                                <button onClick={handleDeleteReview} className="flex-1 py-4 bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-red-500/30 transition-all">Confirm Erase</button>
                                <button onClick={() => setShowConfirmDelete(false)} className="flex-1 py-4 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:text-white transition-all">Abort</button>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
};

const LikeButton: FC<{ reviewId: string; likesCount: number }> = ({ reviewId, likesCount }) => {
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
            className={`flex items-center gap-2 md:gap-3 transition-all ${isLikedByMe ? 'text-kickr' : 'text-white/10 hover:text-white'}`}
        >
            <span className="text-lg md:text-xl">{isLikedByMe ? '❤' : '❤'}</span>
            <div className="flex flex-col items-start leading-none">
                <span className={`text-[10px] md:text-[11px] font-black italic tabular-nums leading-none ${isLikedByMe ? 'text-kickr' : 'text-white/40'}`}>{likesCount || 0}</span>
                <span className="text-[6px] md:text-[7px] font-black uppercase tracking-widest mt-0.5">Supports</span>
            </div>
        </button>
    );
};
