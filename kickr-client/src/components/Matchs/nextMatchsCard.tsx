import { Match } from '@/types/Match';

interface NextMatchsCardProps {
  match: Match;
}

export const NextMatchsCard = ({ match }: NextMatchsCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4">
        <img src={match.homeLogo} alt={match.homeTeam} className="w-16 h-16 object-contain" />
        <span className="font-semibold text-lg">{match.homeTeam}</span>
      </div>

      <span className="text-xl font-bold mx-2">vs</span>

      <div className="flex items-center gap-4">
        <img src={match.awayLogo} alt={match.awayTeam} className="w-16 h-16 object-contain" />
        <span className="font-semibold text-lg">{match.awayTeam}</span>
      </div>

      <div className="mt-2 md:mt-0 md:ml-auto text-gray-500 text-sm text-center">
        <p>{new Date(match.matchDate).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
        <p>{match.competition}</p>
        {match.location && <p>{match.location}</p>}
      </div>
    </div>
  );
};
