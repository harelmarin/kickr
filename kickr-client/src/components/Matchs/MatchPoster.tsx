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
                className="block aspect-[2/3] bg-[#2c3440] rounded border border-white/10 overflow-hidden shadow-lg transition-all duration-300 group-hover:border-[var(--color-green-primary)] group-hover:shadow-[0_0_15px_rgba(0,224,84,0.2)] relative"
            >
                {/* Poster Content: Minimalist Team Visualization */}
                <div className="absolute inset-0 flex flex-col items-center justify-around py-8 px-4 bg-gradient-to-br from-[#1b2228] to-[#2c3440]">
                    <img src={match.homeLogo} alt="" className="w-16 h-16 object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-110" title={match.homeTeam} />
                    <div className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.4em]">VS</div>
                    <img src={match.awayLogo} alt="" className="w-16 h-16 object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-110" title={match.awayTeam} />
                </div>

                {/* Score Ribbon (Bottom) */}
                {isPast && (
                    <div className="absolute bottom-0 inset-x-0 bg-[var(--color-green-primary)] py-1.5 text-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        <span className="text-black font-black text-[12px] tracking-tight">
                            {match.homeScore} — {match.awayScore}
                        </span>
                    </div>
                )}

                {/* Hover Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </Link>

            {/* Title & Stats (Below Poster) */}
            <div className="flex flex-col px-0.5">
                <Link
                    to={`/matches/${match.id}`}
                    className="text-[12px] font-bold text-[#99aabb] group-hover:text-white transition-colors truncate"
                >
                    {match.homeTeam} v {match.awayTeam}
                </Link>

                <div className="flex items-center gap-1 mt-1">
                    <span className="text-[#5c6470] text-[10px] font-bold uppercase tracking-widest">
                        {new Date(match.matchDate).toLocaleDateString('fr', { day: '2-digit', month: 'short' })}
                    </span>
                </div>
            </div>
        </div>
    );
};
