import { Link } from 'react-router-dom';
import type { Match } from '../../types/Match';

interface NextMatchsMiniCardProps {
  match: Match;
}

export const NextMatchesCardHomePage = ({ match }: NextMatchsMiniCardProps) => {
  const matchDate = new Date(match.matchDate);
  const hasScore = match.homeScore !== null && match.awayScore !== null;

  return (
    <Link
      to={`/matches/${match.id}`}
      className="card p-2 hover-lift cursor-pointer group"
    >
      {/* Mini Logos - Plus grands et centrés */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {/* Home Logo */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <Link
            to={`/teams/${match.homeTeamId}`}
            onClick={(e) => e.stopPropagation()}
            className="w-14 h-14 bg-tertiary rounded-lg p-2 flex-shrink-0 kickr-touch"
          >
            <img
              src={match.homeLogo}
              alt={match.homeTeam}
              className="w-full h-full object-contain"
            />
          </Link>
          {hasScore && (
            <span className="text-lg font-display text-primary font-bold">
              {match.homeScore}
            </span>
          )}
        </div>

        {/* Separator */}
        <div className="flex-shrink-0 text-xs text-muted font-bold">
          {hasScore ? '-' : 'vs'}
        </div>

        {/* Away Logo */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <Link
            to={`/teams/${match.awayTeamId}`}
            onClick={(e) => e.stopPropagation()}
            className="w-14 h-14 bg-tertiary rounded-lg p-2 flex-shrink-0 kickr-touch"
          >
            <img
              src={match.awayLogo}
              alt={match.awayTeam}
              className="w-full h-full object-contain"
            />
          </Link>
          {hasScore && (
            <span className="text-lg font-display text-primary font-bold">
              {match.awayScore}
            </span>
          )}
        </div>
      </div>

      {/* Compact Footer */}
      <div className="text-center pt-2 border-t border-primary">
        <div className="text-xs font-semibold text-green-bright uppercase truncate mb-1">
          {match.competition}
        </div>
        <div className="text-xs text-tertiary">
          {matchDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
          {' • '}
          {matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </Link>
  );
};
