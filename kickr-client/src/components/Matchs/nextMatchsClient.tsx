import { useState } from 'react';
import { useNextMatchs } from '../../hooks/useNextMatchs';

// @ts-ignore
import { NextMatchesCardHomePage } from './NextMatchsCard';

export function NextMatchesHomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const matchesPerPage = 12; // Augmenté pour grid 4 colonnes

  const { data, isLoading } = useNextMatchs(
    currentPage,
    matchesPerPage,
  );

  const matches = data?.content || [];
  const isLastPage = data?.last ?? true;

  return (
    <div className="flex flex-col gap-6">
      {/* Compact Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {matches.map((match) => (
          <NextMatchesCardHomePage key={match.id} match={match} />
        ))}
      </div>

      {/* Compact Pagination */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="btn btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="text-secondary text-sm font-semibold px-4">
          Page {currentPage + 1}
        </span>

        <button
          type="button"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={isLastPage}
          className="btn btn-secondary px-4 py-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      )}
    </div>
  );
}
