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
    <main className="min-h-screen bg-kickr-bg-primary pt-16 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-16">
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
            <h1 className="cinematic-header text-sm md:text-base">The Competitions</h1>
          </div>

          <div className="mt-4 md:mt-10">
            <div className="flex items-end justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex flex-col gap-1 w-full md:w-60">
                <span className="text-[10px] md:text-[11px] uppercase font-black text-muted tracking-[0.2em] pl-0.5 italic">Find Leagues</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted">🔍</span>
                  <input
                    type="text"
                    placeholder="SCAN..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search leagues"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-[11px] md:text-[12px] font-black text-main placeholder-white/20 focus:border-kickr/40 transition-all outline-none italic uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-base md:text-xl font-black text-main italic leading-none tracking-tighter">
                  {isLoading ? '...' : filteredCompetitions.length}
                </span>
                <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-muted font-bold mt-1">Found</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column: All Competitions Grid */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/5 pb-2 md:pb-4">
              <h2 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted italic">All Competitions</h2>
              <span className="text-[10px] md:text-[10px] font-black text-muted uppercase tracking-widest italic font-mono">STATUS: OPERATIONAL</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {isLoading ? (
                Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square bg-black/5 animate-pulse rounded-sm" />)
              ) : (
                filteredCompetitions.map((comp) => (
                  <Link key={comp.id} to={`/competitions/${comp.id}`} className="group relative block bg-black/[0.02] border border-white/5 hover:border-kickr/40 hover:bg-black/[0.04] hover:shadow-[0_0_20px_rgba(93,139,255,0.05)] transition-all rounded-sm p-3 md:p-4 overflow-hidden h-full">
                    <div className="flex flex-col items-center gap-3 md:gap-4 h-full">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center p-1 mt-auto">
                        <img
                          src={comp.logoUrl}
                          alt={comp.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-center text-[10px] md:text-[11px] font-black text-secondary group-hover:text-main transition-colors tracking-widest uppercase truncate w-full mb-auto">
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
