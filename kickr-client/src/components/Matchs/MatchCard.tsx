import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Match } from '../../types/Match';

interface MatchCardProps {
    match: Match;
    variant?: 'default' | 'compact';
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, variant = 'default' }) => {
    const isFinished = match.homeScore !== null && match.awayScore !== null;
    const matchDate = new Date(match.matchDate);
    const isCompact = variant === 'compact';

    const timeStr = matchDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const dateStr = matchDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
    });

    return (
        <Link to={`/matches/${match.id}`} className="group block">
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
                            <span className={`${isCompact ? 'text-[8px]' : 'text-[10px]'} font-black text-[#445566] uppercase italic w-full text-center`}>VS</span>
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
                        {match.averageRating ? (
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs font-black text-kickr italic">{match.averageRating.toFixed(1)}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-kickr shadow-[0_0_8px_rgba(0,170,255,0.8)]"></div>
                                </div>
                                <span className="text-[8px] font-bold text-[#445566] uppercase tracking-widest">{match.reviewsCount} REVIEWS</span>
                            </div>
                        ) : (
                            <div className="w-1 h-4 bg-white/5 rounded-full"></div>
                        )}
                    </div>
                )}
            </motion.div>
        </Link>
    );
};
