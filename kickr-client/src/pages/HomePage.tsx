import { NextMatchesHomePage } from '../components/matches/nextMatchesClient';
import { TodayMatches } from '../components/matches/TodayMatches';
import { Link } from 'react-router-dom';
import { useLatestReviews, useUserMatchesByUser, useFollowingReviews } from '../hooks/useUserMatch';
import { useGlobalFeed } from '../hooks/usePreviewFeed';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUser';
import { motion } from 'framer-motion';
import type { UserMatch } from '../types/userMatch';
import { LandingMatchPreview } from '../components/landing/LandingMatchPreview';
import { ReviewPosterCard } from '../components/review/ReviewPosterCard';
import { TopTeamsWidget } from '../components/widgets/TopTeamsWidget';

export default function HomePage() {
  const { user } = useAuth();
  const { data: latestReviews, isLoading: isLatestLoading } = useLatestReviews(5);
  const { data: followingReviews, isLoading: isFollowingLoading } = useFollowingReviews(user?.id, 0, 10);
  const { data: globalFeed, isLoading: isGlobalLoading } = useGlobalFeed(5);
  const { data: userReviews } = useUserMatchesByUser(user?.id || '');
  const { data: communityFans } = useUsers();

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
                  <Link to="/register" className="h-[44px] md:h-[56px] px-8 md:px-12 flex items-center bg-kickr text-white text-xs md:text-sm font-black uppercase tracking-widest rounded-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(93,139,255,0.2)] italic">
                    Get Started
                  </Link>
                ) : (
                  <Link to={`/user/${user.id}`} className="w-full sm:w-auto h-[48px] md:h-[64px] px-5 md:px-8 flex items-center bg-white/[0.01] border border-white/5 rounded-sm gap-3 md:gap-6 transition-all group hover:border-kickr/40 hover:bg-white/[0.02]">
                    <div className="w-7 h-7 md:w-10 md:h-10 rounded-sm bg-black/20 border border-white/5 flex items-center justify-center text-kickr text-sm md:text-lg font-black overflow-hidden">
                      {user.avatarUrl ? <img src={user.avatarUrl} alt={`${user.name}'s avatar`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> : user.name[0]}
                    </div>
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-xs md:text-sm font-black text-main uppercase tracking-widest italic tracking-tighter">Dashboard</span>
                      <span className="text-[10px] md:text-xs font-bold text-muted uppercase tracking-widest truncate w-full max-w-[80px] md:max-w-none italic">{user.name}</span>
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

                <div className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 md:gap-6">
                    {isFollowingLoading ? (
                      Array.from({ length: 5 }).map((_, i) => <div key={i} className="aspect-[2/3] bg-black/5 animate-pulse rounded-sm" />)
                    ) : activeFollowing.length > 0 ? (
                      activeFollowing.map((review: any) => (
                        <ReviewPosterCard key={review.id} review={review} />
                      ))
                    ) : (
                      <div className="py-12 text-center col-span-full border border-dashed border-white/5 rounded-sm">
                        <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em] italic">No activity detected</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* TODAY'S MATCHES */}
            <section className={`${user ? 'pt-8 border-t border-white/10' : ''}`}>
              <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="cinematic-header text-sm md:text-base">Today's Matches</h2>
                  <span className="text-[8px] md:text-[10px] font-black text-kickr uppercase tracking-widest px-2 py-0.5 bg-kickr/10 rounded-sm">LIVE</span>
                </div>
                <Link to="/matches" className="text-xs md:text-sm font-bold text-secondary hover:text-kickr transition-colors">See All →</Link>
              </div>
              <div className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
                <TodayMatches />
              </div>
            </section>

            {/* FIXTURES */}
            <section className="pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="cinematic-header text-sm md:text-base">Recent Fixtures</h2>
                </div>
                <Link to="/matches" className="text-xs md:text-sm font-bold text-secondary hover:text-kickr transition-colors">See Search →</Link>
              </div>
              <div className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
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

              <div className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
                {isGlobalLoading || isLatestLoading ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 md:gap-4">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="aspect-[2/3] bg-black/5 animate-pulse rounded-sm" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 md:gap-4">
                    {activeGlobal.map((review: UserMatch) => (
                      <ReviewPosterCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* SIDEBAR - Adapted for Mobile */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-16 mt-8 md:mt-16 lg:mt-0">
            {/* DIARY */}
            {user && (
              <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm col-span-1 lg:col-auto poster-shadow">
                <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                  <h3 className="cinematic-header text-[10px] md:text-xs text-kickr">Your Diary</h3>
                  <Link to={`/user/${user.id}/diary`} className="text-[8px] md:text-[10px] font-bold uppercase text-secondary hover:text-kickr transition-colors tracking-widest">All →</Link>
                </div>

                {sortedUserReviews.length > 0 ? (
                  <>
                    {/* Mobile: Show only 1 review */}
                    <div className="md:hidden">
                      <ReviewPosterCard review={sortedUserReviews[0]} variant="mini" />
                    </div>
                    {/* Desktop: Show 3 reviews in grid */}
                    <div className="hidden md:grid grid-cols-3 gap-3">
                      {sortedUserReviews.map((review: any) => (
                        <ReviewPosterCard key={review.id} review={review} variant="mini" />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">No entries yet</p>
                  </div>
                )}
              </section>
            )}

            {/* TRENDING CLUBS */}
            <TopTeamsWidget />

            {/* COMMUNITY */}
            <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm col-span-2 lg:col-auto poster-shadow">
              <h3 className="cinematic-header text-xs text-kickr mb-4 md:mb-8 border-b border-white/[0.03] pb-4">Community</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {communityFans?.content?.filter((s: any) => s.id !== user?.id).slice(0, 5).map((fan: any) => (
                  <Link key={fan.id} to={`/user/${fan.id}`} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[10px] text-kickr font-bold group-hover:border-kickr transition-all overflow-hidden flex-shrink-0">
                      {fan.avatarUrl ? <img src={fan.avatarUrl} alt={`${fan.name}'s avatar profile`} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : fan.name[0]}
                    </div>
                    <p className="text-xs font-bold text-secondary group-hover:text-white uppercase transition-all truncate">{fan.name}</p>
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
