import { useMemo } from 'react';
import { NextMatchesHomePage } from '../components/matches/nextMatchesClient';
import { Link } from 'react-router-dom';
import { useLatestReviews, useUserMatchesByUser, useFollowingReviews, usePopularReviews } from '../hooks/useUserMatch';
import { useGlobalFeed } from '../hooks/usePreviewFeed';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUser';
import { motion } from 'framer-motion';
import type { UserMatch } from '../types/userMatch';
import { LandingMatchPreview } from '../components/landing/LandingMatchPreview';

const MinifiedReviewCard = ({ review }: { review: any }) => (
  <Link to={`/reviews/${review.id}`} className="group block bg-[#1a1e23] border border-white/5 p-2.5 rounded-sm hover:border-kickr/30 transition-all">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
          {review.user?.avatarUrl ? <img src={review.user.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-[5px] text-white/40">{review.user?.name[0]}</span>}
        </div>
        <span className="text-[7px] font-black text-white/40 uppercase italic truncate max-w-[40px]">{review.user?.name}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-kickr text-[8px] font-black italic">{review.note.toFixed(1)}</span>
      </div>
    </div>

    <div className="flex items-center justify-center gap-2 py-1.5 border-y border-white/[0.03] mb-2">
      <img src={review.match.homeLogo} className="w-3 h-3 object-contain" alt="" />
      <span className="text-[9px] font-black text-white italic tabular-nums">{review.match.homeScore}-{review.match.awayScore}</span>
      <img src={review.match.awayLogo} className="w-3 h-3 object-contain" alt="" />
    </div>

    <p className="text-[7px] text-white/20 italic line-clamp-1 leading-tight uppercase font-medium">
      {review.comment || 'No report available'}
    </p>
  </Link>
);

export default function HomePage() {
  const { user } = useAuth();
  const { data: latestReviews, isLoading: isLatestLoading } = useLatestReviews(4);
  const { data: popularReviews } = usePopularReviews(4);
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
    .slice(0, 3);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#14181c] min-h-screen text-white/90 selection:bg-kickr/30"
    >
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-center border-b border-white/5 overflow-hidden pt-16 pb-8 md:py-24">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-kickr/5 via-transparent to-[#14181c]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#14181c_100%)] opacity-90"></div>
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000"
            alt="Stadium"
            className="w-full h-full object-cover grayscale opacity-[0.1]"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-40 w-full mb-4 md:mb-12">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-black tracking-tighter uppercase italic display-font mb-4 md:mb-12"
            >
              <span className="text-4xl md:text-8xl text-white/90 block leading-none antialiased">
                The Tactical Network.
              </span>
              <div className="flex flex-col md:flex-row items-center justify-center gap-y-1 mt-4 md:mt-12 md:gap-x-10">
                <span className="text-lg md:text-4xl text-white/30 truncate">Track football.</span>
                <span className="text-lg md:text-4xl text-kickr/80 truncate">Rate matchdays.</span>
              </div>
            </motion.h1>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-4 md:gap-12"
            >
              <div className="hidden md:block space-y-6 max-w-2xl mx-auto">
                <p className="text-white/60 text-xs md:text-sm font-black uppercase tracking-[0.4em] leading-relaxed">
                  The premier platform for tactical analysis <br className="hidden md:block" /> and professional match grading.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
                {!user ? (
                  <Link to="/register" className="h-[50px] md:h-[60px] px-8 md:px-12 flex items-center bg-kickr text-black text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-sm hover:brightness-110 transition-all border border-white/10 italic">
                    Join the pitch
                  </Link>
                ) : (
                  <Link to={`/user/${user.id}`} className="w-full sm:w-auto h-[54px] md:h-[64px] px-6 md:px-8 flex items-center bg-white/[0.02] border border-white/5 rounded-sm gap-4 md:gap-6 transition-all group">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-white/[0.04] border border-white/5 flex items-center justify-center text-kickr text-base md:text-lg font-black italic overflow-hidden">
                      {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /> : user.name[0]}
                    </div>
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-[10px] md:text-[11px] font-black text-white uppercase italic tracking-[0.1em]">Dashboard</span>
                      <span className="text-[6px] md:text-[7px] font-mono text-white/20 uppercase tracking-[0.1em] truncate w-full max-w-[80px] md:max-w-none">{user.name}</span>
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {!user && (
          <div className="w-full max-w-4xl mx-auto px-6 mt-2 md:mt-20 scale-[0.9] md:scale-100 transition-transform">
            <LandingMatchPreview />
          </div>
        )}
      </section>

      {/* 2. DATA GRID INTERFACE */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">

          {/* PRIMARY FEED COLUMN */}
          <div className="lg:col-span-8 space-y-8 md:space-y-20">
            {/* FIXTURES */}
            <section>
              <div className="flex items-center justify-between mb-4 md:mb-12">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-[1px] bg-kickr opacity-50"></div>
                  <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/90 italic">Fixtures</h2>
                </div>
                <Link to="/matches" className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#445566] hover:text-kickr">See all →</Link>
              </div>
              <div className="bg-white/[0.01] border border-white/5 p-3 md:p-8 rounded-sm">
                <NextMatchesHomePage />
              </div>
            </section>

            {/* NETWORK */}
            {user && (
              <section className="pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-4 md:mb-12">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-[2px] bg-kickr"></div>
                    <h2 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-white italic">Network activity</h2>
                  </div>
                  <Link to="/feed" className="text-[8px] font-black uppercase tracking-widest text-[#445566] hover:text-kickr">View all →</Link>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-8">
                  {isFollowingLoading ? (
                    <div className="h-24 bg-white/5 animate-pulse rounded-sm col-span-2"></div>
                  ) : activeFollowing.length > 0 ? (
                    activeFollowing.map((review: any) => (
                      <MinifiedReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <div className="py-8 text-center col-span-2 border border-white/5 bg-white/[0.01]">
                      <p className="text-[#445566] text-[8px] font-black uppercase tracking-[0.2em]">Empty Network</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* GLOBAL LIVE */}
            <section className="pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-4 md:mb-10">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-[1px] bg-kickr opacity-50"></div>
                  <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/90 italic">Global Live</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-kickr animate-pulse"></div>
                  <span className="text-[8px] font-black text-[#445566] uppercase tracking-widest">Active</span>
                </div>
              </div>

              {isGlobalLoading || isLatestLoading ? (
                <div className="space-y-1">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-white/5 animate-pulse rounded-sm"></div>)}
                </div>
              ) : (
                <div className="space-y-1.5 md:space-y-3">
                  {activeGlobal.map((review: UserMatch) => (
                    <div
                      key={review.id}
                      className="group relative flex items-center justify-between px-2 md:px-4 py-1 md:py-2 bg-white/[0.01] border border-white/5 hover:border-kickr/20 transition-all rounded-sm gap-2"
                    >
                      <Link to={`/reviews/${review.id}`} className="absolute inset-0 z-0" />

                      <div className="flex items-center gap-2 md:gap-6 flex-1 min-w-0 relative z-10 pointer-events-none">
                        <Link to={`/user/${review.user?.id}`} className="flex items-center gap-1 w-12 md:w-32 flex-shrink-0 pointer-events-auto">
                          <div className="w-3.5 h-3.5 md:w-6 md:h-6 rounded-sm bg-kickr/10 border border-white/5 flex items-center justify-center overflow-hidden">
                            {review.user?.avatarUrl ? <img src={review.user.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-kickr text-[6px] md:text-[10px] font-black">{review.user?.name[0]}</span>}
                          </div>
                          <span className="text-[6.5px] md:text-[10px] font-black text-white/40 hover:text-white truncate uppercase italic transition-colors leading-none">{review.user?.name}</span>
                        </Link>

                        <div className="flex items-center gap-1.5 md:gap-4 flex-1 min-w-0 border-l border-white/5 pl-2 md:pl-6">
                          <div className="flex items-center justify-center gap-1.5 flex-1 md:flex-none">
                            <img src={review.match.homeLogo} className="w-2.5 h-2.5 md:w-5 md:h-5 object-contain" alt="" />
                            <span className="md:hidden text-white/50 text-[7px] font-black italic tabular-nums">{review.match.homeScore}-{review.match.awayScore}</span>
                            <img src={review.match.awayLogo} className="w-2.5 h-2.5 md:w-5 md:h-5 object-contain" alt="" />
                          </div>
                          <span className="text-[5.5px] md:text-[8px] font-black text-white/10 uppercase tracking-[0.05em] md:tracking-[0.3em] ml-auto italic truncate max-w-[40px] md:max-w-none">{review.match.competition}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 md:gap-6 flex-shrink-0 relative z-10 pointer-events-none">
                        <div className="flex items-center justify-center bg-kickr/5 w-5 h-4 md:w-10 md:h-6 border border-kickr/10">
                          <span className="text-kickr text-[7px] md:text-[10px] font-black italic">{review.note.toFixed(1)}</span>
                        </div>
                        <div className="hidden md:block w-16 text-right">
                          <span className="text-[14px] font-black text-white italic group-hover:text-kickr transition-colors tracking-tighter tabular-nums">
                            {review.match.homeScore}-{review.match.awayScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR - Adapted for Mobile */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-16 mt-8 md:mt-16 lg:mt-0">
            {/* DIARY */}
            {user && (
              <section className="bg-white/[0.01] border border-white/5 p-3 md:p-8 rounded-sm relative overflow-hidden group col-span-1 lg:col-auto">
                <h3 className="text-[7px] md:text-[10px] font-black text-kickr uppercase tracking-[0.3em] mb-4 md:mb-10 border-b border-white/5 pb-2 md:pb-6 italic">My Log</h3>
                <div className="space-y-3 md:space-y-8">
                  {sortedUserReviews.length > 0 ? (
                    sortedUserReviews.map((review: any) => (
                      <Link key={review.id} to={`/reviews/${review.id}`} className="flex items-center gap-2 md:gap-6 group/item">
                        <div className="w-6 h-6 md:w-11 md:h-11 flex-shrink-0 bg-white/[0.02] border border-white/5 flex items-center justify-center text-[7px] md:text-[10px] font-mono font-black italic text-kickr group-hover/item:border-kickr transition-all">
                          {review.note.toFixed(1)}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="text-[7.5px] md:text-[10px] font-black text-white/30 italic leading-none">
                            {review.match.homeScore}-{review.match.awayScore}
                          </div>
                          <span className="text-[5.5px] md:text-[7px] font-mono text-white/10 uppercase tracking-[0.05em] leading-none mt-0.5">
                            {new Date(review.watchedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-[7px] text-[#445566] italic font-black">Empty</p>
                  )}
                </div>
              </section>
            )}

            {/* SECTORS */}
            <section className="bg-white/[0.01] border border-white/5 p-3 md:p-8 rounded-sm col-span-1 lg:col-auto">
              <h3 className="text-[7px] md:text-[10px] font-black text-kickr uppercase tracking-[0.3em] italic mb-4 md:mb-8 border-b border-white/5 pb-2 md:pb-6">Leagues</h3>
              <div className="space-y-3 md:space-y-8">
                {trendingSectors.slice(0, 3).map((sector, i) => (
                  <Link key={sector.name} to={sector.id ? `/competitions/${sector.id}` : `/matches`} className="group block">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[7px] font-mono text-white/10">0{i + 1}</span>
                        <span className="text-[8px] md:text-[10px] font-black text-white/50 uppercase italic tracking-widest group-hover:text-kickr transition-colors truncate max-w-[50px] md:max-w-none">{sector.name}</span>
                      </div>
                      <span className="text-[8px] font-mono text-kickr italic tabular-nums">{sector.rating.toFixed(1)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* COMMUNITY - Hidden on very small mobile if grid is crowded, or just kept small */}
            <section className="bg-white/[0.01] border border-white/5 p-3 md:p-8 rounded-sm col-span-2 lg:col-auto">
              <h3 className="text-[7px] md:text-[10px] font-black text-kickr uppercase tracking-[0.3em] italic mb-4 md:mb-8 border-b border-white/5 pb-2 md:pb-6">Tacticians</h3>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 md:gap-6">
                {communityScouts?.content?.filter((s: any) => s.id !== user?.id).slice(0, 6).map((scout: any) => (
                  <Link key={scout.id} to={`/user/${scout.id}`} className="flex items-center gap-2 md:gap-4 group">
                    <div className="w-5 h-5 md:w-8 md:h-8 rounded-sm bg-white/[0.02] border border-white/5 flex items-center justify-center text-[8px] text-kickr font-black italic group-hover:border-kickr transition-all overflow-hidden">
                      {scout.avatarUrl ? <img src={scout.avatarUrl} className="w-full h-full object-cover" /> : scout.name[0]}
                    </div>
                    <p className="text-[7px] md:text-[10px] font-black text-white/40 group-hover:text-kickr uppercase italic transition-all truncate leading-none">{scout.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
