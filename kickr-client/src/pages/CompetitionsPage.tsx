import { useState } from 'react';
import { useCompetitions } from '../hooks/useCompetitions';
import { Link } from 'react-router-dom';
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
    <main className="min-h-screen bg-[#14181c] pt-20 md:pt-32 pb-20 px-4 md:px-0">
      <div className="max-w-7xl mx-auto md:px-6">
        <header className="mb-6 md:mb-16">
          <div className="flex items-center gap-3 mb-2 md:mb-6">
            <div className="h-[1px] w-6 bg-kickr opacity-50" />
            <span className="text-[8px] md:text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Competitions</span>
          </div>
          <h1 className="text-2xl md:text-6xl font-black text-white mb-1 md:mb-4 italic tracking-tighter uppercase leading-none">
            The World <span className="text-kickr">Leagues</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.2em] text-[7px] md:text-[11px] font-bold">
            Browse top-tier football divisions worldwide.
          </p>

          <div className="mt-4 md:mt-10">
            <div className="flex items-end justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex flex-col gap-1 flex-1 max-w-[240px]">
                <span className="text-[7px] uppercase font-black text-white/20 tracking-[0.2em] pl-0.5">Identify League</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] opacity-20 italic">🔍</span>
                  <input
                    type="text"
                    placeholder="ENTER NAME..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-sm pl-7 pr-3 py-1.5 text-[10px] md:text-[11px] font-black text-white placeholder-white/5 focus:border-kickr/40 transition-all outline-none italic uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm md:text-xl font-black text-white italic leading-none tracking-tighter">
                  {isLoading ? '...' : filteredCompetitions.length}
                </span>
                <span className="text-[6px] md:text-[8px] uppercase tracking-widest text-white/20 font-bold mt-1">Active</span>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {isLoading ? (
                Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-sm" />)
              ) : (
                filteredCompetitions.map((comp) => (
                  <Link key={comp.id} to={`/competitions/${comp.id}`} className="group relative block bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all rounded-sm p-3 md:p-4 overflow-hidden h-full">
                    <div className="flex flex-col items-center gap-3 md:gap-4 h-full">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center p-1 mt-auto">
                        <img
                          src={comp.logoUrl}
                          alt={comp.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-center text-[7px] md:text-[9px] font-black text-white/40 md:text-white/60 group-hover:text-white transition-colors tracking-widest uppercase truncate w-full mb-auto">
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
