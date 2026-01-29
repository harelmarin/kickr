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
import { ReviewPosterCard } from '../components/review/ReviewPosterCard';

export default function HomePage() {
  const { user } = useAuth();
  const { data: latestReviews, isLoading: isLatestLoading } = useLatestReviews(5);
  const { data: popularReviews } = usePopularReviews(5);
  const { data: followingReviews, isLoading: isFollowingLoading } = useFollowingReviews(user?.id, 0, 10);
  const { data: globalFeed, isLoading: isGlobalLoading } = useGlobalFeed(5);
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

  const activeFollowing = (followingReviews?.content || []).slice(0, 10);
  const activeGlobal = (globalFeed || latestReviews || []).slice(0, 5);

  const sortedUserReviews = (userReviews?.content || [])
    .sort((a: any, b: any) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
    .slice(0, 3);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-kickr-bg-primary min-h-screen text-main/90 selection:bg-kickr/30"
    >
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex flex-col items-center justify-center border-b border-white/[0.03] overflow-hidden pt-12 pb-6 md:py-24">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-kickr/10 via-kickr-bg-primary/50 to-kickr-bg-primary"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#14181c_100%)] opacity-80"></div>
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000"
            alt="Cinematic background of a football stadium"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover grayscale opacity-[0.1]"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-40 w-full mb-4 md:mb-12">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-bold tracking-tight uppercase display-font mb-4 md:mb-12"
            >
              <span className="text-5xl md:text-9xl text-main block font-black tracking-tighter italic">
                Track every <br /> football match.
              </span>
              <div className="flex flex-col md:flex-row items-center justify-center gap-y-1 mt-6 md:mt-12 md:gap-x-12">
                <span className="text-base md:text-2xl font-black uppercase tracking-[0.2em] text-secondary">Logged by fans.</span>
                <span className="text-base md:text-2xl font-black uppercase tracking-[0.2em] text-rating">Reviewed by you.</span>
              </div>
            </motion.h1>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-4 md:gap-12"
            >
              <div className="hidden md:block space-y-6 max-w-2xl mx-auto">
                <p className="text-secondary text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed">
                  The social network for football enthusiasts. <br className="hidden md:block" /> Log, rate, and review every game you watch.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
                {!user ? (
                  <Link to="/register" className="h-[44px] md:h-[56px] px-8 md:px-12 flex items-center bg-kickr text-white text-xs md:text-sm font-bold uppercase tracking-widest rounded-md hover:brightness-110 transition-all shadow-[0_0_20px_rgba(93,139,255,0.2)]">
                    Get Started
                  </Link>
                ) : (
                  <Link to={`/user/${user.id}`} className="w-full sm:w-auto h-[48px] md:h-[64px] px-5 md:px-8 flex items-center bg-white/[0.01] border border-white/5 rounded-md gap-3 md:gap-6 transition-all group">
                    <div className="w-7 h-7 md:w-10 md:h-10 rounded-md bg-white/[0.04] border border-white/5 flex items-center justify-center text-kickr text-sm md:text-lg font-bold overflow-hidden">
                      {user.avatarUrl ? <img src={user.avatarUrl} alt={`${user.name}'s avatar`} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /> : user.name[0]}
                    </div>
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-xs md:text-sm font-bold text-main uppercase tracking-widest">Dashboard</span>
                      <span className="text-[10px] md:text-xs font-medium text-muted uppercase tracking-widest truncate w-full max-w-[80px] md:max-w-none">{user.name}</span>
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
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">

          {/* PRIMARY FEED COLUMN */}
          <div className="lg:col-span-8 space-y-8 md:space-y-20">
            {/* NETWORK */}
            {user && (
              <section>
                <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="cinematic-header text-sm md:text-base">Friends Activity</h2>
                  </div>
                  <Link to="/feed" className="text-xs md:text-sm font-bold text-secondary hover:text-kickr transition-colors">View All Feed →</Link>
                </div>

                <div className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-md">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 md:gap-6">
                    {isFollowingLoading ? (
                      <div className="h-24 bg-black/5 animate-pulse rounded-sm col-span-2"></div>
                    ) : activeFollowing.length > 0 ? (
                      activeFollowing.map((review: any) => (
                        <ReviewPosterCard key={review.id} review={review} />
                      ))
                    ) : (
                      <div className="py-8 text-center col-span-2 border border-white/5 bg-white/[0.01]">
                        <p className="text-secondary text-xs font-black uppercase tracking-[0.2em]">Empty Network</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* FIXTURES */}
            <section className={`${user ? 'pt-8 border-t border-white/10' : ''}`}>
              <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="cinematic-header text-sm md:text-base">Recent Fixtures</h2>
                </div>
                <Link to="/matches" className="text-xs md:text-sm font-bold text-secondary hover:text-kickr transition-colors">See Search →</Link>
              </div>
              <div className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-md">
                <NextMatchesHomePage />
              </div>
            </section>

            {/* GLOBAL LIVE */}
            <section className="pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="cinematic-header text-sm md:text-base">Global Feed</h2>
                </div>
                <div className="flex items-center gap-2 bg-kickr/10 px-3 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-rating animate-pulse"></div>
                  <span className="text-[10px] md:text-xs font-bold text-rating uppercase tracking-wider">LIVE</span>
                </div>
              </div>

              {isGlobalLoading || isLatestLoading ? (
                <div className="space-y-1">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-black/5 animate-pulse rounded-sm"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 md:gap-4">
                  {activeGlobal.map((review: UserMatch) => (
                    <ReviewPosterCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR - Adapted for Mobile */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-16 mt-8 md:mt-16 lg:mt-0">
            {/* DIARY */}
            {user && (
              <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm col-span-1 lg:col-auto poster-shadow">
                <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                  <h3 className="cinematic-header text-xs text-kickr">Your Diary</h3>
                  <Link to={`/user/${user.id}/diary`} className="text-[10px] font-bold uppercase text-secondary hover:text-kickr transition-colors tracking-widest">All →</Link>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {sortedUserReviews.length > 0 ? (
                    sortedUserReviews.map((review: any) => (
                      <ReviewPosterCard key={review.id} review={review} variant="mini" />
                    ))
                  ) : (
                    <div className="col-span-3 py-6 text-center">
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest">No entries yet</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* SECTORS */}
            <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm col-span-1 lg:col-auto poster-shadow">
              <h3 className="cinematic-header text-xs text-kickr mb-4 md:mb-8 border-b border-white/[0.03] pb-4">Top Leagues</h3>
              <div className="space-y-4">
                {trendingSectors.slice(0, 3).map((sector, i) => (
                  <Link key={sector.name} to={sector.id ? `/competitions/${sector.id}` : `/matches`} className="group block">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-muted/30">{i + 1}</span>
                        <span className="text-xs font-bold text-secondary uppercase tracking-wide group-hover:text-white transition-colors truncate max-w-[100px] md:max-w-none">{sector.name}</span>
                      </div>
                      <span className="text-xs font-bold text-rating tabular-nums">{sector.rating.toFixed(1)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* COMMUNITY - Hidden on very small mobile if grid is crowded, or just kept small */}
            <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm col-span-2 lg:col-auto poster-shadow">
              <h3 className="cinematic-header text-xs text-kickr mb-4 md:mb-8 border-b border-white/[0.03] pb-4">Community</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {communityScouts?.content?.filter((s: any) => s.id !== user?.id).slice(0, 5).map((scout: any) => (
                  <Link key={scout.id} to={`/user/${scout.id}`} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[10px] text-kickr font-bold group-hover:border-kickr transition-all overflow-hidden flex-shrink-0">
                      {scout.avatarUrl ? <img src={scout.avatarUrl} alt={`${scout.name}'s avatar profile`} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : scout.name[0]}
                    </div>
                    <p className="text-xs font-bold text-secondary group-hover:text-white uppercase transition-all truncate">{scout.name}</p>
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
