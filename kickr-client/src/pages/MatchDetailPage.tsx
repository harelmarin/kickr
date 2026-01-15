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
        duration: 2000,
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
    <main className="min-h-screen bg-[#14181c] text-[#99aabb]">
      <div className="relative h-[200px] md:h-[650px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0 flex blur-[60px] md:blur-[80px] opacity-15 md:opacity-30">
          <div className="flex-1 relative overflow-hidden">
            <img src={match.homeLogo} className="absolute inset-0 w-full h-full object-cover scale-150 grayscale" alt="" />
          </div>
          <div className="flex-1 relative overflow-hidden">
            <img src={match.awayLogo} className="absolute inset-0 w-full h-full object-cover scale-150 grayscale" alt="" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/90 md:via-[#14181c]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] md:opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-[140px] md:mt-[-550px] relative z-10 pb-16">
        <div className="flex items-center gap-2 md:gap-6 mb-6 md:mb-12">
          <Link to="/" className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-kickr transition-all flex items-center gap-1.5 md:gap-3 group">
            <span className="text-base group-hover:-translate-x-1 transition-transform leading-none mb-0.5">←</span>
            <span className="hidden sm:inline">Tactical Feed</span>
            <span className="sm:hidden italic">BACK</span>
          </Link>
          <div className="h-3 w-[1px] bg-white/5"></div>
          <div className="flex items-center gap-2 md:gap-3 text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/10 italic truncate">
            <span className="text-white/40 truncate max-w-[150px] xs:max-w-none">{match.homeTeam} / {match.awayTeam}</span>
          </div>
        </div>

        <header className="mb-6 md:mb-12">
          {/* Main Poster Card */}
          <div className="bg-white/[0.01] border border-white/5 rounded-sm relative overflow-hidden flex flex-col items-center justify-center">
            {/* Subtle tech background */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 md:via-white/10 to-transparent"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 md:opacity-10 pointer-events-none"></div>

            <div className="w-full p-4 md:p-12 relative z-10">
              <div className="max-w-6xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8">
                {/* Home Team */}
                <div className="flex items-center justify-end gap-3 md:gap-6 min-w-0 group/home">
                  <div className="min-w-0 flex-1 text-right hidden xs:block">
                    <Link to={`/teams/${match.homeTeamId}`}>
                      <h2 className="text-white font-black uppercase italic tracking-tighter text-xs md:text-3xl lg:text-4xl leading-none md:leading-tight display-font group-hover/home:text-kickr transition-colors truncate">
                        {match.homeTeam}
                      </h2>
                    </Link>
                    <span className="text-kickr/40 text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] italic leading-none mt-1 block">Home</span>
                  </div>
                  <Link to={`/teams/${match.homeTeamId}`} className="flex-shrink-0 transition-transform duration-500 group-hover/home:scale-105">
                    <div className="p-2 md:p-3 rounded-sm bg-[#14181c]/40 border border-white/5 group-hover/home:border-kickr/40 transition-all">
                      <img src={match.homeLogo} alt={match.homeTeam} className="w-8 h-8 md:w-20 md:h-20 object-contain" />
                    </div>
                  </Link>
                </div>

                {/* Score / VS Center */}
                <div className="flex flex-col items-center justify-center relative">
                  <div className="bg-[#14181c]/80 border border-white/10 px-4 py-2 md:px-10 md:py-6 rounded-sm shadow-2xl relative group min-w-[70px] md:min-w-0 text-center z-10">
                    <div className="absolute inset-0 bg-kickr/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {isPast ? (
                      <div className="flex items-center justify-center gap-2 md:gap-8 tabular-nums relative z-10">
                        <span className="text-2xl md:text-7xl font-black text-white italic display-font leading-none">{match.homeScore}</span>
                        <div className="w-[1px] md:w-[2px] h-4 md:h-12 bg-white/10"></div>
                        <span className="text-2xl md:text-7xl font-black text-white italic display-font leading-none">{match.awayScore}</span>
                      </div>
                    ) : (
                      <span className="text-xl md:text-6xl font-black text-kickr italic display-font relative z-10">VS</span>
                    )}
                  </div>
                  <div className="absolute -bottom-5 md:-bottom-8 left-1/2 -translate-x-1/2 w-full flex flex-col items-center gap-1 opacity-40 md:opacity-20 whitespace-nowrap">
                    <div className="w-0.5 h-0.5 rounded-full bg-white/20 hidden md:block"></div>
                    <span className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.3em] italic text-white/60 md:text-white/40">
                      {isPast ? 'FT' : 'Upcoming'}
                    </span>
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex items-center justify-start gap-3 md:gap-6 min-w-0 group/away">
                  <Link to={`/teams/${match.awayTeamId}`} className="flex-shrink-0 transition-transform duration-500 group-hover/away:scale-105">
                    <div className="p-2 md:p-3 rounded-sm bg-[#14181c]/40 border border-white/5 group-hover/away:border-kickr/40 transition-all">
                      <img src={match.awayLogo} alt={match.awayTeam} className="w-8 h-8 md:w-20 md:h-20 object-contain" />
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1 text-left hidden xs:block">
                    <Link to={`/teams/${match.awayTeamId}`}>
                      <h2 className="text-white font-black uppercase italic tracking-tighter text-xs md:text-3xl lg:text-4xl leading-none md:leading-tight display-font group-hover/away:text-kickr transition-colors truncate">
                        {match.awayTeam}
                      </h2>
                    </Link>
                    <span className="text-white/10 text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] italic leading-none mt-1 block">Away</span>
                  </div>
                </div>
              </div>

              {/* Mobile Only Team Names (Center aligned below logos if needed, but 'xs:block' above handles small screens well. 
                  If screen is VERY narrow, names hide. Let's add a row below for very small screens if needed, 
                  or just rely on the clean logo view which is common in apps) 
              */}
              <div className="flex xs:hidden items-center justify-between mt-4 px-2">
                <span className="text-[10px] font-black text-white/90 uppercase italic truncate max-w-[40%]">{match.homeTeam}</span>
                <span className="text-[10px] font-black text-white/90 uppercase italic truncate max-w-[40%] text-right">{match.awayTeam}</span>
              </div>
            </div>

            {/* Metadata Bar - Integrated into poster bottom */}
            <div className="w-full border-t border-white/5 bg-[#14181c]/20">
              <div className="grid grid-cols-3 divide-x divide-white/5">
                <div className="flex flex-col items-center justify-center p-3 md:p-6 text-center group hover:bg-white/[0.02] transition-colors">
                  <span className="text-[6px] md:text-[9px] font-black text-kickr/40 md:text-white/10 uppercase tracking-[0.2em] mb-1 italic">Theater</span>
                  <div className="flex items-center gap-1.5 md:gap-2 justify-center">
                    <img src={match.competitionLogo} className="w-3 h-3 md:w-4 md:h-4 object-contain opacity-60 grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-[8px] md:text-[10px] font-bold text-white uppercase italic truncate max-w-[60px] md:max-w-none">{match.competition || 'League'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 md:p-6 text-center hover:bg-white/[0.02] transition-colors">
                  <span className="text-[6px] md:text-[9px] font-black text-kickr/40 md:text-white/10 uppercase tracking-[0.2em] mb-1 italic">Date</span>
                  <span className="text-[8px] md:text-[10px] font-bold text-white uppercase italic tabular-nums">{matchDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 md:p-6 text-center hover:bg-white/[0.02] transition-colors">
                  <span className="text-[6px] md:text-[9px] font-black text-kickr/40 md:text-white/10 uppercase tracking-[0.2em] mb-1 italic">Time</span>
                  <span className="text-[8px] md:text-[10px] font-bold text-white uppercase italic tabular-nums">{matchDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="flex-1 order-2 lg:order-1">
            <header className="mb-12">
              <div className="flex flex-col xl:flex-row xl:items-start gap-8 md:gap-12 mb-8 border-b border-white/5 pb-8 md:pb-12">
                <div className="flex flex-col w-full xl:w-auto">
                  {match.averageRating && match.averageRating > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-[8px] md:text-[9px] font-black text-white/10 uppercase tracking-[0.4em] mb-4 md:mb-6 italic">Community Intel</span>
                      <div className="flex flex-col xs:flex-row items-center gap-4 md:gap-8">
                        <div className="flex flex-col items-center justify-center bg-white/[0.01] border border-white/5 w-20 h-20 md:w-28 md:h-28 rounded-sm relative overflow-hidden group flex-shrink-0">
                          <div className="absolute inset-0 bg-kickr/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="text-2xl md:text-4xl font-black text-white italic leading-none relative z-10 display-font tabular-nums">{match.averageRating.toFixed(1)}</span>
                          <div className="flex text-kickr text-[6px] md:text-[8px] mt-1.5 md:mt-3 relative z-10 tracking-[0.2em]">
                            {'★'.repeat(Math.round(match.averageRating))}
                          </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="flex flex-col gap-1 md:gap-2 w-full max-w-[200px] md:max-w-none">
                          {[5, 4, 3, 2, 1].map(star => {
                            const count = userMatches?.filter(m => Math.round(m.note) === star).length || 0;
                            const total = userMatches?.length || 1;
                            const percentage = (count / total) * 100;
                            return (
                              <div key={star} className="flex items-center gap-2 md:gap-4">
                                <span className="text-[6px] md:text-[8px] font-black text-white/10 w-3 md:w-4 italic">{star}s</span>
                                <div className="flex-1 h-0.5 md:h-1 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    className="h-full bg-kickr/20"
                                  />
                                </div>
                                <span className="text-[6px] md:text-[8px] font-black text-white/20 w-4 md:w-8 text-right tabular-nums italic font-mono">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 italic">Community Rating</span>
                      <div className="bg-white/[0.02] border border-white/5 px-6 py-4 rounded-sm border-dashed">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">No ratings yet. Be the first to rate!</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* User's Tactical History - if logged */}
                {hasAlreadyLogged && (
                  <div className="flex flex-col w-full xl:w-auto mt-4 xl:mt-0">
                    <span className="text-[8px] md:text-[9px] font-black text-white/10 uppercase tracking-[0.3em] mb-4 italic leading-none">Your Records</span>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                      {myMatchEntries.sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()).map((entry) => (
                        <Link key={entry.id} to={`/reviews/${entry.id}`} className="block p-2 bg-white/[0.01] border border-white/5 rounded-sm group/entry">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex text-kickr text-[6px] md:text-[8px]">
                              {'★'.repeat(Math.round(entry.note))}
                              <span className="text-white/5">{'★'.repeat(5 - Math.round(entry.note))}</span>
                            </div>
                            <span className="text-[6px] md:text-[8px] font-black text-white/10 uppercase tabular-nums">
                              {new Date(entry.watchedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>



            <div className="mt-6 md:mt-12">
              <div className="flex items-center gap-4 md:gap-10 border-b border-white/5 mb-6 md:mb-10 overflow-x-auto no-scrollbar">
                {['lineups', 'stats', 'events'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-3 md:pb-5 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all relative italic whitespace-nowrap ${activeTab === tab ? 'text-kickr' : 'text-white/10 hover:text-white'
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 w-full h-[1.5px] bg-kickr"
                      />
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
                  <div className="flex items-center gap-2 bg-[#1b2228] border border-white/10 rounded-sm px-3 py-2">
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
                    className="bg-[#1b2228] border border-white/10 text-white text-sm px-3 py-2 rounded-sm hover:border-kickr/50 transition-all"
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

          {/* Right: Actions Sidebar */}
          <div className="w-full lg:w-[300px] xl:w-[340px] flex-shrink-0 order-1 lg:order-2">
            <div className="bg-white/[0.01] border border-white/5 rounded-sm overflow-hidden shadow-2xl sticky top-24">
              <div className="p-2 md:p-6 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[7px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] leading-none italic">
                      {hasAlreadyLogged ? 'History Found' : 'Rate Intel'}
                    </span>
                    <div className="w-0.5 h-0.5 rounded-full bg-kickr"></div>
                  </div>
                  {hasAlreadyLogged && (
                    <span className="text-[6px] md:text-[9px] font-black text-kickr/40 uppercase tracking-widest mt-0.5 md:mt-1 italic">
                      {myMatchEntries.length} SESSIONS
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`text-sm md:text-lg transition-all transform hover:scale-110 ${isLiked ? 'text-[#ff4b4b]' : 'text-white/10 hover:text-white'}`}
                >
                  {isLiked ? '♥' : '♡'}
                </button>
              </div>

              <div className="p-2 md:p-8 space-y-2 md:space-y-10">
                {/* Rating Star Picker */}
                <div>
                  <div className="hidden md:block text-center text-[6px] md:text-[9px] font-black text-white/10 uppercase tracking-[0.4em] mb-2 md:mb-6 italic">Protocol Value</div>
                  <div className="flex justify-center gap-1 md:gap-2 mb-0 md:mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`text-base md:text-3xl transition-all duration-300 relative group/star ${star <= (hoveredRating || rating) ? 'text-kickr scale-110' : 'text-white/5'
                          }`}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <span className="relative z-10">★</span>
                        {star <= (hoveredRating || rating) && (
                          <div className="absolute inset-0 bg-kickr/10 blur-md rounded-full -z-0"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text Area */}
                <div className="space-y-1 md:space-y-3">
                  <span className="hidden md:block text-[6px] md:text-[9px] font-black text-white/10 uppercase tracking-[0.4em] italic leading-none">Intelligence Notes</span>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Input observations..."
                    className="w-full bg-[#14181c]/40 border border-white/5 rounded-sm p-2 md:p-4 text-[9px] md:text-[13px] text-white/60 placeholder-white/5 focus:outline-none focus:border-kickr/10 h-10 md:h-44 transition-all resize-none italic font-black uppercase tracking-widest leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleSaveRating}
                  disabled={rating === 0 || createUserMatch.isPending}
                  className="w-full py-2 md:py-4 rounded-sm text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] italic hover:brightness-110 active:scale-[0.98] disabled:opacity-10 disabled:cursor-not-allowed transition-all bg-kickr text-black"
                >
                  {createUserMatch.isPending ? 'TRANSMITTING...' : hasAlreadyLogged ? 'LOG AGAIN' : 'EXECUTE LOG'}
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#14181c]/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1b2228] border border-white/10 rounded-sm p-10 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
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
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-3 leading-none">Match Logged</h3>
                <p className="text-[#99aabb] text-[13px] mb-10 leading-relaxed font-medium">
                  Your tactical report is now part of the Kickr network. Export your Review Poster to share your session on social media!
                </p>

                <div className="w-full space-y-4">
                  <div className="flex justify-center">
                    <ShareReviewButton review={justLoggedReview} variant="full" showXShare={true} />
                  </div>
                  <button
                    onClick={() => setJustLoggedReview(null)}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#445566] hover:text-white transition-all bg-white/[0.02] rounded-sm hover:bg-white/[0.05]"
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
        duration: 2000,
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
    <div className="flex gap-3 md:gap-4 border-b border-white/5 pb-4 md:pb-8 group/review">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/[0.02] flex-shrink-0 flex items-center justify-center text-[8px] md:text-[10px] text-white/40 font-black uppercase overflow-hidden border border-white/5">
        {review.user.avatarUrl ? (
          <img src={review.user.avatarUrl} alt={review.user.name} className="w-full h-full object-cover" />
        ) : (
          review.user.name[0]
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 md:mb-2">
          <Link to={`/user/${review.user.id}`} className="text-white/80 text-[11px] md:text-sm font-black hover:text-kickr transition-colors truncate uppercase italic">{review.user.name}</Link>
          <span className="text-kickr/60 font-black text-[9px] md:text-xs pl-2 border-l border-white/5 ml-1 flex-shrink-0 tabular-nums">
            {'★'.repeat(Math.round(review.note))}
            <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
          </span>
          {review.isLiked === true && (
            <span className="text-kickr text-[9px] md:text-sm ml-1 flex-shrink-0" title="Liked">❤</span>
          )}
          {review.watchedAt && (
            <Link to={`/reviews/${review.id}`} className="text-white/10 text-[7px] md:text-[9px] font-black uppercase tracking-widest ml-auto hover:text-white/30 transition-colors flex-shrink-0 italic">
              {new Date(review.watchedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Link>
          )}
        </div>
        {review.comment && review.comment.trim() !== "" && (
          <Link to={`/reviews/${review.id}`} className="block group/comment mt-1">
            <p className="text-[10px] md:text-sm leading-relaxed text-white/40 italic group-hover:text-white/60 transition-colors line-clamp-2 uppercase font-medium">
              {review.comment}
            </p>
            <span className="text-[7px] md:text-[9px] font-black text-kickr/20 uppercase tracking-widest mt-1 block group-hover:text-kickr/40 transition-colors italic">View Recap →</span>
          </Link>
        )}
        <div className="flex items-center justify-between mt-2 md:mt-3">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 md:gap-1.5 text-[8px] md:text-[10px] uppercase font-black tracking-widest transition-all italic ${isLikedByMe
                ? 'text-kickr'
                : 'text-white/10 hover:text-white/30'
                }`}
              title={isLikedByMe ? 'Unlike' : 'Like this review'}
            >
              <span className="text-[10px] md:text-sm">{isLikedByMe ? '❤' : '❤'}</span>
              {review.likesCount && review.likesCount > 0 && (
                <span className="tabular-nums font-black">{review.likesCount}</span>
              )}
            </button>
            <div className="opacity-40 hover:opacity-100 transition-opacity">
              <ShareReviewButton review={review} />
            </div>
          </div>

          {currentUser?.id === review.user.id && (
            <button
              onClick={handleDelete}
              disabled={deleteUserMatch.isPending}
              className="text-[7px] md:text-[9px] font-black text-white/5 hover:text-red-900 transition-colors uppercase tracking-[0.2em] italic"
            >
              {deleteUserMatch.isPending ? '...' : 'Remove'}
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
        <div className="bg-white/[0.02] p-1 rounded-sm border border-white/5 flex gap-1">
          <button
            onClick={() => onToggleView('visual')}
            className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all italic ${viewMode === 'visual' ? 'bg-kickr text-black' : 'text-white/20 hover:text-white'}`}
          >
            Tactical
          </button>
          <button
            onClick={() => onToggleView('list')}
            className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all italic ${viewMode === 'list' ? 'bg-kickr text-black' : 'text-white/20 hover:text-white'}`}
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
                <div className="bg-[#1b2228]/30 rounded-sm p-4 border border-white/5">
                  <span className="text-[9px] font-black text-[#556677] uppercase tracking-[0.2em] mb-3 block">Available Subs</span>
                  <div className="flex flex-wrap gap-2">
                    {teamLineup.substitutes.map((player: any) => (
                      <div key={player.player.id} className="bg-white/[0.03] px-2 py-1 rounded-sm text-[10px] text-[#8899aa] border border-white/5">
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
            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-sm p-8">
              <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
                <img src={teamLineup.team.logo} alt={teamLineup.team.name} className="w-10 h-10 object-contain" />
                <div>
                  <h3 className="text-white font-black text-sm uppercase italic tracking-tighter leading-none">{teamLineup.team.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-kickr text-[9px] font-black uppercase tracking-[0.2em] italic">{teamLineup.formation}</p>
                    {teamLineup.coach && (
                      <>
                        <span className="text-white/10 text-[8px]">•</span>
                        <span className="text-white/40 text-[9px] font-black uppercase tracking-widest italic">{teamLineup.coach.name}</span>
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
    <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden border border-white/5 shadow-2xl">
      {/* Grass Texture & Lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a2a] to-[#142820]">
        {/* Pitch Lines */}
        <div className="absolute inset-2 md:inset-4 border border-white/20 rounded-sm">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 md:w-24 md:h-24 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          {/* Penalty Areas */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 md:w-48 h-12 md:h-20 border-b border-x border-white/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 md:w-48 h-12 md:h-20 border-t border-x border-white/10" />
        </div>
      </div>

      {/* Players */}
      <div className="absolute inset-2 md:inset-4 py-4 md:py-8 px-2 md:px-4 grid grid-rows-5 h-full">
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
          <div key={p.player.id} className="flex flex-col items-center gap-1 group/player w-12 md:w-16">
            <div className="relative">
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[#14181c]/60 border border-kickr flex items-center justify-center group-hover/player:scale-110 group-hover/player:bg-kickr transition-all duration-300">
                <span className="text-[9px] md:text-[11px] font-black text-white flex items-center justify-center leading-none group-hover/player:text-[#14181c] tabular-nums">
                  {p.player.number}
                </span>
              </div>
            </div>
            <div className="w-full text-center">
              <span className="text-[7px] md:text-[9px] font-bold text-white whitespace-nowrap uppercase tracking-tighter bg-[#14181c]/40 px-1 md:px-1.5 py-0.5 rounded-sm backdrop-blur-md group-hover/player:bg-white group-hover/player:text-black transition-colors inline-block max-w-full truncate">
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
    <div className="space-y-4 md:space-y-8 bg-white/[0.01] border border-white/5 rounded-sm p-4 md:p-12 relative overflow-hidden">
      <div className="flex justify-between items-center pb-4 md:pb-10 border-b border-white/5 mb-4 md:mb-6">
        <Link to={`/teams/${homeTeamId}`} className="flex items-center gap-2 md:gap-3 group/team p-1 -m-1 rounded-sm transition-all">
          <img src={homeLogo} alt="" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
          <span className="text-white font-black uppercase italic tracking-tighter text-[10px] md:text-sm hidden sm:block group-hover/team:text-kickr transition-colors">{homeTeam}</span>
        </Link>
        <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">Tactical Intel</div>
        <Link to={`/teams/${awayTeamId}`} className="flex items-center gap-2 md:gap-3 group/team p-1 -m-1 rounded-sm transition-all">
          <span className="text-white font-black uppercase italic tracking-tighter text-[10px] md:text-sm hidden sm:block group-hover/team:text-kickr transition-colors">{awayTeam}</span>
          <img src={awayLogo} alt="" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
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
            <div className="flex justify-between items-end mb-1.5 md:mb-2.5 px-0.5">
              <span className={`text-[10px] md:text-sm font-black italic tabular-nums ${hNum > aNum ? 'text-kickr' : 'text-white/40'}`}>{homeVal}</span>
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/10 group-hover:text-white/20 transition-colors leading-none mb-0.5">{type}</span>
              <span className={`text-[10px] md:text-sm font-black italic tabular-nums ${aNum > hNum ? 'text-kickr' : 'text-white/40'}`}>{awayVal}</span>
            </div>
            <div className="h-1 md:h-1.5 w-full flex rounded-full overflow-hidden bg-white/[0.03] relative">
              <div
                style={{ width: `${homePercent}%` }}
                className={`h-full transition-all duration-1000 ease-out ${hNum >= aNum ? 'bg-kickr/40' : 'bg-white/5'}`}
              />
              <div
                style={{ width: `${100 - homePercent}%` }}
                className={`h-full transition-all duration-1000 ease-out ${aNum > hNum ? 'bg-kickr/40' : 'bg-white/10'}`}
              />
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
    <div className="relative py-6 max-w-3xl mx-auto">
      {/* Central Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />

      <div className="space-y-3 md:space-y-8 relative">
        {events.map((event: any, idx: number) => {
          // Double check with ID and Name for maximum compatibility
          const isHome = String(event.team.id) === String(homeTeamId) ||
            event.team.name === homeTeamName;

          return (
            <div key={idx} className="relative flex items-center min-h-[40px] md:min-h-[60px]">
              {/* Event Content - Home Side (Left) */}
              <div className="flex-1 pr-3 md:pr-12 text-right">
                {isHome && (
                  <div className="inline-block group">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3 mb-0.5 md:mb-1">
                      <span className="text-white font-black text-[9px] md:text-sm tracking-tighter italic group-hover:text-kickr transition-colors leading-tight uppercase">
                        {event.type === 'subst' ? `${event.assist.name.split(' ').pop()} ↔ ${event.player.name.split(' ').pop()}` : event.player.name.split(' ').pop()}
                      </span>
                      <EventIcon type={event.type} detail={event.detail} />
                    </div>
                  </div>
                )}
              </div>

              {/* Minute Badge - Center */}
              <div className="relative w-6 h-6 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center z-20">
                <div className={`absolute inset-0 rounded-full border transform rotate-45 transition-transform duration-500 ${isHome ? 'border-kickr/20 bg-[#1b2228]' : 'border-white/5 bg-[#14181c]'}`} />
                <span className="text-[7px] md:text-[11px] font-black text-white italic relative z-10 tabular-nums font-mono leading-none">
                  {event.time.elapsed}
                </span>
              </div>

              {/* Event Content - Away Side (Right) */}
              <div className="flex-1 pl-3 md:pl-12 text-left">
                {!isHome && (
                  <div className="inline-block group">
                    <div className="flex items-center justify-start gap-1.5 md:gap-3 mb-0.5 md:mb-1">
                      <EventIcon type={event.type} detail={event.detail} />
                      <span className="text-white font-black text-[9px] md:text-sm tracking-tighter italic group-hover:text-kickr transition-colors leading-tight uppercase">
                        {event.type === 'subst' ? `${event.assist.name.split(' ').pop()} ↔ ${event.player.name.split(' ').pop()}` : event.player.name.split(' ').pop()}
                      </span>
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
      if (detail === 'Own Goal') return <span className="text-xs md:text-lg leading-none">⚽🚩</span>;
      return <span className="text-xs md:text-lg leading-none">⚽</span>;
    case 'Card':
      if (detail === 'Yellow Card') return <div className="w-2 md:w-3 h-3 md:h-4 bg-[#ffcc00] rounded-[1px] md:rounded-[2px]" />;
      return <div className="w-2 md:w-3 h-3 md:h-4 bg-[#ff4444] rounded-[1px] md:rounded-[2px]" />;
    case 'subst': return <span className="text-xs md:text-lg text-kickr leading-none">🔄</span>;
    case 'Var': return <span className="text-[6px] md:text-xs bg-white/10 px-1 md:px-1.5 py-0.5 rounded-sm font-black text-white border border-white/10">VAR</span>;
    default: return <span className="text-[6px] md:text-xs">📍</span>;
  }
};

const LoadingState = () => (
  <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="w-12 h-12 border border-kickr/20 border-t-kickr animate-spin"></div>
      <span className="text-[10px] font-black text-kickr uppercase tracking-[0.5em] italic animate-pulse">Syncing Tactical Data...</span>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen bg-[#14181c] flex items-center justify-center p-6">
    <div className="max-w-md w-full text-center space-y-8">
      <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-sm mx-auto flex items-center justify-center">
        <span className="text-3xl">⚠️</span>
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl text-white font-black uppercase italic tracking-tighter">Sector Offline</h1>
        <p className="text-white/40 text-sm italic">The requested combat data could not be retrieved from the central database.</p>
      </div>
      <Link to="/matches" className="inline-block px-8 py-3 bg-white/[0.02] border border-white/5 text-kickr hover:bg-white/[0.05] uppercase tracking-widest text-[10px] font-black transition-all rounded-sm italic">
        Return to War Room
      </Link>
    </div>
  </div>
);
