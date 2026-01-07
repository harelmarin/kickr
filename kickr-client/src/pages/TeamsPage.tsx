import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchTeams } from '../hooks/useTeams';

export const TeamsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const pageSize = 24;

  const { data, isLoading } = useSearchTeams(search, page, pageSize);

  useEffect(() => {
    setAllTeams([]);
    setPage(0);
  }, [search]);

  useEffect(() => {
    if (data?.content && data.content.length > 0) {
      setAllTeams(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const uniqueNewTeams = data.content.filter(t => !existingIds.has(t.id));
        return [...prev, ...uniqueNewTeams];
      });
    }
  }, [data]);

  return (
    <main className="min-h-screen bg-[#0a0b0d] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase display-font">Football Clubs</h1>
          <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold">
            Browse the global database of teams
          </p>

          <div className="mt-12 flex items-center justify-between border-y border-white/5 py-4">
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teams..."
                className="w-full bg-[#1b2228] border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-kickr transition-all placeholder-[#445566]"
              />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#445566] font-bold">
              {data?.totalElements || 0} clubs found
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {allTeams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="group"
            >
              <div className="aspect-square bg-[#1b2228] rounded-md border border-white/5 p-6 flex items-center justify-center mb-3 transition-all duration-300 poster-hover-effect relative overflow-hidden">
                <img
                  src={team.logoUrl}
                  alt={team.name}
                  className="max-w-[60%] max-h-[60%] object-contain filter drop-shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-[11px] font-bold text-[#8899aa] text-center group-hover:text-white transition-colors tracking-tight uppercase truncate px-2">
                {team.name}
              </h3>
            </Link>
          ))}
        </div>

        {allTeams.length < (data?.totalElements || 0) && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={isLoading}
              className="btn-primary-kickr px-12 py-3 text-[11px] rounded"
            >
              {isLoading ? 'Searching...' : 'Load More Clubs'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
