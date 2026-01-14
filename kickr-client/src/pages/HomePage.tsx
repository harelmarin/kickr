import { useMemo } from 'react';
import { NextMatchesHomePage } from '../components/matches/nextMatchesClient';
import { Link } from 'react-router-dom';
import { useLatestReviews, useUserMatchesByUser, useFollowingReviews, usePopularReviews } from '../hooks/useUserMatch';
import { useGlobalFeed } from '../hooks/usePreviewFeed';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUser';
import { ReviewCard } from '../components/review/ReviewCard';
import { ReviewCardSkeleton } from '../components/ui/LoadingSkeletons';
import { motion } from 'framer-motion';
import type { UserMatch } from '../types/userMatch';

export default function HomePage() {

  const { user } = useAuth();
  const { data: latestReviews, isLoading: isLatestLoading } = useLatestReviews(4);
  const { data: popularReviews, isLoading: isPopularLoading } = usePopularReviews(4);
  const { data: followingReviews, isLoading: isFollowingLoading } = useFollowingReviews(user?.id, 0, 4);
  const { data: globalFeed, isLoading: isGlobalLoading } = useGlobalFeed(4);
  const { data: userReviews } = useUserMatchesByUser(user?.id || '');
  const { data: communityScouts } = useUsers();

  const trendingSectors = useMemo(() => {
    if (!popularReviews || !Array.isArray(popularReviews)) return [];
    const sectors: Record<string, { count: number, totalNote: number, logo?: string, id?: string }> = {};
    popularReviews.forEach((review: UserMatch) => {
      const name = review.match.competition;
      if (!sectors[name]) sectors[name] = { count: 0, totalNote: 0, logo: review.match.competitionLogo, id: review.match.competitionId };
      sectors[name].count++;
      sectors[name].totalNote += review.note;
    });
    return Object.entries(sectors)
      .map(([name, data]) => ({
        name,
        activity: data.count,
        rating: data.totalNote / data.count,
        logo: data.logo,
        id: data.id
      }))
      .sort((a, b) => b.activity - a.activity)
      .slice(0, 5);
  }, [popularReviews]);

  const activeFollowing = followingReviews?.content || [];
  const activeGlobal = globalFeed || latestReviews || [];

  const sortedUserReviews = (userReviews?.content || [])
    .sort((a: any, b: any) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
    .slice(0, 5);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#08080a] min-h-screen text-white/90 selection:bg-kickr/30"
    >
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center border-b border-white/5 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-kickr/5 via-transparent to-[#08080a]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#08080a_100%)] opacity-90"></div>
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000"
            alt="Stadium"
            className="w-full h-full object-cover grayscale opacity-[0.15]"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-40 w-full">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-black tracking-tighter uppercase italic display-font mb-12"
            >
              <span className="text-5xl md:text-8xl text-white/90 block leading-none antialiased">
                The Tactical Network.
              </span>
              <div className="flex flex-col md:flex-row items-center justify-center gap-x-10 gap-y-2 mt-8 md:mt-12">
                <span className="text-xl md:text-4xl text-white/30 normal-case not-italic font-bold tracking-tight">Track football.</span>
                <span className="text-xl md:text-4xl text-kickr/80 normal-case not-italic font-bold tracking-tight">Rate matchdays.</span>
              </div>
            </motion.h1>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-12"
            >
              <div className="space-y-6 max-w-2xl mx-auto">
                <p className="text-white/60 text-xs md:text-sm font-black uppercase tracking-[0.4em] leading-relaxed">
                  The premier platform for tactical analysis <br className="hidden md:block" /> and professional match grading.
                </p>
                <p className="text-[#64748b] text-sm md:text-base font-medium leading-relaxed max-w-xl mx-auto">
                  The social network for football fans. Log every match you watch, share your tactical reviews, and keep a diary of your supporter life.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                {!user ? (
                  <Link to="/register" className="h-[60px] px-12 flex items-center bg-[#f1f5f9] text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-all border border-white/10">
                    Join the pitch, it's free
                  </Link>
                ) : (
                  <Link to={`/user/${user.id}`} className="min-w-[280px] h-[64px] px-8 flex items-center bg-white/[0.02] border border-white/5 rounded-sm gap-6 transition-all group">
                    <div className="w-10 h-10 rounded-sm bg-white/[0.04] border border-white/5 flex items-center justify-center text-kickr text-lg font-black italic overflow-hidden">
                      {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /> : user.name[0]}
                    </div>
                    <div className="flex flex-col items-start min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-white uppercase italic tracking-[0.1em]">My Dashboard</span>
                        <div className="w-1 h-1 rounded-full bg-kickr animate-pulse"></div>
                      </div>
                      <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.2em] mt-1 truncate w-full">Terminal // {user.name}</span>
                    </div>
                    <div className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. DATA GRID INTERFACE */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* PRIMARY FEED COLUMN */}
          <div className="lg:col-span-8 space-y-16">

            {/* PRIORITY SECTOR: CURRENT FIXTURES */}
            <section>
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-[1px] bg-kickr opacity-50"></div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90 italic">Upcoming Fixtures</h2>
                </div>
                <Link to="/matches" className="text-[9px] font-black uppercase tracking-widest text-[#445566] hover:text-kickr transition-colors">See all data →</Link>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
                <NextMatchesHomePage />
              </div>
            </section>

            {/* INTEL FEED: NETWORK OBSERVATIONS */}
            {user && (
              <section>
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-[2px] bg-white/20"></div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Friend Activity</h2>
                  </div>
                  <Link to="/feed" className="text-[9px] font-black uppercase tracking-widest text-[#445566] hover:text-kickr transition-colors">View all reports →</Link>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
                  {isFollowingLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ReviewCardSkeleton /><ReviewCardSkeleton />
                    </div>
                  ) : activeFollowing.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {activeFollowing.map((review: any) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center group transition-all">
                      <p className="text-[#445566] text-[10px] font-black uppercase tracking-[0.3em] mb-6">No match reports found in your network.</p>
                      <Link to="/community" className="inline-flex items-center h-10 px-8 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-kickr transition-all">Go to Community →</Link>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* GLOBAL ACTIVITY: TECHNICAL LOGS */}
            <section className="mt-16 pt-12 border-t border-white/5">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-[1px] bg-kickr opacity-50"></div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90 italic">Global Match Feed</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-kickr animate-pulse"></div>
                  <span className="text-[9px] font-black text-[#445566] uppercase tracking-[widest]">Live Hub</span>
                </div>
              </div>

              {isGlobalLoading || isLatestLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-sm"></div>)}
                </div>
              ) : (
                <div className="space-y-3">
                  {activeGlobal.map((review: UserMatch) => (
                    <Link
                      key={review.id}
                      to={`/reviews/${review.id}`}
                      className="group flex items-center justify-between px-4 py-2 bg-white/[0.02] border border-white/5 hover:border-kickr/20 hover:bg-white/[0.04] transition-all rounded-sm gap-4"
                    >
                      <div className="flex items-center gap-6 flex-1 min-w-0">
                        {/* User ID / Avatar */}
                        <div className="flex items-center gap-3 w-32 flex-shrink-0">
                          <div className="w-6 h-6 rounded-sm bg-kickr/10 border border-white/5 flex items-center justify-center overflow-hidden">
                            {review.user?.avatarUrl ? <img src={review.user.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-kickr text-[10px] font-black">{review.user?.name[0]}</span>}
                          </div>
                          <span className="text-[10px] font-black text-white/60 group-hover:text-white truncate uppercase italic">{review.user?.name}</span>
                        </div>

                        {/* Match Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0 border-l border-white/5 pl-6">
                          <div className="flex -space-x-1.5 flex-shrink-0">
                            <img src={review.match.homeLogo} className="w-5 h-5 object-contain" alt="" />
                            <img src={review.match.awayLogo} className="w-5 h-5 object-contain border-l border-[#0a0a0a]" alt="" />
                          </div>
                          <p className="text-[10px] font-black text-white/80 group-hover:text-kickr uppercase italic truncate leading-none">
                            {review.match.homeTeam} <span className="text-[#334455] not-italic font-bold normal-case mx-1">vs</span> {review.match.awayTeam}
                          </p>
                          <span className="hidden md:block text-[8px] font-black text-white/40 uppercase tracking-widest">{review.match.competition}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 bg-kickr/5 px-3 py-1 border border-kickr/10">
                          <span className="text-kickr text-[10px] font-black italic">{review.note.toFixed(1)}</span>
                        </div>

                        {/* Final Score */}
                        <div className="w-16 text-right">
                          <span className="text-[14px] font-black text-white/90 italic font-mono group-hover:text-kickr transition-colors tracking-tighter">
                            {review.match.homeScore}-{review.match.awayScore}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR: TECHNICAL DATA */}
          <div className="lg:col-span-4 space-y-16">

            {/* ANALYST JOURNAL: USER ACTIVITY */}
            {user && (
              <section className="bg-white/[0.02] border border-white/5 p-8 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-6xl font-black italic uppercase tracking-tighter">LOG</span>
                </div>
                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-6 italic">My Match Diary</h3>
                <div className="space-y-9">
                  {sortedUserReviews.length > 0 ? (
                    sortedUserReviews.map((review: any) => (
                      <Link
                        key={review.id}
                        to={review.comment && review.comment.trim() !== "" ? `/reviews/${review.id}` : `/matches/${review.match.id}`}
                        className="flex items-center gap-6 group/item transition-all"
                      >
                        <div className="w-11 h-11 flex-shrink-0 bg-white/[0.02] border border-white/5 flex items-center justify-center text-[10px] font-mono font-black italic text-kickr group-hover/item:border-kickr transition-all">
                          {review.note.toFixed(1)}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-1.5 flex-shrink-0">
                                <img src={review.match.homeLogo} className="w-4 h-4 object-contain" alt="" />
                                <img src={review.match.awayLogo} className="w-4 h-4 object-contain border-l border-[#08080a]" alt="" />
                              </div>
                              <p className="text-[10px] font-black text-white/60 group-hover/item:text-white transition-colors uppercase italic truncate leading-none">
                                {review.match.homeTeam} <span className="text-[#334455] not-italic mx-3">VS</span> {review.match.awayTeam}
                                {review.isLiked && <span className="ml-2 text-[#ff8000] not-italic inline-block" title="Liked">❤</span>}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono font-black text-white/40 group-hover/item:text-kickr transition-colors italic">
                              {review.match.homeScore}-{review.match.awayScore}
                            </span>
                          </div>
                          <span className="text-[7px] font-mono text-white/60 uppercase tracking-[0.3em] leading-none">
                            // {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-[10px] text-[#445566] italic font-bold">No match logs recorded to memory.</p>
                  )}
                </div>
                {sortedUserReviews.length > 0 && (
                  <Link to={`/user/${user.id}/diary`} className="block mt-10 text-center pt-6 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-[#445566] hover:text-white transition-all">
                    Access Historical Data →
                  </Link>
                )}
              </section>
            )}

            {/* STRATEGIC REPORTS: TRENDING SECTORS (AGGREGATED) */}
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.5em] italic">Top Leagues</h3>
                <span className="text-[8px] font-mono text-kickr uppercase tracking-widest animate-pulse">Live Stats</span>
              </div>
              <div className="space-y-8">
                {isPopularLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded-sm"></div>)
                ) : trendingSectors.length > 0 ? (
                  trendingSectors.map((sector, i) => (
                    <Link
                      key={sector.name}
                      to={sector.id ? `/competitions/${sector.id}` : `/matches?competition=${encodeURIComponent(sector.name)}`}
                      className="group relative block"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-mono text-white/20">0{i + 1}</span>
                          {sector.logo && (
                            <img src={sector.logo} alt="" className="w-4 h-4 object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                          )}
                          <span className="text-[10px] font-black text-white/80 uppercase italic tracking-widest group-hover:text-kickr transition-colors">{sector.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-kickr italic">{sector.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between mt-1 pt-1 border-t border-white/5">
                        <span className="text-[7px] font-mono text-white/10 uppercase tracking-widest">Popularity</span>
                        <span className="text-[7px] font-mono text-white/10 uppercase tracking-widest">Reports: {sector.activity} matches</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-[10px] text-[#445566] italic font-bold">Waiting for sector synchronization...</p>
                )}
              </div>
            </section>

            {/* TACTICIANS DIRECTORY: TOP USERS */}
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.5em] italic">Community Analysts</h3>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Active Now</span>
              </div>
              <div className="space-y-6">
                {communityScouts?.content?.filter((s: any) => s.id !== user?.id).slice(0, 5).map((scout: any) => (
                  <Link key={scout.id} to={`/user/${scout.id}`} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-sm bg-white/[0.02] border border-white/5 flex items-center justify-center text-[10px] text-kickr font-black italic group-hover:border-kickr transition-all overflow-hidden">
                      {scout.avatarUrl ? <img src={scout.avatarUrl} className="w-full h-full object-cover" /> : (scout.name ? scout.name[0] : '?')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black text-white/60 group-hover:text-kickr uppercase italic transition-all truncate">{scout.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-[#334455] uppercase tracking-widest">{scout.matchesCount} Reports</span>
                        <div className="w-1 h-1 rounded-full bg-white/5"></div>
                        <span className="text-[8px] font-black text-[#334455] uppercase tracking-widest">ID:{String(scout.id).substring(0, 4)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/community" className="block text-center mt-10 pt-6 border-t border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-[#445566] hover:text-white transition-all">
                Full Network Access →
              </Link>
            </section>

          </div>
        </div>
      </div>
    </motion.main>
  );
}
