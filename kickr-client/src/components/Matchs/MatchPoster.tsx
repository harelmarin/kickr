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
        <div className={`flex flex-col gap-3 group ${className}`}>
            {/* The Ticket / Horizontal Poster */}
            <Link
                to={`/matches/${match.id}`}
                className="block aspect-[2/1] sm:aspect-[2.5/1] bg-[#1b2228] rounded-xl border border-white/5 overflow-hidden shadow-2xl transition-all duration-300 relative group/poster poster-hover-effect"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b2228] to-[#252a31]"></div>

                <div className="absolute inset-0 flex items-center justify-between px-6 py-4">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <img src={match.homeLogo} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500" />
                        <span className="text-[8px] sm:text-[9px] font-black text-[#5c6470] uppercase tracking-widest text-center line-clamp-1">{match.homeTeam}</span>
                    </div>

                    {/* Score / VS Center Area */}
                    <div className="flex items-center gap-4 sm:gap-6 px-4">
                        {isPast ? (
                            <div className="flex items-center gap-3">
                                <span className="text-2xl sm:text-3xl font-black text-white italic leading-none drop-shadow-lg">{match.homeScore}</span>
                                <div className="w-[2px] h-8 bg-kickr/60 rounded-full"></div>
                                <span className="text-2xl sm:text-3xl font-black text-white italic leading-none drop-shadow-lg">{match.awayScore}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="text-[10px] font-black text-kickr/50 uppercase tracking-[0.4em] italic">VS</div>
                            </div>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <img src={match.awayLogo} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500" />
                        <span className="text-[8px] sm:text-[9px] font-black text-[#5c6470] uppercase tracking-widest text-center line-clamp-1">{match.awayTeam}</span>
                    </div>
                </div>

                {/* Date / Time Overlay for upcoming matches - Bottom Edge */}
                {!isPast && (
                    <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/5">
                        <div className="h-full bg-kickr/50 w-full animate-pulse shadow-[0_0_10px_rgba(68,102,255,0.5)]"></div>
                    </div>
                )}
            </Link>

            {/* Bottom Meta Info */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="text-[#5c6470] text-[9px] font-bold uppercase tracking-[0.2em]">
                        {new Date(match.matchDate).toLocaleDateString('fr', { day: '2-digit', month: 'short' })}
                    </span>
                    {!isPast && (
                        <>
                            <span className="text-white/10 text-[8px]">●</span>
                            <span className="text-[#8899aa] text-[9px] font-bold tracking-wider">
                                {new Date(match.matchDate).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </>
                    )}
                </div>


            </div>
        </div>
    );
};
