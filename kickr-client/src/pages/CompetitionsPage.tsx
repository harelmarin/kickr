import { useState } from 'react';
import { useCompetitions } from '../hooks/useCompetitions';
import { Link } from 'react-router-dom';
import { LeagueCardSkeleton } from '../components/ui/LoadingSkeletons';

export const CompetitionsPage = () => {
  const { data: competitions, isLoading } = useCompetitions();
  const [search, setSearch] = useState('');

  const filteredCompetitions = (competitions || [])
    .filter(comp => comp.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-[#121212] pt-32 pb-20">
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
            Major football competitions around the globe
          </p>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between border border-white/5 bg-white/[0.02] rounded-sm p-6 gap-6">
            <div className="flex-1 max-w-md w-full relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search major leagues..."
                className="w-full bg-black/20 border border-white/5 rounded-sm pl-11 pr-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-kickr/40 transition-all placeholder-white/20"
              />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-white italic leading-none tabular-nums">
                {isLoading ? '...' : filteredCompetitions.length}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Leagues Active</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => <LeagueCardSkeleton key={i} />)
          ) : (
            filteredCompetitions.map((comp) => (
              <Link key={comp.id} to={`/competitions/${comp.id}`} className="group block">
                <div className="aspect-square bg-white/[0.02] rounded-sm border border-white/5 p-6 flex items-center justify-center mb-3 transition-all group-hover:border-white/10">
                  <img
                    src={comp.logoUrl}
                    alt={comp.name}
                    className="max-w-[70%] max-h-[70%] object-contain"
                  />
                </div>
                <h3 className="text-center text-[10px] font-black text-white/60 group-hover:text-white transition-colors tracking-widest uppercase px-2 truncate">
                  {comp.name}
                </h3>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
};
