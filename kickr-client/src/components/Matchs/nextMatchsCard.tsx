import type { Match } from '../../types/Match';

interface NextMatchsMiniCardProps {
  match: Match;
}

export const NextMatchesCardHomePage = ({ match }: NextMatchsMiniCardProps) => {
  return (
    <div className="card group cursor-pointer hover-lift">
      {/* Teams Section */}
      <div className="flex items-center justify-between gap-6 mb-6">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="w-20 h-20 bg-tertiary rounded-xl p-3 group-hover:scale-110 group-hover:bg-elevated transition-all duration-300 shadow-md">
            <img
              src={match.homeLogo}
              alt={match.homeTeam}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-semibold text-primary text-center line-clamp-2">
            {match.homeTeam}
          </span>
        </div>

        {/* VS Divider */}
        <div className="flex flex-col items-center gap-2 px-4">
          <div className="text-3xl font-display text-gradient-green">VS</div>
          <div className="w-12 h-0.5 bg-gradient-green"></div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="w-20 h-20 bg-tertiary rounded-xl p-3 group-hover:scale-110 group-hover:bg-elevated transition-all duration-300 shadow-md">
            <img
              src={match.awayLogo}
              alt={match.awayTeam}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm font-semibold text-primary text-center line-clamp-2">
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* Match Info */}
      <div className="space-y-3 pt-4 border-t border-primary">
        {/* Date & Time */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-bright" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary">
              {new Date(match.matchDate).toLocaleString('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>
        
        {/* Competition */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-tertiary">{match.competition}</p>
          </div>
        </div>
      </div>

      {/* Hover Action */}
      <div className="mt-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <button className="w-full btn btn-primary text-sm py-2.5 font-semibold">
          <span>Rate This Match</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
