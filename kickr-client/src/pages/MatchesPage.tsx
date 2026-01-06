import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNextMatchs } from '../hooks/useNextMatchs';

export const MatchesPage = () => {
  const [page, setPage] = useState(0);
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const pageSize = 16;

  const { data, isLoading, isError } = useNextMatchs(page, pageSize);

  // Accumulate matches when new data arrives
  useEffect(() => {
    if (data?.content && data.content.length > 0) {
      setAllMatches(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNewMatches = data.content.filter(m => !existingIds.has(m.id));
        return uniqueNewMatches.length > 0 ? [...prev, ...uniqueNewMatches] : prev;
      });
    }
  }, [data]);

  const isLastPage = data?.last ?? true;

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
          <h3 className="text-xl font-semibold text-primary mb-2">Error Loading Matches</h3>
          <p className="text-secondary">Failed to load matches. Please try again later.</p>
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
            Upcoming Football
          </span>
          <h1 className="text-4xl font-display text-primary mb-3">
            Matches
          </h1>
          <p className="text-base text-secondary max-w-3xl">
            Discover upcoming matches, rate your favorites, and share your opinions with the community.
          </p>
        </div>

        {/* Matches Grid */}
        {allMatches.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
              {allMatches.map((match) => {
                const hasScore = match.homeScore !== null && match.awayScore !== null;

                return (
                  <Link
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className="card p-3 hover-lift cursor-pointer group"
                  >
                    {/* Logos */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {/* Home */}
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <Link
                          to={`/teams/${match.homeTeamId}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`w-14 h-14 rounded-lg p-2 flex-shrink-0 kickr-touch ${hasScore && match.homeScore! > match.awayScore!
                            ? 'bg-green-primary/20'
                            : hasScore && match.homeScore! < match.awayScore!
                              ? 'bg-tertiary/40'
                              : 'bg-tertiary'
                            }`}
                        >
                          <img
                            src={match.homeLogo}
                            alt={match.homeTeam}
                            className="w-full h-full object-contain"
                          />
                        </Link>
                        {hasScore && (
                          <span className={`text-xl font-display font-bold ${match.homeScore! > match.awayScore! ? 'text-green-bright' :
                            match.homeScore! < match.awayScore! ? 'text-secondary' :
                              'text-primary'
                            }`}>
                            {match.homeScore}
                          </span>
                        )}
                      </div>

                      {/* Separator */}
                      <div className="flex-shrink-0 text-xs text-muted font-bold">
                        {hasScore ? '-' : 'vs'}
                      </div>

                      {/* Away */}
                      <div className="flex flex-col items-center gap-1 flex-1">
                        <Link
                          to={`/teams/${match.awayTeamId}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`w-14 h-14 rounded-lg p-2 flex-shrink-0 kickr-touch ${hasScore && match.awayScore! > match.homeScore!
                            ? 'bg-green-primary/20'
                            : hasScore && match.awayScore! < match.homeScore!
                              ? 'bg-tertiary/40'
                              : 'bg-tertiary'
                            }`}
                        >
                          <img
                            src={match.awayLogo}
                            alt={match.awayTeam}
                            className="w-full h-full object-contain"
                          />
                        </Link>
                        {hasScore && (
                          <span className={`text-xl font-display font-bold ${match.awayScore! > match.homeScore! ? 'text-green-bright' :
                            match.awayScore! < match.homeScore! ? 'text-secondary' :
                              'text-primary'
                            }`}>
                            {match.awayScore}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-2 border-t border-primary">
                      <div className="text-xs font-semibold text-green-bright uppercase truncate mb-1">
                        {match.competition}
                      </div>
                      <div className="text-xs text-tertiary mb-2">
                        {new Date(match.matchDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                        {' • '}
                        {new Date(match.matchDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>

                      {/* Badge pour matchs terminés */}
                      {hasScore && (
                        <div className={`mt-1 py-1.5 px-2 rounded-md font-bold text-xs uppercase tracking-wide ${match.homeScore === match.awayScore
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-green-bright/15 text-green-bright'
                          }`}>
                          {match.homeScore === match.awayScore ? 'Draw' : 'Final'}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load More Button */}
            {!isLastPage && (
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
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary text-lg">Loading matches...</p>
          </div>
        ) : (
          <div className="card-glass p-12 text-center">
            <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">No Matches Found</h3>
            <p className="text-secondary">No matches available at the moment.</p>
          </div>
        )}
      </section>
    </main>
  );
};
