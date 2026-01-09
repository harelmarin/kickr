import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Match } from '../../types/Match';

interface MatchCardProps {
    match: Match;
    variant?: 'default' | 'compact' | 'poster';
    className?: string; // Allow passing extra classes
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

    // Poster Variant Rendering
    if (isPoster) {
        return (
            <div className={`flex flex-col gap-3 group/card ${className}`}>
                <Link
                    to={`/matches/${match.id}`}
                    className="block aspect-[2/1] sm:aspect-[2.5/1] bg-[#1b2228] rounded-xl border border-white/5 overflow-hidden shadow-2xl transition-all duration-300 relative group/poster poster-hover-effect"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1b2228] to-[#252a31]"></div>

                    <div className="absolute inset-0 flex items-center justify-between px-6 py-4">
                        {/* Home Team */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <img src={match.homeLogo} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover/poster:scale-110" />
                            <span className="text-[8px] sm:text-[9px] font-black text-[#5c6470] uppercase tracking-widest text-center line-clamp-1 group-hover/poster:text-white transition-colors">{match.homeTeam}</span>
                        </div>

                        {/* Score / VS Center Area */}
                        <div className="flex items-center gap-4 sm:gap-6 px-4">
                            {isFinished ? (
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
                            <img src={match.awayLogo} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover/poster:scale-110" />
                            <span className="text-[8px] sm:text-[9px] font-black text-[#5c6470] uppercase tracking-widest text-center line-clamp-1 group-hover/poster:text-white transition-colors">{match.awayTeam}</span>
                        </div>
                    </div>

                    {/* Date / Time Overlay for upcoming matches - Bottom Edge */}
                    {!isFinished && (
                        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/5">
                            <div className="h-full bg-kickr/50 w-full animate-pulse shadow-[0_0_10px_rgba(68,102,255,0.5)]"></div>
                        </div>
                    )}
                </Link>

                {/* Bottom Meta Info */}
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[#5c6470] text-[9px] font-bold uppercase tracking-[0.2em]">
                            {dateStr}
                        </span>
                        {!isFinished && (
                            <>
                                <span className="text-white/10 text-[8px]">●</span>
                                <span className="text-[#8899aa] text-[9px] font-bold tracking-wider">
                                    {timeStr}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Default & Compact Rendering
    return (
        <Link to={`/matches/${match.id}`} className={`group block ${className}`}>
            <motion.div
                whileHover={{ x: 4 }}
                className={`bg-[#14181c] border border-white/5 rounded-xl transition-all hover:bg-white/[0.03] hover:border-white/10 flex items-center ${isCompact ? 'p-2 py-3' : 'p-4'
                    }`}
            >
                {/* 1. Date/Time Section - Fixed Width */}
                <div className={`flex flex-col items-start flex-shrink-0 ${isCompact ? 'w-[45px]' : 'w-[65px]'}`}>
                    <span className={`${isCompact ? 'text-[9px]' : 'text-[10px]'} font-black text-kickr uppercase tracking-tighter truncate w-full`}>
                        {isFinished ? 'FT' : timeStr}
                    </span>
                    <span className="text-[8px] font-bold text-[#445566] uppercase tracking-[0.1em] leading-none mt-1">
                        {dateStr}
                    </span>
                </div>

                {/* 2. Main Teams Content Wrapper */}
                <div className={`flex-1 flex items-center min-w-0 ${isCompact ? 'gap-1' : 'gap-4 px-2'}`}>

                    {/* Home Team Container - flex-1 min-w-0 for truncation */}
                    <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
                        <span className={`text-[10px] font-black text-white uppercase tracking-tight text-right truncate ${isCompact ? 'hidden xl:block' : 'hidden md:block'
                            }`}>
                            {match.homeTeam}
                        </span>
                        <div className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-white/5 p-1 flex-shrink-0 flex items-center justify-center`}>
                            <img src={match.homeLogo} alt="" className="w-full h-full object-contain filter group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    {/* Score/VS Center - Fixed Width */}
                    <div className={`${isCompact ? 'w-[35px]' : 'w-[60px]'} flex flex-col items-center flex-shrink-0`}>
                        {isFinished ? (
                            <div className="flex items-center gap-1">
                                <span className={`${isCompact ? 'text-xs' : 'text-base'} font-black italic display-font ${match.homeScore! > match.awayScore! ? 'text-white' : 'text-[#445566]'}`}>
                                    {match.homeScore}
                                </span>
                                <span className="text-[10px] text-white/20">-</span>
                                <span className={`${isCompact ? 'text-xs' : 'text-base'} font-black italic display-font ${match.awayScore! > match.homeScore! ? 'text-white' : 'text-[#445566]'}`}>
                                    {match.awayScore}
                                </span>
                            </div>
                        ) : (
                            <span className={`${isCompact ? 'text-[8px]' : 'text-[10px]'} font-black text-[#445566] uppercase italic w-full text-center transition-colors group-hover:text-kickr`}>VS</span>
                        )}
                    </div>

                    {/* Away Team Container - flex-1 min-w-0 for truncation */}
                    <div className="flex items-center justify-start gap-2 flex-1 min-w-0">
                        <div className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-white/5 p-1 flex-shrink-0 flex items-center justify-center`}>
                            <img src={match.awayLogo} alt="" className="w-full h-full object-contain filter group-hover:scale-110 transition-transform" />
                        </div>
                        <span className={`text-[10px] font-black text-white uppercase tracking-tight text-left truncate ${isCompact ? 'hidden xl:block' : 'hidden md:block'
                            }`}>
                            {match.awayTeam}
                        </span>
                    </div>
                </div>

                {/* 3. Meta Stats Section - Fixed Width (Hidden in compact) */}
                {!isCompact && (
                    <div className="flex items-center gap-4 w-[90px] flex-shrink-0 justify-end">
                        {match.averageRating && (
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-black text-kickr italic">{match.averageRating.toFixed(1)}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-kickr shadow-[0_0_8px_rgba(0,170,255,0.8)]"></div>
                                </div>
                                <span className="text-[8px] font-bold text-[#445566] uppercase tracking-widest">{match.reviewsCount} REVIEWS</span>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </Link>
    );
};
