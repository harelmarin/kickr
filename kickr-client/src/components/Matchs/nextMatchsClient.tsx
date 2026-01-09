import { useState } from 'react';
import { useNextMatchs } from '../../hooks/useNextMatchs';
import { MatchCard } from './MatchCard';

export function NextMatchesHomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const matchesPerPage = 9; // Grid friendly

  const { data, isLoading } = useNextMatchs(
    currentPage,
    matchesPerPage,
  );

  const matches = data?.content || [];
  const isLastPage = data?.last ?? true;

  if (isLoading && matches.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-[2.5/1] bg-white/5 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* High-density Horizontal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} variant="poster" />
        ))}
      </div>

      {/* Cinematic Pagination */}
      <div className="flex items-center justify-center gap-6 border-t border-white/5 pt-10">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#667788] hover:text-white disabled:opacity-20 transition-colors"
        >
          Previous
        </button>

        <span className="text-[#445566] text-[10px] font-black uppercase tracking-[0.3em]">
          Page {currentPage + 1}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={isLastPage}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#667788] hover:text-white disabled:opacity-20 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
