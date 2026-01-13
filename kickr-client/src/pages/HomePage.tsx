import { NextMatchesHomePage } from '../components/matches/nextMatchesClient';
import { Link } from 'react-router-dom';
import { useLatestReviews, useUserMatchesByUser, useFollowingReviews, usePopularReviews } from '../hooks/useUserMatch';
import { useGlobalFeed } from '../hooks/usePreviewFeed';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUser';
import { ReviewCard } from '../components/review/ReviewCard';
import { ReviewCardSkeleton } from '../components/ui/LoadingSkeletons';
import { motion } from 'framer-motion';
import { useTrendingMatches } from '../hooks/useNextMatches';
import { useCompetitions } from '../hooks/useCompetitions';

export default function HomePage() {
  const { user } = useAuth();
  const { data: latestReviews, isLoading: isLatestLoading } = useLatestReviews(3);
  const { data: popularReviews, isLoading: isPopularLoading } = usePopularReviews(6);
  const { data: followingReviews, isLoading: isFollowingLoading } = useFollowingReviews(user?.id, 0, 3);
  const { data: globalFeed, isLoading: isGlobalLoading } = useGlobalFeed(3);
  const { data: userReviews } = useUserMatchesByUser(user?.id || '');
  const { data: communityScouts } = useUsers();
  const { data: trendingMatches, isLoading: isTrendingLoading } = useTrendingMatches(6);
  const { data: competitions } = useCompetitions();

  const activeFeedContent = user
    ? (followingReviews?.content || [])
    : (globalFeed || latestReviews || []);

  const isLoadingFeed = user ? isFollowingLoading : (isGlobalLoading || isLatestLoading);

  const sortedUserReviews = (userReviews?.content || [])
    .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
    .slice(0, 3);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col min-h-screen bg-[#0a0b0d]"
    >
      {/* Cinematic Hero */}
      <section className="relative h-[450px] md:h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-[#0a0b0d]/40"></div>
          <div className="absolute inset-0 bg-[#000] opacity-30"></div>
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000"
            alt="Stadium"
            className="w-full h-full object-cover grayscale opacity-40 blur-[2px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
          {/* Hero Text Content */}
          <div className="flex-1 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kickr/10 border border-kickr/20 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-kickr opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-kickr"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-kickr">The Tactical Network</span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-4 md:mb-6 leading-none tracking-tighter uppercase display-font px-2"
            >
              Track football. <br />
              <span className="text-kickr">Rate matchdays.</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#667788] text-[10px] md:text-xs uppercase tracking-[0.3em] font-black mb-8 md:mb-12 max-w-lg mx-auto leading-relaxed"
            >
              The premier platform for tactical analysis <br className="hidden sm:block" />
              and professional match grading.
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base md:text-xl text-[#99aabb] mb-8 md:mb-12 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              {user
                ? "The social network for football fans. Log every match you watch, share your tactical reviews, and keep a diary of your supporter life."
                : "Discover tactical reviews from our global network, follow your friends, and log your favorite matchdays. Join the pitch."}
            </motion.p>

            <div className="flex items-center justify-center gap-6">
              {!user ? (
                <Link to="/register" className="btn-primary-kickr px-10 py-4 rounded text-xs transition-all hover:-translate-y-0.5">
                  Join the Pitch — It's Free
                </Link>
              ) : (
                <Link
                  to={`/user/${user.id}`}
                  className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-xl border border-white/10 inline-flex items-center gap-3 group/welcome hover:border-kickr/40 transition-all"
                >
                  <span className="text-[#99aabb] font-bold uppercase tracking-widest text-[11px] group-hover:text-white transition-colors">
                    Dashboard for <span className="text-kickr font-black">{user.name}</span>
                  </span>
                  <span className="text-kickr group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              )}
            </div>
          </div>

          {/* Featured match removed */}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 md:gap-16">

          {/* Main Column: Social & Discover */}
          <div className="col-span-1 lg:col-span-3 space-y-16 md:space-y-24">

            {/* 1. Feed Section (Personalized or Discovery) */}
            <section className="section-contrast">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">
                  {user ? "Your Network Activity" : "Community Feed"}
                </h2>
                <Link to="/feed" className="text-[10px] text-muted hover:text-kickr transition-colors font-bold uppercase tracking-widest">
                  {user ? "See All →" : "Discover →"}
                </Link>
              </div>

              {isLoadingFeed ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 md:gap-x-16 md:gap-y-24">
                  <ReviewCardSkeleton />
                  <ReviewCardSkeleton />
                </div>
              ) : activeFeedContent && activeFeedContent.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 md:gap-x-16 md:gap-y-24">
                  {activeFeedContent.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-12 text-center">
                  <p className="text-[#445566] text-xs font-bold uppercase tracking-widest mb-4">
                    {user ? "No reviews from your network yet" : "No reviews yet. Be the first to share your thoughts!"}
                  </p>
                  <Link to={user ? "/community" : "/matches"} className="text-kickr text-[10px] font-black uppercase tracking-widest hover:underline">
                    {user ? "Find users to follow" : "Log a match now"}
                  </Link>
                </div>
              )}
            </section>

            {/* 2. Upcoming Matches */}
            <section className="section-contrast">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Top matches today</h2>
                <Link to="/matches" className="text-[10px] text-muted hover:text-kickr transition-colors font-bold uppercase tracking-widest">See Schedule →</Link>
              </div>
              <p className="text-[#445566] text-xs italic mb-8">Next matches to watch and log.</p>
              <NextMatchesHomePage />
            </section>

            {/* 3. Popular Reviews from the Community */}
            <section className="section-contrast">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Popular this week</h2>
                <Link to="/community" className="text-[10px] text-muted hover:text-kickr transition-colors font-bold uppercase tracking-widest">View All →</Link>
              </div>
              {isPopularLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 md:gap-x-16 md:gap-y-24">
                  <ReviewCardSkeleton />
                  <ReviewCardSkeleton />
                  <ReviewCardSkeleton />
                  <ReviewCardSkeleton />
                </div>
              ) : popularReviews && popularReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 md:gap-x-16 md:gap-y-24">
                  {popularReviews.slice(0, 4).map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[#445566] text-sm italic">No reviews yet. Be the first to share your thoughts!</p>
              )}
            </section>

            {/* 3. Trending Matches - Best Rated */}
            <section className="section-contrast">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Trending on Kickr</h2>
                <Link to="/matches" className="text-[10px] text-muted hover:text-kickr transition-colors font-bold uppercase tracking-widest">All Matches →</Link>
              </div>
              <p className="text-[#445566] text-xs italic mb-8">The best-rated matches according to our community.</p>
              {isTrendingLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : trendingMatches && trendingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {trendingMatches.map((match) => (
                    <Link
                      key={match.matchUuid}
                      to={`/matches/${match.id}`}
                      className="group block bg-[#1b2228]/60 border border-white/5 rounded-xl p-6 hover:border-kickr/40 hover:bg-[#1b2228] transition-all"
                    >
                      <div className="flex items-center justify-between gap-6">
                        {/* Home Team */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img src={match.homeLogo} alt={match.homeTeam} className="w-12 h-12 object-contain flex-shrink-0" />
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-2xl font-black text-white tabular-nums">{match.homeScore}</span>
                          <span className="text-[#445566] font-black">-</span>
                          <span className="text-2xl font-black text-white tabular-nums">{match.awayScore}</span>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                          <img src={match.awayLogo} alt={match.awayTeam} className="w-12 h-12 object-contain flex-shrink-0" />
                        </div>
                      </div>

                      {/* Match Info */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#445566] uppercase tracking-widest font-bold">{match.competition}</span>
                        </div>
                        {match.averageRating && match.averageRating > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-kickr text-sm">★</span>
                            <span className="text-white font-bold text-sm">{match.averageRating.toFixed(1)}</span>
                            <span className="text-[10px] text-[#445566]">({match.reviewsCount} reviews)</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-[#445566] text-sm italic">No rated matches yet.</p>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1 space-y-12 md:space-y-16">
            {user && (
              <section className="section-contrast">
                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6 pb-3 border-b border-white/5">Recent Activity</h3>
                <div className="space-y-8">
                  {sortedUserReviews && sortedUserReviews.length > 0 ? (
                    sortedUserReviews.map(review => (
                      <Link
                        key={review.id}
                        to={review.comment && review.comment.trim() !== "" ? `/reviews/${review.id}` : `/matches/${review.match.id}`}
                        className="flex items-center gap-4 group/sb p-3 -mx-3 rounded-xl hover:bg-white/5 transition-all"
                      >
                        {/* Rating Box */}
                        <div className="flex-shrink-0 w-12 h-12 bg-black/20 rounded-lg flex flex-col items-center justify-center border border-white/5 group-hover/sb:border-kickr/40 transition-colors relative">
                          <span className="text-kickr text-lg font-black italic leading-none">{review.note}</span>
                          <span className="text-[6px] text-[#445566] font-black uppercase tracking-widest mt-1">Note</span>
                          {review.isLiked && (
                            <span className="absolute -top-1 -right-1 text-[#ff8000] text-xs" title="Liked">❤</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <img src={review.match.homeLogo} alt="" className="w-3.5 h-3.5 object-contain opacity-80 flex-shrink-0" />
                            <div className="flex items-center gap-1 font-black italic text-[9px] text-white/40">
                              <span>{review.match.homeScore}</span>
                              <span className="opacity-30">-</span>
                              <span>{review.match.awayScore}</span>
                            </div>
                            <img src={review.match.awayLogo} alt="" className="w-3.5 h-3.5 object-contain opacity-80 flex-shrink-0" />
                          </div>
                          {review.comment && review.comment.trim() !== "" && (
                            <p className="text-[9px] text-[#5c6470] line-clamp-1 italic mt-1.5 border-l border-kickr/30 pl-2 leading-none">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-[10px] text-[#5c6470] italic text-center py-4">No matches logged yet.</p>
                  )}
                  <Link to={`/user/${user.id}/diary`} className="block text-center text-[9px] font-bold uppercase tracking-widest text-[#99aabb] hover:text-white transition-colors pt-2">
                    View full diary →
                  </Link>
                </div>
              </section>
            )}

            {/* Discover Tacticians Section */}
            <section className="section-contrast">
              <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6 pb-3 border-b border-white/5">Rising Tacticians</h3>
              <div className="space-y-8">
                {communityScouts?.content && communityScouts.content.length > 0 ? (
                  communityScouts.content
                    .filter(s => s.id !== user?.id)
                    .slice(0, 4)
                    .map((scout) => (
                      <Link
                        key={scout.id}
                        to={`/user/${scout.id}`}
                        className="flex items-center gap-4 group/scout"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kickr/20 to-kickr/5 border border-white/10 flex items-center justify-center text-xs font-black text-kickr uppercase group-hover:border-kickr/40 group-hover:scale-110 transition-all overflow-hidden">
                          {scout.avatarUrl ? (
                            <img src={scout.avatarUrl} alt={scout.name} className="w-full h-full object-cover" />
                          ) : (
                            scout.name[0]
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-black italic truncate group-hover:text-kickr transition-colors tracking-tight">{scout.name}</p>
                          <p className="text-[9px] text-[#445566] font-bold uppercase tracking-widest">{scout.matchesCount} Logs</p>
                        </div>
                        <span className="text-kickr opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    ))
                ) : (
                  <p className="text-[10px] text-[#445566] italic text-center py-4">Finding analysts...</p>
                )}
              </div>
              <Link to="/community" className="block text-center text-[9px] font-black uppercase tracking-[0.3em] text-[#5c6470] hover:text-white transition-colors mt-8 pt-4 border-t border-white/5">
                The Tacticians Network
              </Link>
            </section>

            {/* Trending Leagues */}
            <section className="section-contrast">
              <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-6 pb-3 border-b border-white/5">Trending Leagues</h3>
              <div className="flex flex-col gap-5">
                {competitions ? (
                  competitions.slice(0, 6).map(c => (
                    <LeagueItem key={c.id} name={c.name} id={c.id} />
                  ))
                ) : (
                  [1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse"></div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

const LeagueItem = ({ name, id }: { name: string, id?: string }) => (
  <Link to={id ? `/competitions/${id}` : "/competitions"} className="flex items-center justify-between group cursor-pointer border-b border-white/5 pb-2 hover:border-kickr/30 transition-all">
    <span className="text-xs font-bold text-[#99aabb] group-hover:text-kickr transition-colors">{name}</span>
    <span className="text-[#445566] transition-transform group-hover:translate-x-1 group-hover:text-kickr">→</span>
  </Link>
);
