import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNextMatches } from '../../hooks/useNextMatches';

export function NextMatchesHomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const matchesPerPage = 9; // Grid friendly

  const { data, isLoading } = useNextMatches(
    currentPage,
    matchesPerPage,
  );

  const matches = data?.content || [];
  const isLastPage = data?.last ?? true;

  if (isLoading && matches.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-[2.5/1] bg-white/5 animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Compact Tactical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <Link
            key={match.id}
            to={`/matches/${match.id}`}
            className="group relative bg-white/[0.02] border border-white/5 hover:border-kickr/40 hover:bg-white/[0.05] transition-all rounded-sm overflow-hidden"
          >
            {/* Header: Competition */}
            <div className="flex items-center justify-center px-3 py-1.5 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] truncate">
                {match.competition}
              </span>
            </div>

            {/* Content: Combatants & Time */}
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                <img src={match.homeLogo} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" alt="" />
                <span className="text-[10px] font-black text-white/60 uppercase italic truncate w-full text-center">{match.homeTeam}</span>
              </div>

              <div className="flex flex-col items-center flex-shrink-0">
                <span className="text-xl font-black text-kickr italic tabular-nums leading-none tracking-tighter">
                  {new Date(match.matchDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
                <span className="text-[7px] font-mono text-white/30 uppercase tracking-[0.2em] mt-1.5 font-bold">
                  {new Date(match.matchDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase()}
                </span>
                <div className="w-4 h-[1px] bg-kickr/20 mt-2"></div>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                <img src={match.awayLogo} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" alt="" />
                <span className="text-[10px] font-black text-white/60 uppercase italic truncate w-full text-center">{match.awayTeam}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Compact Pagination */}
      <div className="flex items-center justify-center gap-4 pt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="text-[9px] font-black uppercase tracking-widest text-[#445566] hover:text-white disabled:opacity-10 transition-all"
        >
          [ Prev ]
        </button>
        <span className="text-kickr text-[10px] font-black tracking-[0.3em] font-mono">{currentPage + 1}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={isLastPage}
          className="text-[9px] font-black uppercase tracking-widest text-[#445566] hover:text-white disabled:opacity-10 transition-all"
        >
          [ Next ]
        </button>
      </div>
    </div>
  );
}
