import { useParams, Link } from 'react-router-dom';
import { useTeam } from '../hooks/useTeams';
import { useMatchesByTeam } from '../hooks/useNextMatchs';
import { useState, useMemo } from 'react';
import type { Match } from '../types/Match';

export const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: team, isLoading: isLoadingTeam, isError: isErrorTeam } = useTeam(id!);
  const { data: allMatches, isLoading: isLoadingMatches } = useMatchesByTeam(id!);
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Tri côté client basé sur la date/heure actuelle
  const { upcomingMatches, pastMatches } = useMemo(() => {
    if (!allMatches) return { upcomingMatches: [], pastMatches: [] };
    
    const now = new Date();
    const upcoming: Match[] = [];
    const past: Match[] = [];

    allMatches.forEach((match) => {
      const matchDate = new Date(match.matchDate);
      if (matchDate > now) {
        upcoming.push(match);
      } else {
        past.push(match);
      }
    });

    // Tri : futurs (ascendant), passés (descendant)
    upcoming.sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime());
    past.sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());

    return { upcomingMatches: upcoming, pastMatches: past };
  }, [allMatches]);

  if (isLoadingTeam) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary text-lg">Loading team...</p>
        </div>
      </div>
    );
  }

  if (isErrorTeam || !team) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="card-glass p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">Error Loading Team</h3>
          <p className="text-secondary mb-6">Failed to load team details. Please try again later.</p>
          <Link to="/competitions" className="btn btn-primary">
            Back to Competitions
          </Link>
        </div>
      </div>
    );
  }

  const renderMatchCard = (match: Match, isPast: boolean) => {
    const matchDate = new Date(match.matchDate);
    const hasScore = match.homeScore !== null && match.awayScore !== null;
    
    return (
      <div key={match.id} className={`card p-6 hover-lift ${isPast ? 'opacity-90' : ''}`}>
        {/* Match Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="badge badge-green text-xs">{match.competition}</span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-secondary font-semibold">
              {matchDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="text-xs text-tertiary">
              {matchDate.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-16 h-16 bg-tertiary rounded-xl p-2 shadow-md">
              <img
                src={match.homeLogo}
                alt={match.homeTeam}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-primary text-center line-clamp-2">
              {match.homeTeam}
            </span>
            {hasScore && (
              <span className={`text-3xl font-display ${
                match.homeScore! > match.awayScore! ? 'text-green-bright' : 
                match.homeScore! < match.awayScore! ? 'text-red-primary' : 
                'text-primary'
              }`}>
                {match.homeScore}
              </span>
            )}
          </div>

          {/* VS or Status */}
          <div className="flex flex-col items-center gap-1">
            {isPast ? (
              hasScore ? (
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted uppercase font-semibold mb-1">Terminé</span>
                  <div className="w-8 h-0.5 bg-gradient-green"></div>
                </div>
              ) : (
                <span className="text-xs text-muted uppercase">Reporté</span>
              )
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-display text-gradient-green">VS</span>
                <span className="badge badge-green text-xs mt-2">À venir</span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-16 h-16 bg-tertiary rounded-xl p-2 shadow-md">
              <img
                src={match.awayLogo}
                alt={match.awayTeam}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-primary text-center line-clamp-2">
              {match.awayTeam}
            </span>
            {hasScore && (
              <span className={`text-3xl font-display ${
                match.awayScore! > match.homeScore! ? 'text-green-bright' : 
                match.awayScore! < match.homeScore! ? 'text-red-primary' : 
                'text-primary'
              }`}>
                {match.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        {match.location && (
          <div className="mt-4 pt-4 border-t border-primary flex items-center justify-center gap-2 text-xs text-tertiary">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{match.location}</span>
          </div>
        )}
      </div>
    );
  };

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
            {team.competitionId && (
              <>
                <Link to={`/competitions/${team.competitionId}`} className="text-tertiary hover:text-green-bright transition-colors">
                  Competition
                </Link>
                <svg className="w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
            <span className="text-secondary">{team.name}</span>
          </nav>

          {/* Team Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              {team.logoUrl ? (
                <div className="w-32 h-32 bg-tertiary rounded-2xl p-4 shadow-xl">
                  <img
                    src={team.logoUrl}
                    alt={team.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gradient-green rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-6xl font-display text-white">{team.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-display text-primary mb-3">
                {team.name}
              </h1>
              {team.country && (
                <div className="flex items-center gap-2 text-secondary text-lg mb-4">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{team.country}</span>
                </div>
              )}
              <div className="flex gap-3">
                <span className="badge badge-green">
                  {upcomingMatches.length} À venir
                </span>
                <span className="badge badge-red">
                  {pastMatches.length} Terminés
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-primary">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'upcoming'
                  ? 'text-green-bright'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Prochains Matchs ({upcomingMatches.length})
              {activeTab === 'upcoming' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-bright"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'past'
                  ? 'text-green-bright'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Matchs Passés ({pastMatches.length})
              {activeTab === 'past' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-bright"></div>
              )}
            </button>
          </div>

          {/* Matches Grid */}
          {isLoadingMatches ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-secondary">Chargement des matchs...</p>
            </div>
          ) : (
            <>
              {activeTab === 'upcoming' && (
                <div>
                  {upcomingMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingMatches.map((match) => renderMatchCard(match, false))}
                    </div>
                  ) : (
                    <div className="card-glass p-12 text-center">
                      <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Aucun Match Prévu</h3>
                      <p className="text-secondary">Aucun match programmé pour cette équipe.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'past' && (
                <div>
                  {pastMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastMatches.map((match) => renderMatchCard(match, true))}
                    </div>
                  ) : (
                    <div className="card-glass p-12 text-center">
                      <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-primary mb-2">Aucun Match Passé</h3>
                      <p className="text-secondary">Aucun historique de match disponible.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};
