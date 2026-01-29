import { useState } from 'react';
import { useNextMatches } from '../../hooks/useNextMatches';
import { sortMatchesByHierarchy } from '../../utils/matchSort';
import { CompactMatchCard } from './CompactMatchCard';

export function NextMatchesHomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const matchesPerPage = 9; // Grid friendly

  const { data, isLoading } = useNextMatches(
    currentPage,
    matchesPerPage,
  );

  const rawMatches = data?.content || [];
  const matches = sortMatchesByHierarchy(rawMatches).slice(0, 9);
  const isLastPage = data?.last ?? true;

  if (isLoading && matches.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-[1.5/1] md:aspect-[2.5/1] bg-black/5 animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Match Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {matches.map((match) => (
          <CompactMatchCard key={match.id} match={match} />
        ))}
      </div>

      {/* Compact Pagination */}
      <div className="flex items-center justify-center gap-4 pt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="text-[9px] font-black uppercase tracking-widest text-[#445566] hover:text-main disabled:opacity-10 transition-all"
        >
          [ Prev ]
        </button>
        <span className="text-kickr text-[10px] font-black tracking-[0.3em] font-mono">{currentPage + 1}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={isLastPage}
          className="text-[9px] font-black uppercase tracking-widest text-[#445566] hover:text-main disabled:opacity-10 transition-all"
        >
          [ Next ]
        </button>
      </div>
    </div>
  );
}
