import { Link } from 'react-router-dom';
import type { Match } from '../../types/match';

interface CompactMatchCardProps {
    match: Match;
}

export const CompactMatchCard = ({ match }: CompactMatchCardProps) => {
    // Determine status (finished vs upcoming) for potential styling tweaks if needed later
    const isFinished = new Date(match.matchDate) < new Date();

    return (
        <Link
            to={`/matches/${match.id}`}
            className="group relative bg-white/[0.02] border border-white/5 hover:border-kickr/40 hover:bg-white/[0.05] transition-all rounded-sm overflow-hidden block h-full flex flex-col"
        >
            {/* Minimal Header: Competition - Floating or tiny */}
            <div className="flex items-center justify-between px-2 py-1 border-b border-white/5 bg-white/[0.01] flex-shrink-0">
                <span className="text-[5.5px] md:text-[8px] font-black text-white/30 md:text-white/60 uppercase tracking-[0.1em] md:tracking-[0.3em] truncate italic">
                    {match.competition}
                </span>
                {!isFinished && (
                    <span className="md:hidden text-[5.5px] font-mono text-white/20 uppercase font-bold">
                        {new Date(match.matchDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Content: Combatants & Time/Score */}
            <div className="p-2 md:p-5 flex items-center justify-between gap-2 md:gap-4 flex-1">
                <div className="flex items-center md:flex-col gap-1.5 md:gap-2 flex-1 min-w-0">
                    <img src={match.homeLogo} className="w-5 h-5 md:w-10 md:h-10 object-contain group-hover:scale-110 transition-transform" alt={match.homeTeam} />
                    <span className="hidden md:block text-[10px] font-black text-white/60 uppercase italic truncate w-full text-center">{match.homeTeam}</span>
                </div>

                <div className="flex flex-col items-center flex-shrink-0">
                    {isFinished ? (
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 md:gap-2">
                                <span className="text-xs md:text-2xl font-black text-kickr italic tabular-nums leading-none tracking-tighter">{match.homeScore}</span>
                                <span className="text-[8px] md:text-[10px] text-white/20 font-black">-</span>
                                <span className="text-xs md:text-2xl font-black text-kickr italic tabular-nums leading-none tracking-tighter">{match.awayScore}</span>
                            </div>
                            <span className="text-[5.5px] md:text-[7px] font-mono text-white/30 uppercase tracking-widest font-bold mt-0.5">FT</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="text-xs md:text-xl font-black text-kickr italic tabular-nums leading-none tracking-tighter">
                                {new Date(match.matchDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            <span className="hidden md:block text-[7px] font-mono text-white/30 uppercase tracking-[0.2em] mt-1.5 font-bold">
                                {new Date(match.matchDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center md:flex-col gap-1.5 md:gap-2 flex-1 min-w-0">
                    <img src={match.awayLogo} className="w-5 h-5 md:w-10 md:h-10 object-contain group-hover:scale-110 transition-transform" alt={match.awayTeam} />
                    <span className="hidden md:block text-[10px] font-black text-white/60 uppercase italic truncate w-full text-center">{match.awayTeam}</span>
                </div>
            </div>
        </Link>
    );
};
