import { NextMatchesHomePage } from '../components/Matchs/nextMatchsClient';
import { Link } from 'react-router-dom';

export default function HomePage() {
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
            <span className="text-[var(--color-green-primary)]">Rate matchdays.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#99aabb] mb-12 font-medium max-w-3xl mx-auto leading-relaxed">
            The social network for football fans. Log every match you watch, share your tactical reviews, and keep a diary of your supporter life.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link to="/matches" className="bg-[var(--color-green-primary)] text-black font-black uppercase tracking-[0.2em] px-10 py-4 rounded text-xs hover:bg-[#3ef87b] transition-all">
              Get Started — It's Free
            </Link>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ActivityCard
                  user="TheTactician"
                  match="Man City v Real Madrid"
                  rating={4.5}
                  content="Une masterclass tactique. Le positionnement de Rodri a tout changé en deuxième période."
                />
                <ActivityCard
                  user="Kopite96"
                  match="Liverpool v Arsenal"
                  rating={5}
                  content="L'ambiance à Anfield était indescriptible. Ce match restera dans l'histoire de la Premier League."
                />
                <ActivityCard
                  user="Ultra_Paris"
                  match="PSG v Barcelona"
                  rating={2.5}
                  content="Trop de pertes de balles au milieu. La défense a manqué d'agressivité sur les transitions."
                />
                <ActivityCard
                  user="CalcioFan"
                  match="Inter v Milan"
                  rating={4}
                  content="Un derby della Madonnina comme on les aime. On sentait la tension dès l'échauffement."
                />
              </div>
            </section>

            {/* 3. Popular / Trending Matches (Reusing grid for now) */}
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
            <section className="bg-[#1b2228] border border-white/5 rounded p-8 shadow-xl">
              <h3 className="text-[11px] font-black text-[#5c6470] uppercase tracking-[0.2em] mb-8">Kickr HQ Stats</h3>
              <div className="space-y-8">
                <Stat label="Matches Logged" value="1.2M" />
                <Stat label="Reviews this week" value="45K" />
                <Stat label="Active Members" value="280K" />
              </div>
            </section>

            {/* Trending Leagues Without Fan Count */}
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

const ActivityCard = ({ user, match, rating, content }: any) => (
  <div className="bg-[#14181c] border-b border-white/5 pb-10 group">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-[#2c3440]"></div>
      <div className="flex flex-col">
        <span className="text-white text-xs font-bold hover:text-[var(--color-green-primary)] cursor-pointer transition-colors">{user}</span>
        <span className="text-[#5c6470] text-[10px] font-bold uppercase tracking-widest leading-none">Rated {match}</span>
      </div>
      <span className="ml-auto text-[var(--color-green-primary)] font-bold text-xs">
        {'★'.repeat(Math.floor(rating))}{rating % 1 !== 0 ? '½' : ''}
      </span>
    </div>
    <p className="text-sm text-[#99aabb] leading-relaxed italic line-clamp-3">"{content}"</p>
  </div>
);

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
