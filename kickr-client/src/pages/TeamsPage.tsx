import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchTeams } from '../hooks/useTeams';

export const TeamsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const pageSize = 24;

  const { data, isLoading, isError } = useSearchTeams(search, page, pageSize);

  // Reset teams when search changes
  useEffect(() => {
    setAllTeams([]);
    setPage(0);
  }, [search]);

  // Accumulate teams when new data arrives
  useEffect(() => {
    if (data?.content && data.content.length > 0) {
      setAllTeams(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const uniqueNewTeams = data.content.filter(t => !existingIds.has(t.id));
        return uniqueNewTeams.length > 0 ? [...prev, ...uniqueNewTeams] : prev;
      });
    }
  }, [data]);

  const totalElements = data?.totalElements || 0;
  const hasMore = allTeams.length < totalElements;

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

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

  return (
    <main className="flex flex-col min-h-screen bg-primary">
      <section className="max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Header */}
        <div className="mb-8">
          <span className="text-green-bright text-xs font-semibold uppercase tracking-wider mb-2 block">
            Explore Football
          </span>
          <h1 className="text-4xl font-display text-primary mb-3">
            Teams
          </h1>
          <p className="text-base text-secondary max-w-3xl">
            Discover football teams from around the world. Search, explore, and follow your favorites.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <svg className="w-3.5 h-3.5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-secondary border border-primary text-primary placeholder-tertiary rounded-md focus:outline-none focus:border-green-bright transition-colors text-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-tertiary hover:text-primary transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-1.5 text-xs text-tertiary">
            {isLoading && page === 0 ? (
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
        {allTeams.length > 0 ? (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
              {allTeams.map((team) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="card group text-center p-3 hover-lift"
                >
                  {/* Logo */}
                  <div className="mb-3 flex items-center justify-center">
                    {team.logoUrl ? (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="max-w-full max-h-full object-contain drop-shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-green-primary rounded-lg text-xl font-display text-white shadow-lg">
                        {team.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Team Name */}
                  <h3 className="text-xs font-semibold text-primary line-clamp-2 group-hover:text-green-bright transition-colors">
                    {team.name}
                  </h3>

                  {/* Country */}
                  {team.country && (
                    <p className="text-xs text-tertiary mt-1.5 flex items-center justify-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {team.country}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="btn btn-primary px-8 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary text-lg">Loading teams...</p>
          </div>
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
