import { useParams, Link } from 'react-router-dom';
import { useCompetition } from '../hooks/useCompetitions';
import { useTeamsByCompetition } from '../hooks/useTeams';

export const CompetitionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: competition, isLoading: isLoadingCompetition, isError: isErrorCompetition } = useCompetition(id!);
  const { data: teams, isLoading: isLoadingTeams, isError: isErrorTeams } = useTeamsByCompetition(id!);

  if (isLoadingCompetition || isLoadingTeams) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary text-lg">Loading competition...</p>
        </div>
      </div>
    );
  }

  if (isErrorCompetition || isErrorTeams || !competition) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="card-glass p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Error Loading Competition</h3>
          <p className="text-secondary mb-6">Failed to load competition details. Please try again later.</p>
          <Link to="/competitions" className="btn btn-primary">
            Back to Competitions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-primary">
      {/* Header Section */}
      <section className="bg-secondary border-b border-primary py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/competitions" className="text-tertiary hover:text-green-bright transition-colors">
              Competitions
            </Link>
            <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-secondary">{competition.name}</span>
          </nav>

          {/* Competition Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              {competition.logoUrl ? (
                <div className="w-32 h-32 bg-tertiary rounded-2xl p-4 shadow-xl">
                  <img
                    src={competition.logoUrl}
                    alt={competition.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-green-primary rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-6xl font-display text-white">{competition.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-display text-primary mb-3">
                {competition.name}
              </h1>
              {competition.country && (
                <div className="flex items-center gap-2 text-secondary text-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{competition.country}</span>
                </div>
              )}
              <div className="mt-4">
                <span className="badge badge-green">
                  {teams?.length || 0} Teams
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-display text-primary mb-2">
              Teams
            </h2>
            <p className="text-secondary text-lg">
              All teams competing in {competition.name}
            </p>
          </div>

          {teams && teams.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {[...teams].sort((a, b) => a.name.localeCompare(b.name)).map((team) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="card group text-center p-6 hover-lift"
                >
                  {/* Logo */}
                  <div className="mb-4 flex items-center justify-center">
                    {team.logoUrl ? (
                      <div className="w-20 h-20 flex items-center justify-center">
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="max-w-full max-h-full object-contain drop-shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-green-primary rounded-xl text-2xl font-display text-white shadow-lg">
                        {team.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Team Name */}
                  <h3 className="text-sm font-semibold text-primary line-clamp-2 group-hover:text-green-bright transition-colors">
                    {team.name}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card-glass p-12 text-center">
              <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">No Teams Yet</h3>
              <p className="text-secondary">
                No teams have been added to this competition yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
