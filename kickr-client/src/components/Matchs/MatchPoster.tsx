import { Link } from 'react-router-dom';
import type { Match } from '../../types/Match';
import { useMyUserMatches } from '../../hooks/useUserMatch';

interface MatchPosterProps {
    match: Match;
    className?: string;
}

/**
 * Vertical Match Poster - The iconic Letterboxd look.
 * Each match is a "Film" in the supporter's diary.
 */
export const MatchPoster = ({ match, className = '' }: MatchPosterProps) => {
    const isPast = match.homeScore !== null;
    const { data: myMatches } = useMyUserMatches();
    const myMatchEntry = myMatches?.find(m => m.match.matchUuid === match.matchUuid);

    return (
        <div className={`flex flex-col gap-2 group ${className}`}>
            {/* The Poster */}
            <Link
                to={`/matches/${match.id}`}
                className="block aspect-[2/3] bg-[#2c3440] rounded border border-white/10 overflow-hidden shadow-lg transition-all duration-300 poster-hover-effect relative"
            >
                {/* Poster Content: Minimalist Team Visualization */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 bg-gradient-to-br from-[#1b2228] to-[#2c3440]">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2">
                        <Link
                            to={`/teams/${match.homeTeamId}`}
                            className="transition-transform hover:scale-110 z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={match.homeLogo} alt="" className="w-14 h-14 object-contain filter drop-shadow-lg" title={match.homeTeam} />
                        </Link>
                        {isPast && (
                            <span className="text-xl font-black text-white italic display-font leading-none">{match.homeScore}</span>
                        )}
                    </div>

                    {/* VS Divider */}
                    <div className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.4em] my-1">VS</div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2">
                        {isPast && (
                            <span className="text-xl font-black text-white italic display-font leading-none">{match.awayScore}</span>
                        )}
                        <Link
                            to={`/teams/${match.awayTeamId}`}
                            className="transition-transform hover:scale-110 z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={match.awayLogo} alt="" className="w-14 h-14 object-contain filter drop-shadow-lg" title={match.awayTeam} />
                        </Link>
                    </div>
                </div>

                {/* Hover Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </Link>

            {/* Title & Stats (Below Poster) */}
            <div className="flex flex-col px-0.5">
                <div className="flex items-center justify-between mt-1">
                    <span className="text-[#5c6470] text-[10px] font-bold uppercase tracking-widest">
                        {new Date(match.matchDate).toLocaleDateString('fr', { day: '2-digit', month: 'short' })}
                    </span>
                    {isPast ? (
                        <div className="flex flex-col items-end">
                            {/* User's own rating if it exists - Now in Electric Blue */}
                            {myMatchEntry && (
                                <div className="text-[#4466ff] text-[9px] flex mb-0.5 drop-shadow-sm font-bold">
                                    {'★'.repeat(Math.round(myMatchEntry.note))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Show time for upcoming matches
                        <span className="text-[#8899aa] text-[10px] font-bold">
                            {new Date(match.matchDate).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
