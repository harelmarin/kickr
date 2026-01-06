import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchTeams } from '../hooks/useTeams';

export const TeamsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const { data, isLoading, isError } = useSearchTeams(search, page, pageSize);

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="card-glass p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Error Loading Teams</h3>
          <p className="text-secondary">Failed to load teams. Please try again later.</p>
        </div>
      </div>
    );
  }

  const teams = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  return (
    <main className="flex flex-col min-h-screen bg-primary">
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Header */}
        <div className="mb-12">
          <span className="text-green-bright text-sm font-semibold uppercase tracking-wider mb-3 block">
            Explore Football
          </span>
          <h1 className="text-6xl md:text-7xl font-display text-primary mb-4">
            Teams
          </h1>
          <p className="text-xl text-secondary max-w-3xl">
            Discover football teams from around the world. Search, explore, and follow your favorites.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0); // Reset to first page on search
              }}
              className="w-full pl-12 pr-4 py-4 bg-secondary border-2 border-primary text-primary placeholder-tertiary rounded-xl focus:outline-none focus:border-green-bright transition-colors text-lg"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setPage(0);
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-tertiary hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-tertiary">
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <span>
                {totalElements} team{totalElements !== 1 ? 's' : ''} found
                {search && <span className="text-green-bright"> for "{search}"</span>}
              </span>
            )}
          </div>
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary text-lg">Loading teams...</p>
          </div>
        ) : teams.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="card group text-center p-6 hover-lift"
                >
                  {/* Logo */}
                  <div className="mb-4 flex items-center justify-center">
                    {team.logoUrl ? (
                      <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="max-w-full max-h-full object-contain drop-shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-gradient-green rounded-xl text-2xl font-display text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {team.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Team Name */}
                  <h3 className="text-sm font-semibold text-primary line-clamp-2 group-hover:text-green-bright transition-colors">
                    {team.name}
                  </h3>

                  {/* Country */}
                  {team.country && (
                    <p className="text-xs text-tertiary mt-2 flex items-center justify-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {team.country}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="btn btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          page === pageNum
                            ? 'bg-green-primary text-white shadow-glow-green'
                            : 'bg-secondary text-secondary hover:bg-tertiary hover:text-primary'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="btn btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card-glass p-12 text-center">
            <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">No Teams Found</h3>
            <p className="text-secondary">
              {search
                ? `No teams match "${search}". Try a different search term.`
                : 'No teams available at the moment.'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
};
