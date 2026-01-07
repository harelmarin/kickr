import { useState } from 'react';
import { useCompetitions } from '../hooks/useCompetitions';
import { Link } from 'react-router-dom';

export const CompetitionsPage = () => {
  const { data: competitions, isLoading } = useCompetitions();
  const [search, setSearch] = useState('');

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0b0d]">
        <div className="w-12 h-12 border-4 border-kickr border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const filteredCompetitions = (competitions || [])
    .filter(comp => comp.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-[#0a0b0d] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase display-font">Leagues</h1>
          <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold">
            Major football competitions around the globe
          </p>

          <div className="mt-12 flex items-center justify-between border-y border-white/5 py-4">
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leagues..."
                className="w-full bg-[#1b2228] border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-kickr transition-all placeholder-[#445566]"
              />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#445566] font-bold">
              {filteredCompetitions.length} leagues found
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredCompetitions.map((comp) => (
            <Link
              key={comp.id}
              to={`/competitions/${comp.id}`}
              className="group"
            >
              <div className="aspect-square bg-[#1b2228] rounded-md border border-white/5 p-8 flex items-center justify-center mb-4 transition-all duration-300 poster-hover-effect relative overflow-hidden">
                <img
                  src={comp.logoUrl}
                  alt={comp.name}
                  className="max-w-[75%] max-h-[75%] object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 relative z-10"
                />
              </div>
              <h3 className="text-center text-[11px] font-bold text-[#8899aa] group-hover:text-white transition-colors tracking-tight uppercase px-2 truncate">
                {comp.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};
