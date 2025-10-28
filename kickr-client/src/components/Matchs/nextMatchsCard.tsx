import type { Match } from '../../types/Match';

interface NextMatchsMiniCardProps {
  match: Match;
}

export const NextMatchesCardHomePage = ({ match }: NextMatchsMiniCardProps) => {
  return (
    <div className=" cursor-pointer bg-gray-900 hover:bg-gray-800 transition rounded-lg flex flex-col items-center p-6 text-center shadow-lg group">
      <div className="flex items-center gap-4 mb-2">
        <img
          src={match.homeLogo}
          alt={match.homeTeam}
          className="w-12 h-12 object-contain rounded-full transition-transform duration-300 "
        />
        <span className="text-white font-bold text-lg">vs</span>
        <img
          src={match.awayLogo}
          alt={match.awayTeam}
          className="w-12 h-12 object-contain rounded-full transition-transform duration-300"
        />
      </div>

      <div>
        <p className="text-sm font-semibold">
          {match.homeTeam} <p className="text-xl"> vs </p> {match.awayTeam}
        </p>
        <p className="text-gray-400 text-sm">{match.competition}</p>
        <p className="text-gray-500 text-sm">
          {new Date(match.matchDate).toLocaleString('fr-EU', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </p>
      </div>
    </div>
  );
};
