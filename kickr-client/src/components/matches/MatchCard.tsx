import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Match } from '../../types/match';

interface MatchCardProps {
    match: Match;
    variant?: 'default' | 'compact' | 'poster';
    className?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, variant = 'default', className = '' }) => {
    const isFinished = match.homeScore !== null && match.awayScore !== null;
    const matchDate = new Date(match.matchDate);
    const isCompact = variant === 'compact';
    const isPoster = variant === 'poster';

    const locale = 'en-US';

    const timeStr = matchDate.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const dateStr = matchDate.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short'
    });

    if (isPoster) {
        return (
            <div className={`flex flex-col gap-2 sm:gap-3 group/card ${className}`}>
                <Link
                    to={`/matches/${match.id}`}
                    className="block aspect-[2.2/1] sm:aspect-[2.5/1] bg-kickr-bg-secondary rounded-sm border border-white/5 overflow-hidden shadow-2xl transition-all duration-300 relative group/poster poster-hover-effect active:scale-[0.98]"
                    aria-label={`Match: ${match.homeTeam} vs ${match.awayTeam}. ${isFinished ? `Final score ${match.homeScore} to ${match.awayScore}` : `Starts at ${timeStr}`}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1b2228] to-[#252a31]"></div>

                    <div className="absolute inset-0 flex items-center justify-between px-3 py-2 sm:px-6 sm:py-4">
                        <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-0">
                            <img
                                src={match.homeLogo}
                                alt={`${match.homeTeam} official crest`}
                                loading="lazy"
                                decoding="async"
                                className="w-8 h-8 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover/poster:scale-110"
                            />
                            <span className="text-[10px] sm:text-[11px] font-bold text-secondary uppercase tracking-widest text-center line-clamp-1 group-hover/poster:text-main transition-colors w-full px-1">{match.homeTeam}</span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-6 px-1 sm:px-4">
                            {isFinished ? (
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <span className="text-lg sm:text-3xl font-bold text-main leading-none drop-shadow-lg">{match.homeScore}</span>
                                    <div className="w-[1px] sm:w-[2px] h-4 sm:h-8 bg-white/10 rounded-full"></div>
                                    <span className="text-lg sm:text-3xl font-bold text-main leading-none drop-shadow-lg">{match.awayScore}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="text-xl sm:text-3xl font-bold text-main tracking-tight tabular-nums drop-shadow-lg">{timeStr}</div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1 min-w-0">
                            <img
                                src={match.awayLogo}
                                alt={`${match.awayTeam} official crest`}
                                loading="lazy"
                                decoding="async"
                                className="w-8 h-8 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover/poster:scale-110"
                            />
                            <span className="text-[10px] sm:text-[11px] font-bold text-secondary uppercase tracking-widest text-center line-clamp-1 group-hover/poster:text-main transition-colors w-full px-1">{match.awayTeam}</span>
                        </div>
                    </div>

                    {!isFinished && (
                        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-black/5">
                            <div className="h-full bg-kickr/40 w-full"></div>
                        </div>
                    )}
                </Link>

                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-kickr text-[11px] font-black uppercase tracking-widest mr-1 truncate max-w-[100px]">
                            {match.competition}
                        </span>
                        <span className="text-main/10 text-[8px]">●</span>
                        <span className="text-main/60 text-[11px] font-bold uppercase tracking-[0.2em]">
                            {dateStr}
                        </span>
                        {!isFinished && (
                            <>
                                <span className="text-main/10 text-[8px]">●</span>
                                <span className="text-[#8899aa] text-[8px] sm:text-[9px] font-bold tracking-wider">
                                    {timeStr}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link
            to={`/matches/${match.id}`}
            className={`group block relative overflow-hidden bg-black/[0.02] border border-white/5 hover:border-kickr/20 hover:bg-white/[0.04] transition-all rounded-sm active:scale-[0.99] active:bg-black/[0.05] ${className}`}
            aria-label={`Match: ${match.homeTeam} vs ${match.awayTeam}. ${isFinished ? `Final score ${match.homeScore} to ${match.awayScore}` : `Starts at ${timeStr}`}`}
        >
            <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center justify-between px-4 py-2 gap-4 ${isCompact ? 'h-10' : 'h-12'}`}
            >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                    {/* Time / Status info */}
                    <div className="flex items-center gap-3 w-16 sm:w-20 flex-shrink-0">
                        <span className={`text-[10px] font-bold uppercase ${isFinished ? 'text-secondary opacity-40' : 'text-kickr'}`}>
                            {isFinished ? 'FT' : timeStr}
                        </span>
                    </div>

                    {/* Combatants Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0 border-l border-white/5 pl-6">
                        <div className="flex -space-x-1.5 flex-shrink-0">
                            <img src={match.homeLogo} className="w-5 h-5 sm:w-6 sm:h-6 object-contain z-10" alt={`${match.homeTeam} crest`} loading="lazy" decoding="async" />
                            <img src={match.awayLogo} className="w-5 h-5 sm:w-6 sm:h-6 object-contain border-l border-kickr-bg-primary" alt={`${match.awayTeam} crest`} loading="lazy" decoding="async" />
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-bold text-main/80 uppercase truncate max-w-[45%]">
                                {match.homeTeam}
                            </span>
                            <span className="text-[8px] font-bold text-secondary/20 flex-shrink-0">vs</span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-main/80 uppercase truncate max-w-[45%]">
                                {match.awayTeam}
                            </span>
                        </div>
                        <span className="hidden md:block text-[10px] font-bold text-main/30 uppercase tracking-widest ml-auto pl-4">{match.competition}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                    {/* Average Rating (if exists) */}
                    {match.averageRating !== undefined && match.averageRating !== null && !isCompact && (
                        <div className="hidden sm:flex items-center gap-1.5 bg-rating/10 px-2 py-0.5 border border-rating/20 rounded-sm">
                            <span className="text-rating text-[9px] font-bold">{match.averageRating.toFixed(1)}</span>
                        </div>
                    )}

                    {/* Final Score or Date */}
                    <div className="w-20 text-right">
                        {isFinished ? (
                            <span className="text-[14px] sm:text-[16px] font-bold text-main/90 font-mono group-hover:text-kickr transition-colors tracking-tight">
                                {match.homeScore}-{match.awayScore}
                            </span>
                        ) : (
                            <span className="text-[11px] font-bold text-secondary/40 uppercase tracking-widest">{dateStr}</span>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};
