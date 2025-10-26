import { useState } from 'react';
import { useNextMatchs } from '../../hooks/useNextMatchs';
import { NextMatchesCardHomePage } from './nextMatchsCard';

export function NextMatchesHomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const matchesPerPage = 9;

  const { data: matches = [], isLoading } = useNextMatchs(
    currentPage,
    matchesPerPage,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 transition-opacity duration-300 ease-in-out opacity-100">
        {matches.map((match) => (
          <NextMatchesCardHomePage key={match.id} match={match} />
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 rounded-lg border border-gray-500"
        >
          Previous
        </button>
        <span className="text-gray-300 flex items-center">
          Page {currentPage + 1}
        </span>
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 rounded-lg border border-gray-500"
        >
          Next
        </button>
      </div>
      {isLoading && <p>Loading more matches...</p>}{' '}
    </div>
  );
}
