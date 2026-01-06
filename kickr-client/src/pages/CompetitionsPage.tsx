import { useCompetitions } from '../hooks/useCompetitions';
import { Link } from 'react-router-dom';

export const CompetitionsPage = () => {
  const { data: competitions, isLoading, isError } = useCompetitions();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary text-lg">Loading competitions...</p>
        </div>
      </div>
    );
    
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="card-glass p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Error Loading Competitions</h3>
          <p className="text-secondary">Failed to load competitions. Please try again later.</p>
        </div>
      </div>
    );

  return (
    <main className="flex flex-col min-h-screen bg-primary">
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        {/* Header */}
        <div className="mb-12">
          <span className="text-green-bright text-sm font-semibold uppercase tracking-wider mb-3 block">
            Explore Football
          </span>
          <h1 className="text-6xl md:text-7xl font-display text-primary mb-4">
            Competitions
          </h1>
          <p className="text-xl text-secondary max-w-3xl">
            Discover football competitions from around the world. Follow your favorites, track matches, and never miss the action.
          </p>
        </div>

        {/* Competitions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {competitions!.map((comp) => (
            <Link
              key={comp.id}
              to={`/competitions/${comp.id}`}
              className="card group text-center p-6 hover-lift"
            >
              {/* Logo */}
              <div className="mb-5 flex items-center justify-center">
                {comp.logoUrl ? (
                  <div className="w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={comp.logoUrl}
                      alt={comp.name}
                      className="max-w-full max-h-full object-contain drop-shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-gradient-green rounded-xl text-3xl font-display text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {comp.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Competition Name */}
              <h3 className="text-base font-semibold text-primary mb-2 line-clamp-2 group-hover:text-green-bright transition-colors">
                {comp.name}
              </h3>

              {/* Country */}
              {comp.country && (
                <p className="text-sm text-tertiary flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {comp.country}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};
