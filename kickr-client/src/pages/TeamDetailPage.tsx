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

  // Version avec indicateurs de victoire/défaite très visibles
  const renderCompactMatchCard = (match: Match, isPast: boolean) => {
    const matchDate = new Date(match.matchDate);
    const hasScore = match.homeScore !== null && match.awayScore !== null;

    // Déterminer le résultat du point de vue de l'équipe
    let matchResult: 'win' | 'loss' | 'draw' | 'upcoming' = 'upcoming';

    if (hasScore && team) {
      const isHomeTeam = match.homeTeam === team.name;
      const teamScore = isHomeTeam ? match.homeScore! : match.awayScore!;
      const opponentScore = isHomeTeam ? match.awayScore! : match.homeScore!;

      if (teamScore > opponentScore) {
        matchResult = 'win';
      } else if (teamScore < opponentScore) {
        matchResult = 'loss';
      } else {
        matchResult = 'draw';
      }
    }

    // Classes de style basées sur le résultat
    const cardBgClass =
      matchResult === 'win' ? 'bg-green-primary/15 border-l-4 border-l-green-bright' :
        matchResult === 'loss' ? 'bg-red-primary/15 border-l-4 border-l-red-primary' :
          matchResult === 'draw' ? 'bg-yellow-500/15 border-l-4 border-l-yellow-500' :
            'border-l-4 border-l-transparent';

    return (
      <Link
        key={match.id}
        to={`/matches/${match.id}`}
        className={`card p-3 hover-lift cursor-pointer ${cardBgClass} ${isPast ? 'opacity-95' : ''}`}
      >
        {/* Logos des équipes */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {/* Home */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <Link
              to={`/teams/${match.homeTeamId}`}
              onClick={(e) => e.stopPropagation()}
              className="w-14 h-14 rounded-lg p-2 flex-shrink-0 kickr-touch bg-tertiary"
            >
              <img src={match.homeLogo} alt={match.homeTeam} className="w-full h-full object-contain" />
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
          <div className="text-xs text-muted font-bold">{hasScore ? '-' : 'vs'}</div>

          {/* Away */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <Link
              to={`/teams/${match.awayTeamId}`}
              onClick={(e) => e.stopPropagation()}
              className="w-14 h-14 rounded-lg p-2 flex-shrink-0 kickr-touch bg-tertiary"
            >
              <img src={match.awayLogo} alt={match.awayTeam} className="w-full h-full object-contain" />
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

        {/* Footer avec résultat */}
        <div className="text-center pt-2 border-t border-primary">
          <div className="text-xs font-semibold text-green-bright uppercase truncate mb-1">
            {match.competition}
          </div>
          <div className="text-xs text-tertiary mb-2">
            {matchDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
            {' • '}
            {matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>

          {/* Badge de résultat TRÈS visible */}
          {hasScore && matchResult !== 'upcoming' && (
            <div className={`mt-2 py-2 px-3 rounded-lg font-bold text-sm uppercase tracking-wide ${matchResult === 'win' ? 'bg-green-bright/30 text-green-bright' :
              matchResult === 'loss' ? 'bg-red-primary/30 text-red-primary' :
                'bg-yellow-500/30 text-yellow-500'
              }`}>
              {matchResult === 'win' ? 'Victory' : matchResult === 'loss' ? 'Defeat' : 'Draw'}
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <main className="flex flex-col min-h-screen bg-primary">
      {/* Compact Header */}
      <section className="bg-secondary border-b border-primary py-8">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs mb-4">
            <Link to="/competitions" className="text-tertiary hover:text-green-bright">Competitions</Link>
            <span className="text-tertiary">›</span>
            {team.competitionId && (
              <>
                <Link to={`/competitions/${team.competitionId}`} className="text-tertiary hover:text-green-bright">Competition</Link>
                <span className="text-tertiary">›</span>
              </>
            )}
            <span className="text-secondary">{team.name}</span>
          </nav>

          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              {team.logoUrl ? (
                <div className="w-20 h-20 bg-tertiary rounded-xl p-3 shadow-lg">
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-green-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-display text-white">{team.name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-display text-primary mb-2">{team.name}</h1>
              <div className="flex items-center gap-3">
                {team.country && (
                  <span className="text-sm text-secondary flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {team.country}
                  </span>
                )}
                <span className="badge badge-green text-xs">{upcomingMatches.length} Upcoming</span>
                <span className="badge badge-red text-xs">{pastMatches.length} Completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Compact Tabs */}
          <div className="flex gap-4 mb-6 border-b border-primary">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 text-sm font-semibold transition-colors relative ${activeTab === 'upcoming' ? 'text-green-bright' : 'text-secondary hover:text-primary'
                }`}
            >
              Upcoming ({upcomingMatches.length})
              {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-bright"></div>}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 text-sm font-semibold transition-colors relative ${activeTab === 'past' ? 'text-green-bright' : 'text-secondary hover:text-primary'
                }`}
            >
              Past ({pastMatches.length})
              {activeTab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-bright"></div>}
            </button>
          </div>

          {/* Compact Grid - 4 columns */}
          {isLoadingMatches ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-secondary">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'upcoming' && (
                upcomingMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {upcomingMatches.map((match) => renderCompactMatchCard(match, false))}
                  </div>
                ) : (
                  <div className="card-glass p-8 text-center">
                    <p className="text-secondary">No upcoming matches</p>
                  </div>
                )
              )}

              {activeTab === 'past' && (
                pastMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pastMatches.map((match) => renderCompactMatchCard(match, true))}
                  </div>
                ) : (
                  <div className="card-glass p-8 text-center">
                    <p className="text-secondary">No past matches</p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};
