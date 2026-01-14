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
            {/* Header: Competition */}
            <div className="flex items-center justify-center px-3 py-1.5 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
                <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] truncate">
                    {match.competition}
                </span>
            </div>

            {/* Content: Combatants & Time/Score */}
            <div className="p-5 flex items-center justify-between gap-4 flex-1">
                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <img src={match.homeLogo} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" alt={match.homeTeam} />
                    <span className="text-[10px] font-black text-white/60 uppercase italic truncate w-full text-center">{match.homeTeam}</span>
                </div>

                <div className="flex flex-col items-center flex-shrink-0">
                    {isFinished ? (
                        <>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-black text-kickr italic tabular-nums leading-none tracking-tighter">{match.homeScore}</span>
                                <span className="text-[10px] text-white/20 font-black">-</span>
                                <span className="text-xl font-black text-kickr italic tabular-nums leading-none tracking-tighter">{match.awayScore}</span>
                            </div>
                            <span className="text-[7px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">FT</span>
                        </>
                    ) : (
                        <>
                            <span className="text-xl font-black text-kickr italic tabular-nums leading-none tracking-tighter">
                                {new Date(match.matchDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            <span className="text-[7px] font-mono text-white/30 uppercase tracking-[0.2em] mt-1.5 font-bold">
                                {new Date(match.matchDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase()}
                            </span>
                        </>
                    )}
                    <div className="w-4 h-[1px] bg-kickr/20 mt-2"></div>
                </div>

                <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <img src={match.awayLogo} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" alt={match.awayTeam} />
                    <span className="text-[10px] font-black text-white/60 uppercase italic truncate w-full text-center">{match.awayTeam}</span>
                </div>
            </div>
        </Link>
    );
};
