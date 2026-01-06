import { Link } from 'react-router-dom';
import type { Match } from '../../types/Match';

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

    return (
        <div className={`flex flex-col gap-2 group ${className}`}>
            {/* The Poster */}
            <Link
                to={`/matches/${match.id}`}
                className="block aspect-[2/3] bg-[#2c3440] rounded border border-white/10 overflow-hidden shadow-lg transition-all duration-300 poster-hover-effect relative"
            >
                {/* Poster Content: Minimalist Team Visualization */}
                <div className="absolute inset-0 flex flex-col items-center justify-around py-8 px-4 bg-gradient-to-br from-[#1b2228] to-[#2c3440]">
                    <img src={match.homeLogo} alt="" className="w-16 h-16 object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-110" title={match.homeTeam} />
                    <div className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.4em]">VS</div>
                    <img src={match.awayLogo} alt="" className="w-16 h-16 object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-110" title={match.awayTeam} />
                </div>

                {/* Aesthetic floating score badge */}
                {isPast && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-[#1b2228]/90 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-3">
                            <span className="text-[13px] font-black text-white italic display-font leading-none">{match.homeScore}</span>
                            <div className="w-[1px] h-3 bg-white/10"></div>
                            <span className="text-[13px] font-black text-white italic display-font leading-none">{match.awayScore}</span>
                        </div>
                    </div>
                )}

                {/* Hover Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </Link>

            {/* Title & Stats (Below Poster) */}
            <div className="flex flex-col px-0.5">
                <Link
                    to={`/matches/${match.id}`}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-[#8899aa] group-hover:text-white transition-colors truncate uppercase tracking-tight"
                >
                    <span className="truncate">{match.homeTeam}</span>
                    <span className="text-[#3c444d]">•</span>
                    <span className="truncate">{match.awayTeam}</span>
                </Link>

                <div className="flex items-center justify-between mt-1">
                    <span className="text-[#5c6470] text-[10px] font-bold uppercase tracking-widest">
                        {new Date(match.matchDate).toLocaleDateString('fr', { day: '2-digit', month: 'short' })}
                    </span>
                    {match.averageRating && match.averageRating > 0 && (
                        <div className="flex items-center gap-0.5 text-kickr text-[10px] font-bold">
                            <span>★</span>
                            <span>{match.averageRating.toFixed(1)}</span>
                            {match.reviewsCount && match.reviewsCount > 0 && (
                                <span className="text-[#445566] ml-1">({match.reviewsCount})</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
