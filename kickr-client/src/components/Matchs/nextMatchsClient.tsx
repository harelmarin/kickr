import { useState } from 'react';
import { useNextMatchs } from '../../hooks/useNextMatchs';
import { MatchPoster } from './MatchPoster';

export function NextMatchesHomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const matchesPerPage = 12; // Grid friendly

  const { data, isLoading } = useNextMatchs(
    currentPage,
    matchesPerPage,
  );

  const matches = data?.content || [];
  const isLastPage = data?.last ?? true;

  if (isLoading && matches.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* High-density Poster Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
        {matches.map((match) => (
          <MatchPoster key={match.id} match={match} />
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
