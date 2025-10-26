import type { Match } from '../../types/Match';

interface NextMatchsMiniCardProps {
  match: Match;
}

export const NextMatchesCardHomePage = ({ match }: NextMatchsMiniCardProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-2 flex flex-col sm:flex-row items-center gap-2 hover:shadow-md transition-shadow text-sm bg-primary border-secondary-skinny">
      <div className="flex items-center gap-2">
        <img
          src={match.homeLogo}
          alt={match.homeTeam}
          className="w-10 h-10 object-contain"
        />
      </div>
      <span className="font-bold mx-1 text-sm">vs</span>
      <div className="flex items-center gap-2">
        <img
          src={match.awayLogo}
          alt={match.awayTeam}
          className="w-10 h-10 object-contain"
        />
      </div>
      <div className="mt-1 sm:mt-0 sm:ml-auto text-white-500 text-xs text-center">
        <p>
          {new Date(match.matchDate).toLocaleString('fr-EU', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </p>
        <p>{match.competition}</p>
      </div>
    </div>
  );
};
