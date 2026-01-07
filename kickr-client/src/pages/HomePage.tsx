import { NextMatchesHomePage } from '../components/Matchs/nextMatchsClient';
import { Link } from 'react-router-dom';
import { useLatestReviews, useUserMatchesByUser } from '../hooks/useUserMatch';
import { useAuth } from '../hooks/useAuth';
import { ReviewCard } from '../components/Review/ReviewCard';

export default function HomePage() {
  const { user } = useAuth();
  const { data: latestReviews, isLoading: isLatestLoading } = useLatestReviews(4);
  const { data: userReviews } = useUserMatchesByUser(user?.id || '');

  return (
    <main className="flex flex-col min-h-screen bg-[#14181c]">
      {/* Cinematic Hero */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-transparent to-[#14181c]/40"></div>
          <div className="absolute inset-0 bg-[#000] opacity-40"></div>
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000"
            alt="Stadium"
            className="w-full h-full object-cover grayscale opacity-50"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tighter uppercase display-font">
            Track football. <br />
            <span className="text-kickr">Rate matchdays.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#99aabb] mb-12 font-medium max-w-3xl mx-auto leading-relaxed">
            The social network for football fans. Log every match you watch, share your tactical reviews, and keep a diary of your supporter life.
          </p>
          <div className="flex items-center justify-center gap-6">
            {!user ? (
              <Link to="/matches" className="btn-primary-kickr px-10 py-4 rounded text-xs transition-all">
                Get Started — It's Free
              </Link>
            ) : (
              <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-2xl inline-flex items-center gap-2">
                <span className="text-[#99aabb] font-bold uppercase tracking-widest text-[11px]">
                  Welcome back,
                </span>
                <Link
                  to={`/user/${user.id}`}
                  className="text-kickr font-black uppercase tracking-widest text-[11px] hover:text-white transition-colors underline decoration-kickr/30 underline-offset-4"
                >
                  {user.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">

          {/* Main Column: Social & Discover */}
          <div className="lg:col-span-3 space-y-24">

            {/* 1. Upcoming Matches Section */}
            <section>
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#667788]">Upcoming Matches</span>
                <Link to="/matches" className="text-[10px] text-[#445566] hover:text-white transition-colors">Calendar</Link>
              </div>
              <NextMatchesHomePage />
            </section>

            {/* 2. Recent Reviews Section */}
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#667788] mb-10 border-b border-white/5 pb-4">Recent reviews from the crowd</h2>
              {isLatestLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded"></div>)}
                </div>
              ) : latestReviews && latestReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {latestReviews.map((review) => (
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

            {/* 3. Popular / Trending Matches */}
            <section>
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#667788]">Trending on Kickr</span>
                <Link to="/matches" className="text-[10px] text-[#445566] hover:text-white transition-colors">Popular</Link>
              </div>
              <p className="text-[#445566] text-xs italic mb-8">Matches that everyone is talking about right now.</p>
              <NextMatchesHomePage />
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-16">
            {user && (
              <section className="bg-[#1b2228] border border-white/5 rounded p-8 shadow-xl">
                <h3 className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] mb-6">Your Recent Activity</h3>
                <div className="space-y-6">
                  {userReviews && userReviews.length > 0 ? (
                    userReviews.slice(0, 3).map(review => (
                      <Link key={review.id} to={`/matches/${review.match.id}`} className="flex items-center gap-4 group/sb p-3 -mx-3 rounded-xl hover:bg-white/5 transition-all">
                        {/* Rating Box */}
                        <div className="flex-shrink-0 w-12 h-12 bg-black/20 rounded-lg flex flex-col items-center justify-center border border-white/5 group-hover/sb:border-kickr/40 transition-colors">
                          <span className="text-kickr text-lg font-black italic leading-none">{review.note}</span>
                          <span className="text-[6px] text-[#445566] font-black uppercase tracking-widest mt-1">Note</span>
                        </div>

                        {/* Match Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <img src={review.match.homeLogo} alt="" className="w-3.5 h-3.5 object-contain opacity-80" />
                            <span className="text-white text-[10px] font-black tracking-tight truncate uppercase italic">{review.match.homeTeam}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img src={review.match.awayLogo} alt="" className="w-3.5 h-3.5 object-contain opacity-80" />
                            <span className="text-white text-[10px] font-black tracking-tight truncate uppercase italic">{review.match.awayTeam}</span>
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
                  <Link to={`/user/${user.id}`} className="block text-center text-[9px] font-bold uppercase tracking-widest text-[#99aabb] hover:text-white transition-colors pt-2">
                    View diary →
                  </Link>
                </div>
              </section>
            )}

            <section className="bg-[#1b2228] border border-white/5 rounded p-8 shadow-xl">
              <h3 className="text-[11px] font-black text-[#5c6470] uppercase tracking-[0.2em] mb-8">Kickr HQ Stats</h3>
              <div className="space-y-8">
                <Stat label="Matches Logged" value="1.2M" />
                <Stat label="Reviews this week" value="45K" />
                <Stat label="Active Members" value="280K" />
              </div>
            </section>

            {/* Trending Leagues */}
            <section>
              <h3 className="text-[11px] font-black text-[#5c6470] uppercase tracking-[0.2em] mb-8">Trending Leagues</h3>
              <div className="flex flex-col gap-5">
                <LeagueItem name="Premier League" />
                <LeagueItem name="La Liga" />
                <LeagueItem name="Champions League" />
                <LeagueItem name="Ligue 1" />
                <LeagueItem name="Serie A" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

const Stat = ({ label, value }: any) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-bold text-[#5c6470] uppercase tracking-widest mb-1">{label}</span>
    <span className="text-2xl font-black text-white italic">{value}</span>
  </div>
);

const LeagueItem = ({ name }: { name: string }) => (
  <div className="flex items-center justify-between group cursor-pointer border-b border-white/5 pb-2">
    <span className="text-xs font-bold text-[#99aabb] group-hover:text-white transition-colors">{name}</span>
    <span className="text-[#445566] transition-transform group-hover:translate-x-1">→</span>
  </div>
);
