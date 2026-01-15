import { useState } from 'react';
import { useCompetitions } from '../hooks/useCompetitions';
import { Link } from 'react-router-dom';
import { LeagueCardSkeleton } from '../components/ui/LoadingSkeletons';
import { EmptyState } from '../components/ui/EmptyState';
import { TopLeaguesWidget } from '../components/widgets/TopLeaguesWidget';
import { TopReviewsWidget } from '../components/widgets/TopReviewsWidget';

export const CompetitionsPage = () => {
  const { data: competitions, isLoading } = useCompetitions();
  const [search, setSearch] = useState('');

  const filteredCompetitions = (competitions || [])
    .filter(comp => comp.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-[#14181c] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-6 bg-kickr" />
            <span className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Competitions</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase">
            The World <span className="text-kickr">Leagues</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.25em] text-[11px] font-bold">
            Browse top-tier football divisions worldwide.
          </p>

          <div className="mt-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-white/5 p-6 bg-white/[0.02] rounded-sm gap-8">
              <div className="flex flex-col gap-2 w-full sm:w-80">
                <span className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] pl-1">Search League</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
                  <input
                    type="text"
                    placeholder="Enter league name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#14181c]/20 border border-white/5 rounded-sm pl-9 pr-4 py-2.5 text-base sm:text-[11px] font-bold text-white placeholder-white/20 focus:border-kickr/40 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-10 lg:border-l lg:border-white/5 lg:pl-10">
                <div className="flex flex-col items-end">
                  <span className="text-[20px] font-black text-white italic leading-none tracking-tighter">
                    {isLoading ? '...' : filteredCompetitions.length}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1">Leagues Active</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column: All Competitions Grid */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90 italic">All Competitions</h2>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 gap-4">
              {isLoading ? (
                Array.from({ length: 12 }).map((_, i) => <LeagueCardSkeleton key={i} />)
              ) : (
                filteredCompetitions.map((comp) => (
                  <Link key={comp.id} to={`/competitions/${comp.id}`} className="group relative block bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all rounded-sm p-4 overflow-hidden">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center p-1">
                        <img
                          src={comp.logoUrl}
                          alt={comp.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-center text-[9px] font-black text-white/60 group-hover:text-white transition-colors tracking-widest uppercase truncate w-full leading-tight">
                        {comp.name}
                      </h3>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {!isLoading && filteredCompetitions.length === 0 && (
              <EmptyState
                icon="🏆"
                title="No Competitions Found"
                description="Try adjusting your search query."
                actionLabel="Clear Search"
                onAction={() => setSearch('')}
              />
            )}
          </div>

          {/* Right Column: Sidebar (Top Leagues & Reviews) */}
          <div className="lg:col-span-4 space-y-8">
            <TopLeaguesWidget />
            <TopReviewsWidget />
          </div>

        </div>
      </div>
    </main>
  );
};
