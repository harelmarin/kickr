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
        <main className="min-h-screen bg-[#14181c] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEAD HEADER */}
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[2px] w-6 bg-kickr" />
                        <span className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Tactical Dispatch</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase leading-none">
                        Tactical <span className="text-kickr">Review</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.25em] text-[11px] font-bold">
                        Detailed review of {review.match.homeTeam} vs {review.match.awayTeam} by {review.user.name}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Match Context Card */}
                        <Link to={`/matches/${review.match.id}`} className="block group">
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm hover:border-kickr/20 transition-all relative overflow-hidden">
                                <div className="flex items-center justify-between gap-8 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <img src={review.match.homeLogo} className="w-12 h-12 object-contain" alt="" />
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black text-white italic group-hover:text-kickr transition-colors uppercase leading-none">{review.match.homeTeam}</span>
                                            <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold mt-1">Home Team</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-black text-white italic tracking-tighter">
                                            {review.match.homeScore} - {review.match.awayScore}
                                        </span>
                                        <span className="text-[8px] font-mono text-kickr uppercase tracking-[0.3em] mt-1 italic">Full Time</span>
                                    </div>

                                    <div className="flex items-center gap-6 text-right">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black text-white italic group-hover:text-kickr transition-colors uppercase leading-none">{review.match.awayTeam}</span>
                                            <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold mt-1">Visitor</span>
                                        </div>
                                        <img src={review.match.awayLogo} className="w-12 h-12 object-contain" alt="" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Review Content */}
                        <section className="space-y-10">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="flex items-center gap-4">
                                    <Link to={`/user/${review.user.id}`} className="w-8 h-8 bg-kickr/10 border border-white/5 rounded-sm flex items-center justify-center overflow-hidden hover:border-kickr/40 transition-colors">
                                        {review.user.avatarUrl ? <img src={review.user.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-kickr text-[10px] font-black italic">{review.user.name[0]}</span>}
                                    </Link>
                                    <span className="text-[10px] font-black text-white/60 uppercase italic">Dispatch by <Link to={`/user/${review.user.id}`} className="text-white hover:text-kickr transition-colors">{review.user.name}</Link></span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex text-kickr text-[10px]">
                                        {'★'.repeat(Math.round(review.note))}
                                        <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{new Date(review.watchedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                                </div>
                            </div>

                            {review.comment && review.comment.trim() !== "" && (
                                <div className="relative">
                                    <p className="text-xl md:text-2xl font-black text-white/90 italic leading-relaxed border-l-2 border-kickr pl-10 py-2">
                                        "{review.comment}"
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                <LikeButton reviewId={review.id} likesCount={review.likesCount} />
                                <div className="h-4 w-px bg-white/5"></div>
                                {currentUser?.id === review.user.id && (
                                    <button onClick={() => setShowConfirmDelete(true)} className="text-[9px] font-black text-white/20 hover:text-red-500 uppercase tracking-widest transition-colors">Terminate Record</button>
                                )}
                                {currentUser?.id !== review.user.id && (
                                    <button onClick={() => setReportConfig({ id: review.id, type: 'MATCH_REVIEW' })} className="text-[9px] font-black text-white/20 hover:text-red-500 uppercase tracking-widest transition-colors">Report Incident</button>
                                )}
                            </div>
                        </section>

                        {/* Comments */}
                        <section className="pt-20">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90 italic mb-10">Responses ({comments?.length || 0})</h3>

                            <div className="space-y-6 mb-12">
                                {comments?.map(comment => (
                                    <div key={comment.id} className="group flex gap-6 p-4 hover:bg-white/[0.02] border-b border-white/[0.03] transition-all">
                                        <div className="w-8 h-8 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {comment.userAvatarUrl ? <img src={comment.userAvatarUrl} className="w-full h-full object-cover" /> : <span className="text-kickr/40 text-[9px] font-black">{comment.userName[0]}</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black text-white uppercase italic">{comment.userName}</span>
                                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-[11px] text-white/60 leading-relaxed group-hover:text-white transition-colors">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {currentUser && (
                                <form onSubmit={handleAddComment} className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add response..."
                                        className="w-full bg-black/40 border border-white/5 rounded-sm p-4 text-[11px] font-bold text-white placeholder-white/20 focus:border-kickr/40 transition-all outline-none resize-none h-24 mb-6"
                                    />
                                    <div className="flex justify-end">
                                        <button disabled={!commentText.trim() || addCommentMutation.isPending} className="px-8 py-3 bg-kickr text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30">Post</button>
                                    </div>
                                </form>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-12">
                        <section className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Review Poster</h3>
                                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Visual Summary</span>
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
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
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
            className={`flex items-center gap-3 transition-all ${isLikedByMe ? 'text-kickr' : 'text-white/20 hover:text-white'}`}
        >
            <span className="text-xl">👍</span>
            <div className="flex flex-col items-start">
                <span className={`text-[11px] font-black italic leading-none ${isLikedByMe ? 'text-kickr' : 'text-white'}`}>{likesCount || 0}</span>
                <span className="text-[7px] font-black uppercase tracking-widest">Supports</span>
            </div>
        </button>
    );
};
