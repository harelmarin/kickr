import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { matchService } from '../services/matchService';
import { useAuth } from '../hooks/useAuth';
import { useCreateUserMatch, useUserMatchesByMatch, useDeleteUserMatch } from '../hooks/useUserMatch';
import { useReviewLikeStatus, useToggleReviewLike } from '../hooks/useReviewLikes';
import { ShareReviewButton } from '../components/review/ShareReviewButton';
import type { UserMatch } from '../types/userMatch';
import { AnimatePresence } from 'framer-motion';

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [sortBy, setSortBy] = useState<'watchedAt' | 'likesCount'>('watchedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'lineups' | 'stats' | 'events'>('lineups');
  const [lineupView, setLineupView] = useState<'visual' | 'list'>('visual');
  const [justLoggedReview, setJustLoggedReview] = useState<UserMatch | null>(null);

  const { data: match, isLoading, isError } = useQuery({
    queryKey: ['match', id],
    queryFn: () => matchService.fetchMatchById(id!),
    enabled: !!id,
  });

  const { data: userMatches } = useUserMatchesByMatch(match?.matchUuid || '', sortBy, sortDirection);
  const createUserMatch = useCreateUserMatch();

  const myMatchEntries = userMatches?.filter(m => m.user.id === user?.id) || [];
  const hasAlreadyLogged = myMatchEntries.length > 0;

  const handleSaveRating = async () => {
    if (!user) {
      toast.error('You need to be logged in to log matches', {
        duration: 4000,
        position: 'top-center',
      });
      setTimeout(() => {
        navigate('/register');
      }, 500);
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating (stars)');
      return;
    }

    if (!match || !match.matchUuid) {
      console.warn('Match data incomplete:', { match });
      toast.error('Match data is incomplete. Please try refreshing the page.');
      return;
    }

    try {
      const newLog = await createUserMatch.mutateAsync({
        userId: user.id,
        matchId: match.matchUuid,
        note: rating,
        comment: review,
        isLiked: isLiked,
      });

      setJustLoggedReview(newLog);
      toast.success(hasAlreadyLogged ? 'Additional log recorded!' : 'Match logged successfully!');

      setRating(0);
      setReview('');
      setIsLiked(false);
    } catch (error: any) {
      console.error('Error saving rating:', error);
      toast.error(error.response?.data?.message || 'Failed to record log');
    }
  };


  if (isLoading) return <LoadingState />;
  if (isError || !match) return <ErrorState />;

  const matchDate = new Date(match.matchDate);
  const isPast = match.homeScore !== null;

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-[#99aabb]">
      <div className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0 flex">
          <div className="flex-1 relative overflow-hidden">
            <img src={match.homeLogo} className="absolute inset-0 w-full h-full object-cover scale-150 opacity-20 grayscale" alt="" />
          </div>
          <div className="flex-1 relative overflow-hidden">
            <img src={match.awayLogo} className="absolute inset-0 w-full h-full object-cover scale-150 opacity-20 grayscale" alt="" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-[#0a0b0d]/70 to-[#0a0b0d]/40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-[500px] relative z-10 pb-20">
        <div className="flex items-center gap-6 mb-8">
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-kickr transition-colors flex items-center gap-2 group">
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            Back to Feed
          </Link>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
            <span>Matches</span>
            <span>/</span>
            <span className="text-white/60">{match.homeTeam} vs {match.awayTeam}</span>
          </div>
        </div>

        <header className="mb-12 md:mb-20">
          <div className="min-h-[300px] md:aspect-[4/1] bg-[#14181c]/60 backdrop-blur-3xl rounded-3xl overflow-hidden border border-white/5 relative flex items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent"></div>

            <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center px-6 sm:px-8 md:px-16 py-12 md:py-6 gap-8 md:gap-12 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 justify-self-start w-full overflow-hidden">
                <Link to={`/teams/${match.homeTeamId}`} className="transition-all active:scale-95 duration-500 flex-shrink-0 group/logo">
                  <div className="p-3 md:p-4 rounded-full bg-white/[0.02] border border-white/5 group-hover/logo:border-kickr/40 transition-all shadow-2xl">
                    <img src={match.homeLogo} alt={match.homeTeam} className="w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 object-contain group-hover/logo:scale-110 transition-transform duration-500" />
                  </div>
                </Link>
                <div className="flex flex-col items-center md:items-start flex-1 min-w-0">
                  <Link to={`/teams/${match.homeTeamId}`} className="group/home max-w-full">
                    <span className="text-white font-black uppercase italic tracking-[0.1em] text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight group-hover/home:text-kickr transition-colors block text-center md:text-left break-words">
                      {match.homeTeam}
                    </span>
                  </Link>
                  <div className="flex items-center gap-2 mt-2 md:mt-4 w-full">
                    <span className="text-kickr text-[9px] font-black uppercase tracking-[0.4em] italic whitespace-nowrap">Host Team</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-kickr/40 to-transparent"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center order-first md:order-none">
                {isPast ? (
                  <div className="flex flex-col items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-6 md:gap-10">
                      <span className="text-4xl sm:text-6xl md:text-8xl font-black text-white italic leading-none tabular-nums drop-shadow-2xl">{match.homeScore}</span>
                      <div className="w-[2px] h-10 md:h-20 bg-white/10 rounded-full"></div>
                      <span className="text-4xl sm:text-6xl md:text-8xl font-black text-white italic leading-none tabular-nums drop-shadow-2xl">{match.awayScore}</span>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-kickr/10 border border-kickr/30">
                      <span className="text-kickr text-[9px] font-black uppercase tracking-[0.3em]">Final result</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-kickr font-black italic tracking-tighter text-5xl md:text-7xl">VS</div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-2 md:mt-4">Upcoming</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row-reverse items-center gap-2 md:gap-6 justify-self-end w-full overflow-hidden">
                <Link to={`/teams/${match.awayTeamId}`} className="transition-all active:scale-95 duration-500 flex-shrink-0 group/logo">
                  <div className="p-3 md:p-4 rounded-full bg-white/[0.02] border border-white/5 group-hover/logo:border-kickr/40 transition-all shadow-2xl">
                    <img src={match.awayLogo} alt={match.awayTeam} className="w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 object-contain group-hover/logo:scale-110 transition-transform duration-500" />
                  </div>
                </Link>
                <div className="flex flex-col items-center md:items-end flex-1 min-w-0">
                  <Link to={`/teams/${match.awayTeamId}`} className="group/away max-w-full">
                    <span className="text-white font-black uppercase italic tracking-[0.1em] text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight group-hover/away:text-kickr transition-colors block text-center md:text-right break-words">
                      {match.awayTeam}
                    </span>
                  </Link>
                  <div className="flex items-center gap-2 mt-2 md:mt-4 w-full justify-end">
                    <div className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent"></div>
                    <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] italic whitespace-nowrap">Visitor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between px-4 border-b border-white/5 pb-8">
            <div className="flex items-center gap-8 md:gap-12 overflow-x-auto overflow-y-hidden no-scrollbar">
              <div className="flex flex-col flex-shrink-0">
                <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Competition</span>
                <Link to={match.competitionId ? `/competitions/${match.competitionId}` : '#'} className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors flex-shrink-0">
                    <img src={match.competitionLogo} alt={match.competition} className="w-3.5 h-3.5 object-contain filter drop-shadow opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-white text-xs font-bold uppercase tracking-widest group-hover:text-kickr transition-colors whitespace-nowrap leading-none">
                    {match.competition || 'Unknown League'}
                  </span>
                </Link>
              </div>
              <div className="w-px h-8 bg-white/5 hidden sm:block"></div>
              <div className="flex flex-col flex-shrink-0">
                <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Venue & Location</span>
                <span className="text-[#99aabb] text-xs font-bold uppercase tracking-widest whitespace-nowrap">{match.location || 'Stadium'}</span>
              </div>
              <div className="w-px h-8 bg-white/5 hidden sm:block"></div>
              <div className="flex flex-col flex-shrink-0">
                <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-1">Match Date</span>
                <span className="text-[#99aabb] text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                  {matchDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  <span className="text-kickr ml-3 border-l border-white/10 pl-3">
                    {matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="flex-1 order-2 lg:order-1">
            <header className="mb-12">
              <div className="flex flex-col md:flex-row md:items-end gap-12 mb-8 pt-2">
                <div className="flex flex-col">
                  {match.averageRating && match.averageRating > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-4">Community Consensus</span>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center justify-center bg-kickr/[0.03] border border-kickr/10 w-24 h-24 rounded-2xl">
                          <span className="text-4xl font-black text-white italic leading-none">{match.averageRating.toFixed(1)}</span>
                          <div className="flex text-kickr text-[10px] mt-2">
                            {'★'.repeat(Math.round(match.averageRating))}
                          </div>
                        </div>

                        {/* Rating Distribution Histogram */}
                        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                          {[5, 4, 3, 2, 1].map(star => {
                            const count = userMatches?.filter(m => Math.round(m.note) === star).length || 0;
                            const total = userMatches?.length || 1;
                            const percentage = (count / total) * 100;
                            return (
                              <div key={star} className="flex items-center gap-3">
                                <span className="text-[9px] font-bold text-[#445566] w-2">{star}</span>
                                <div className="flex-1 h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    className="h-full bg-gradient-to-r from-kickr/40 to-kickr rounded-full"
                                  />
                                </div>
                                <span className="text-[9px] font-bold text-[#445566] w-6 text-right">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-2">Community Consensus</span>
                      <span className="text-[10px] font-bold text-[#445566] uppercase tracking-widest bg-white/[0.02] border border-white/5 px-4 py-2 rounded-lg italic">Awaiting community intel...</span>
                    </div>
                  )}
                </div>

                {/* User's Tactical History - if logged */}
                {hasAlreadyLogged && (
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-4">Your Tactical History</span>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                      {myMatchEntries.sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()).map((entry) => (
                        <Link key={entry.id} to={`/reviews/${entry.id}`} className="block p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:border-kickr/20 transition-all group/entry">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex text-kickr text-[8px]">
                              {'★'.repeat(Math.round(entry.note))}
                              <span className="text-white/5">{'★'.repeat(5 - Math.round(entry.note))}</span>
                            </div>
                            <span className="text-[8px] font-black text-[#445566] uppercase tracking-tighter">
                              {new Date(entry.watchedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          {entry.comment && (
                            <p className="text-[#8899aa] text-[10px] italic leading-tight line-clamp-1 opacity-60 group-hover/entry:opacity-100 transition-opacity">
                              "{entry.comment}"
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>



            <div className="mt-8">
              <div className="flex items-center gap-8 border-b border-white/5 mb-8">
                {['lineups', 'stats', 'events'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-kickr' : 'text-[#445566] hover:text-white'
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-kickr"></div>
                    )}
                  </button>
                ))}
              </div>

              {activeTab === 'lineups' && (
                <LineupsSection
                  lineups={match.lineups}
                  viewMode={lineupView}
                  onToggleView={(view: 'visual' | 'list') => setLineupView(view)}
                />
              )}
              {activeTab === 'stats' && <StatsSection lineups={match.lineups} stats={match.stats} homeTeam={match.homeTeam} homeLogo={match.homeLogo} homeTeamId={match.homeTeamId} awayTeam={match.awayTeam} awayLogo={match.awayLogo} awayTeamId={match.awayTeamId} />}
              {activeTab === 'events' && (
                <EventsSection
                  events={match.events}
                  homeTeamId={match.homeTeamExternalId}
                  homeTeamName={match.homeTeam}
                />
              )}
            </div>

            {/* Community Reviews Section */}
            <section className="mt-16 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xs font-bold text-[#667788] uppercase tracking-[0.2em]">
                  COMMUNITY REVIEWS ({userMatches?.length || 0})
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-[#1b2228] border border-white/10 rounded-lg px-3 py-2">
                    <span className="text-[10px] font-bold text-[#667788] uppercase tracking-wider">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'watchedAt' | 'likesCount')}
                      className="bg-transparent text-white text-xs font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
                    >
                      <option value="watchedAt">Date</option>
                      <option value="likesCount">Likes</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
                    className="bg-[#1b2228] border border-white/10 text-white text-sm px-3 py-2 rounded-lg hover:border-kickr/50 transition-all"
                    title={sortDirection === 'desc' ? 'Descending' : 'Ascending'}
                  >
                    {sortDirection === 'desc' ? '↓' : '↑'}
                  </button>
                </div>
              </div>
              {userMatches && userMatches.length > 0 ? (
                <div className="space-y-8">
                  {userMatches.map((userMatch) => (
                    <ReviewItem
                      key={userMatch.id}
                      review={userMatch}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[#667788] text-sm italic">No reviews yet. Be the first to review this match!</p>
              )}
            </section>
          </div>

          {/* Right: Actions Sidebar (The Letterboxd Box) */}
          <div className="w-full lg:w-[320px] flex-shrink-0 order-1 lg:order-2">
            <div className="bg-[#1b2228] border border-white/10 rounded-lg overflow-hidden shadow-xl sticky top-24">
              <div className="p-6 bg-[#2c3440] border-b border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#8899aa] uppercase tracking-widest leading-none">
                      {hasAlreadyLogged ? 'Tactical History' : 'Log Match'}
                    </span>
                    {hasAlreadyLogged ? (
                      <div className="flex items-center gap-2">
                        <span className="text-kickr text-[10px]">●</span>
                        <span className="text-white font-bold text-xs uppercase tracking-tight">
                          {myMatchEntries.length} Tactical Log(s) recorded
                        </span>
                      </div>
                    ) : (
                      <span className="text-white font-bold text-xs uppercase tracking-tight">
                        {matchDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`text-lg transition-all ${isLiked ? 'text-[#ff8000]' : 'text-[#445566] hover:text-white'}`}
                >
                  ❤
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Rating Star Picker */}
                <div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`text-4xl transition-all duration-200 ${star <= (hoveredRating || rating) ? 'text-kickr' : 'text-[#445566]'
                          }`}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-[10px] font-bold text-[#667788] uppercase tracking-widest">
                    {hasAlreadyLogged ? 'Log a new tactical session' : 'Rate this match'}
                  </div>
                </div>

                {/* Review Text Area */}
                <div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Add a review..."
                    className="w-full bg-[#14181c] border border-white/10 rounded p-4 text-sm text-white focus:outline-none focus:border-white/30 h-40 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleSaveRating}
                  disabled={rating === 0 || createUserMatch.isPending}
                  className="w-full py-3 rounded text-[11px] font-bold hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-primary-kickr"
                >
                  {createUserMatch.isPending ? 'LOGGING...' : hasAlreadyLogged ? 'LOG AGAIN' : 'SAVE LOG'}
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {justLoggedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1b2228] border border-white/10 rounded-3xl p-10 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-kickr"></div>
              <button
                onClick={() => setJustLoggedReview(null)}
                className="absolute top-6 right-6 text-[#445566] hover:text-white transition-colors text-xl font-bold"
              >
                ✕
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-kickr/10 rounded-full flex items-center justify-center mb-8 border border-kickr/30">
                  <span className="text-4xl">⚽</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-3 leading-none">Intelligence Logged</h3>
                <p className="text-[#99aabb] text-[13px] mb-10 leading-relaxed font-medium">
                  Your tactical report is now part of the Kickr network. Generate your card to share your session on social media!
                </p>

                <div className="w-full space-y-4">
                  <div className="flex justify-center">
                    <ShareReviewButton review={justLoggedReview} variant="full" showXShare={true} />
                  </div>
                  <button
                    onClick={() => setJustLoggedReview(null)}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#445566] hover:text-white transition-all bg-white/[0.02] rounded-xl hover:bg-white/[0.05]"
                  >
                    Return to Match
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

const ReviewItem = ({ review }: { review: UserMatch }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { data: isLikedByMe } = useReviewLikeStatus(review.id, currentUser?.id);
  const toggleLike = useToggleReviewLike();
  const deleteUserMatch = useDeleteUserMatch();

  const handleLike = () => {
    if (!currentUser) {
      toast.error('You need to be logged in to like reviews', {
        duration: 4000,
        position: 'top-center',
      });
      setTimeout(() => {
        navigate('/register');
      }, 500);
      return;
    }
    toggleLike.mutate({ reviewId: review.id, userId: currentUser.id });
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove this tactical log? This action is permanent.')) return;
    try {
      await deleteUserMatch.mutateAsync(review.id);
      toast.success('Log removed');
    } catch (error) {
      toast.error('Failed to remove log');
    }
  };

  return (
    <div className="flex gap-4 border-b border-white/5 pb-8 group/review">
      <div className="w-10 h-10 rounded-full bg-[#2c3440] flex-shrink-0 flex items-center justify-center text-[10px] text-white font-black uppercase overflow-hidden border border-white/5">
        {review.user.avatarUrl ? (
          <img src={review.user.avatarUrl} alt={review.user.name} className="w-full h-full object-cover" />
        ) : (
          review.user.name[0]
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/user/${review.user.id}`} className="text-white font-bold hover:text-kickr transition-colors">{review.user.name}</Link>
          <span className="text-kickr font-bold text-xs pl-2 border-l border-white/10 ml-2">
            {'★'.repeat(Math.round(review.note))}
            <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
          </span>
          {review.isLiked === true && (
            <span className="text-[#ff8000] text-sm ml-1" title="Liked">❤</span>
          )}
          {review.watchedAt && (
            <Link to={`/reviews/${review.id}`} className="text-[#667788] text-[9px] font-black uppercase tracking-widest ml-auto hover:text-kickr transition-colors">
              {new Date(review.watchedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </Link>
          )}
        </div>
        {review.comment && review.comment.trim() !== "" && (
          <Link to={`/reviews/${review.id}`} className="block group/comment">
            <p className="text-sm leading-relaxed text-[#99aabb] italic group-hover/comment:text-white transition-colors">"{review.comment}"</p>
            <span className="text-[10px] font-black text-kickr/40 uppercase tracking-widest mt-2 block group-hover/comment:text-kickr transition-colors">Detailed Log View →</span>
          </Link>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs transition-all ${isLikedByMe
                ? 'text-kickr'
                : 'text-[#667788] hover:text-kickr'
                }`}
              title={isLikedByMe ? 'Unlike' : 'Like this review'}
            >
              <span className="text-base">{isLikedByMe ? '👍' : '👍'}</span>
              {review.likesCount && review.likesCount > 0 && (
                <span className="font-bold">{review.likesCount}</span>
              )}
            </button>

            <div className="opacity-0 group-hover/review:opacity-100 transition-opacity">
              <ShareReviewButton review={review} />
            </div>
          </div>

          {currentUser?.id === review.user.id && (
            <button
              onClick={handleDelete}
              disabled={deleteUserMatch.isPending}
              className="text-[10px] font-bold text-[#445566] hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              {deleteUserMatch.isPending ? 'Removing...' : 'Delete Log'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const LineupsSection = ({ lineups, viewMode, onToggleView }: any) => {
  if (!lineups || lineups.length === 0) return <p className="text-[#445566] text-sm italic">Lineups not available for this match.</p>;

  return (
    <div className="space-y-8">
      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="bg-[#1b2228] p-1 rounded-lg border border-white/5 flex gap-1">
          <button
            onClick={() => onToggleView('visual')}
            className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'visual' ? 'bg-kickr text-[#0a0b0d]' : 'text-[#445566] hover:text-white'}`}
          >
            Tactical
          </button>
          <button
            onClick={() => onToggleView('list')}
            className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-kickr text-[#0a0b0d]' : 'text-[#445566] hover:text-white'}`}
          >
            List
          </button>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {lineups.map((teamLineup: any, idx: number) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-4">
                  <img src={teamLineup.team.logo} alt={teamLineup.team.name} className="w-8 h-8 object-contain" />
                  <div>
                    <h3 className="text-white font-black text-sm uppercase italic tracking-tighter leading-none">{teamLineup.team.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-kickr text-[10px] font-bold uppercase tracking-[0.2em]">{teamLineup.formation}</p>
                      {teamLineup.coach && (
                        <>
                          <span className="text-[#445566] text-[8px]">•</span>
                          <div className="flex items-center gap-1">
                            <span className="text-lg leading-none">👔</span>
                            <span className="text-[#8899aa] text-[9px] font-bold uppercase tracking-wider">{teamLineup.coach.name}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <TacticalPitch teamLineup={teamLineup} />

              {/* Subs below the pitch in visual mode but compact */}
              {teamLineup.substitutes && (
                <div className="bg-[#1b2228]/30 rounded-xl p-4 border border-white/5">
                  <span className="text-[9px] font-black text-[#556677] uppercase tracking-[0.2em] mb-3 block">Available Subs</span>
                  <div className="flex flex-wrap gap-2">
                    {teamLineup.substitutes.map((player: any) => (
                      <div key={player.player.id} className="bg-white/[0.03] px-2 py-1 rounded text-[10px] text-[#8899aa] border border-white/5">
                        <span className="text-kickr font-bold mr-1">{player.player.number}</span> {player.player.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lineups.map((teamLineup: any, idx: number) => (
            <div key={idx} className="bg-[#1b2228] border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <img src={teamLineup.team.logo} alt={teamLineup.team.name} className="w-8 h-8 object-contain" />
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">{teamLineup.team.name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-kickr text-[10px] font-bold uppercase tracking-widest">{teamLineup.formation}</p>
                    {teamLineup.coach && (
                      <>
                        <span className="text-[#445566] text-[8px]">•</span>
                        <span className="text-[#8899aa] text-[9px] font-bold uppercase tracking-wider">Coach: {teamLineup.coach.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-[9px] font-black text-[#556677] uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-1">Starting XI</div>
                  <div className="grid grid-cols-1 gap-1">
                    {teamLineup.startXI.map((player: any) => (
                      <div key={player.player.id} className="flex items-center justify-between text-xs py-1.5 transition-colors hover:bg-white/[0.02] px-2 rounded">
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-kickr font-bold text-[10px] tabular-nums">{player.player.number}</span>
                          <span className="text-[#99aabb] font-medium">{player.player.name}</span>
                        </div>
                        <span className="text-[#445566] text-[9px] uppercase font-black tracking-tighter bg-white/5 px-1.5 rounded">{player.player.pos}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {teamLineup.substitutes && teamLineup.substitutes.length > 0 && (
                  <div>
                    <div className="text-[9px] font-black text-[#556677] uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-1">Substitutes</div>
                    <div className="grid grid-cols-1 gap-1 opacity-70">
                      {teamLineup.substitutes.map((player: any) => (
                        <div key={player.player.id} className="flex items-center justify-between text-xs py-1.5 transition-colors hover:bg-white/[0.02] px-2 rounded">
                          <div className="flex items-center gap-3">
                            <span className="w-5 text-[#556677] font-bold text-[10px] tabular-nums">{player.player.number}</span>
                            <span className="text-[#8899aa]">{player.player.name}</span>
                          </div>
                          <span className="text-[#445566] text-[9px] uppercase font-black tracking-tighter">{player.player.pos}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TacticalPitch = ({ teamLineup }: { teamLineup: any }) => {
  return (
    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Grass Texture & Lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a2a] to-[#142820]">
        {/* Pitch Lines */}
        <div className="absolute inset-4 border border-white/20 rounded-sm">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          {/* Penalty Areas */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-b border-x border-white/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-t border-x border-white/10" />
        </div>
      </div>

      {/* Players */}
      <div className="absolute inset-4 py-8 px-4 grid grid-rows-5 h-full">
        {renderTacticalPlayers(teamLineup.startXI)}
      </div>
    </div>
  );
};

const renderTacticalPlayers = (players: any[]) => {
  // Group players by their grid row (1 to 5)
  // API Football grid is "row:col", e.g. "1:1" for GK
  const groupedPlayers: { [key: number]: any[] } = {};

  players.forEach(p => {
    const [row] = (p.player.grid || "1:1").split(':').map(Number);
    if (!groupedPlayers[row]) groupedPlayers[row] = [];
    groupedPlayers[row].push(p);
  });

  return Object.keys(groupedPlayers).sort((a, b) => Number(a) - Number(b)).map(rowKey => {
    const row = Number(rowKey);
    const rowPlayers = groupedPlayers[row];

    return (
      <div key={row} className="flex justify-around items-center w-full">
        {rowPlayers.map((p: any) => (
          <div key={p.player.id} className="flex flex-col items-center gap-1.5 group/player w-16">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-black/60 border-2 border-kickr flex items-center justify-center group-hover/player:scale-110 group-hover/player:bg-kickr transition-all duration-300">
                <span className="text-[11px] font-black text-white flex items-center justify-center leading-none group-hover/player:text-[#0a0b0d] tabular-nums">
                  {p.player.number}
                </span>
              </div>
            </div>
            <div className="w-full text-center">
              <span className="text-[9px] font-bold text-white whitespace-nowrap uppercase tracking-tighter bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-md group-hover/player:bg-white group-hover/player:text-black transition-colors inline-block">
                {p.player.name.split(' ').pop()}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  });
};

const StatsSection = ({ stats, homeTeam, homeLogo, homeTeamId, awayTeam, awayLogo, awayTeamId }: any) => {
  if (!stats || stats.length === 0) return <p className="text-[#445566] text-sm italic">Statistics not available.</p>;

  // Display priority for statistics
  const prioritizedStats = [
    "Ball Possession",
    "Total Shots",
    "Shots on Goal",
    "Shots off Goal",
    "Blocked Shots",
    "Corner Kicks",
    "Offsides",
    "Fouls",
    "Yellow Cards",
    "Red Cards",
    "Goalkeeper Saves",
    "Total passes",
    "Passes accurate",
    "Passes %",
    "Expected Goals"
  ];

  const homeStats = stats[0].statistics;
  const awayStats = stats[1].statistics;

  // Filter and sort stats based on our priority
  const availableStats = prioritizedStats.filter(type =>
    homeStats.some((s: any) => s.type === type) ||
    awayStats.some((s: any) => s.type === type)
  );

  return (
    <div className="space-y-8 bg-[#1b2228]/50 border border-white/5 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
      <div className="flex justify-between items-center pb-8 border-b border-white/5 mb-4">
        <Link to={`/teams/${homeTeamId}`} className="flex items-center gap-3 group/team hover:bg-white/[0.03] p-2 -m-2 rounded-xl transition-all">
          <img src={homeLogo} alt="" className="w-8 h-8 object-contain group-hover/team:scale-110 transition-transform" />
          <span className="text-white font-black uppercase italic tracking-tighter text-sm hidden sm:block group-hover/team:text-kickr transition-colors">{homeTeam}</span>
        </Link>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-kickr/40 italic">Match Intel</div>
        <Link to={`/teams/${awayTeamId}`} className="flex items-center gap-3 group/team hover:bg-white/[0.03] p-2 -m-2 rounded-xl transition-all">
          <span className="text-white font-black uppercase italic tracking-tighter text-sm hidden sm:block group-hover/team:text-kickr transition-colors">{awayTeam}</span>
          <img src={awayLogo} alt="" className="w-8 h-8 object-contain group-hover/team:scale-110 transition-transform" />
        </Link>
      </div>
      {availableStats.map((type: string) => {
        const hStat = homeStats.find((s: any) => s.type === type);
        const aStat = awayStats.find((s: any) => s.type === type);

        const homeVal = hStat?.value ?? 0;
        const awayVal = aStat?.value ?? 0;

        const hNum = parseFloat(String(homeVal).replace('%', '')) || 0;
        const aNum = parseFloat(String(awayVal).replace('%', '')) || 0;

        let homePercent = 50;
        if (hNum + aNum > 0) {
          homePercent = (hNum / (hNum + aNum)) * 100;
        }

        return (
          <div key={type} className="group">
            <div className="flex justify-between items-end mb-2.5 px-1">
              <span className={`text-sm font-black italic tabular-nums ${hNum > aNum ? 'text-kickr' : 'text-white'}`}>{homeVal}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#556677] group-hover:text-[#8899aa] transition-colors">{type}</span>
              <span className={`text-sm font-black italic tabular-nums ${aNum > hNum ? 'text-kickr' : 'text-white'}`}>{awayVal}</span>
            </div>
            <div className="h-1.5 w-full flex rounded-full overflow-hidden bg-white/[0.03] relative">
              <div
                style={{ width: `${homePercent}%` }}
                className={`h-full transition-all duration-1000 ease-out ${hNum >= aNum ? 'bg-kickr shadow-[0_0_12px_rgba(0,225,120,0.4)]' : 'bg-[#445566]'}`}
              />
              <div
                style={{ width: `${100 - homePercent}%` }}
                className={`h-full transition-all duration-1000 ease-out ${aNum > hNum ? 'bg-kickr shadow-[0_0_12px_rgba(0,225,120,0.4)]' : 'bg-[#1b2228]'}`}
              />
              {/* Point de rupture discret */}
              <div className="absolute top-0 bottom-0 w-px bg-white/20 z-10" style={{ left: `${homePercent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const EventsSection = ({ events, homeTeamId, homeTeamName }: any) => {
  if (!events || events.length === 0) return <p className="text-[#445566] text-sm italic">Match events not available.</p>;

  return (
    <div className="relative py-10 max-w-3xl mx-auto">
      {/* Central Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />

      <div className="space-y-8 relative">
        {events.map((event: any, idx: number) => {
          // Double check with ID and Name for maximum compatibility
          const isHome = String(event.team.id) === String(homeTeamId) ||
            event.team.name === homeTeamName;

          return (
            <div key={idx} className="relative flex items-center">
              {/* Event Content - Home Side (Left) */}
              <div className="flex-1 pr-12 text-right">
                {isHome && (
                  <div className="inline-block group">
                    <div className="flex items-center justify-end gap-3 mb-1">
                      <span className="text-white font-bold text-sm tracking-tight group-hover:text-kickr transition-colors">
                        {event.type === 'subst' ? `${event.assist.name} ↔ ${event.player.name}` : event.player.name}
                      </span>
                      <EventIcon type={event.type} detail={event.detail} />
                    </div>
                    <div className="text-[10px] font-black text-kickr/80 uppercase tracking-widest">
                      {event.detail} {event.type === 'Goal' && event.assist.name ? `• Asst: ${event.assist.name}` : ''}
                    </div>
                  </div>
                )}
              </div>

              {/* Minute Badge - Center */}
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center z-20">
                <div className={`absolute inset-0 rounded-full border transform rotate-45 transition-transform duration-500 group-hover:rotate-180 ${isHome ? 'border-kickr/30 bg-[#1b2228]' : 'border-white/10 bg-[#14181c]'}`} />
                <span className="text-[11px] font-black text-white italic relative z-10 tabular-nums">
                  {event.time.elapsed}{event.time.extra ? `+${event.time.extra}` : ''}'
                </span>
              </div>

              {/* Event Content - Away Side (Right) */}
              <div className="flex-1 pl-12 text-left">
                {!isHome && (
                  <div className="inline-block group">
                    <div className="flex items-center justify-start gap-3 mb-1">
                      <EventIcon type={event.type} detail={event.detail} />
                      <span className="text-white font-bold text-sm tracking-tight group-hover:text-kickr transition-colors">
                        {event.type === 'subst' ? `${event.assist.name} ↔ ${event.player.name}` : event.player.name}
                      </span>
                    </div>
                    <div className="text-[10px] font-black text-kickr/80 uppercase tracking-widest">
                      {event.detail} {event.type === 'Goal' && event.assist.name ? `• Asst: ${event.assist.name}` : ''}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EventIcon = ({ type, detail }: { type: string, detail?: string }) => {
  switch (type) {
    case 'Goal':
      if (detail === 'Own Goal') return <span className="text-lg">⚽🚩</span>;
      return <span className="text-lg">⚽</span>;
    case 'Card':
      if (detail === 'Yellow Card') return <div className="w-3 h-4 bg-[#ffcc00] rounded-[2px] shadow-[0_0_8px_rgba(255,204,0,0.4)]" />;
      return <div className="w-3 h-4 bg-[#ff4444] rounded-[2px] shadow-[0_0_8px_rgba(255,68,68,0.4)]" />;
    case 'subst': return <span className="text-lg text-kickr">🔄</span>;
    case 'Var': return <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded font-black text-white border border-white/10">VAR</span>;
    default: return <span className="text-xs">📍</span>;
  }
};

const LoadingState = () => (
  <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-kickr border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl text-white font-bold mb-4">Match Not Found</h1>
      <Link to="/matches" className="text-kickr hover:underline uppercase tracking-widest text-sm font-bold">Back to Matches</Link>
    </div>
  </div>
);
