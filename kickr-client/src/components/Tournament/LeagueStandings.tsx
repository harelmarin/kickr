import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface StandingEntry {
    rank: number;
    team: {
        id: number;
        name: string;
        logo: string;
    };
    points: number;
    goalsDiff: number;
    all: {
        played: number;
        win: number;
        draw: number;
        lose: number;
    };
    form: string;
}

interface LeagueStandingsProps {
    standingsJson?: string;
}

export const LeagueStandings: React.FC<LeagueStandingsProps> = ({ standingsJson }) => {
    if (!standingsJson) {
        return (
            <div className="py-32 flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-3xl">
                <div className="w-16 h-16 mb-8 text-[#223344] opacity-20">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" /></svg>
                </div>
                <p className="text-[#667788] uppercase tracking-[0.3em] text-[10px] font-black mb-2 text-center">Data Protocol Offline</p>
                <p className="text-[#445566] text-[11px] font-bold uppercase tracking-widest text-center max-w-sm px-12">
                    The ranking database has not yet been synchronized for this sequence.
                </p>
            </div>
        );
    }

    let standings: StandingEntry[] = [];
    try {
        const parsed = JSON.parse(standingsJson);
        // API Football returns an array of arrays (for multiple groups/phases)
        standings = Array.isArray(parsed[0]) ? parsed[0] : (Array.isArray(parsed) ? parsed : []);
    } catch (e) {
        return <div className="text-red-500">Error parsing standings</div>;
    }

    if (standings.length === 0) {
        return (
            <div className="py-32 flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-3xl">
                <div className="w-16 h-16 mb-8 text-[#223344] opacity-20">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" /></svg>
                </div>
                <p className="text-[#667788] uppercase tracking-[0.3em] text-[10px] font-black mb-2 text-center">Empty Ranks</p>
                <p className="text-[#445566] text-[11px] font-bold uppercase tracking-widest text-center max-w-sm px-12">
                    No ranking data found in the current sequence.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#14181c]">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/5">
                        <th className="py-4 px-6 text-[10px] font-black text-[#667788] uppercase tracking-[0.2em]">Rank</th>
                        <th className="py-4 px-6 text-[10px] font-black text-[#667788] uppercase tracking-[0.2em]">Squad</th>
                        <th className="py-4 px-4 md:px-6 text-[10px] font-black text-[#667788] uppercase tracking-[0.2em] text-center">P</th>
                        <th className="py-4 px-6 text-[10px] font-black text-[#667788] uppercase tracking-[0.2em] text-center hidden sm:table-cell">W</th>
                        <th className="py-4 px-6 text-[10px] font-black text-[#667788] uppercase tracking-[0.2em] text-center hidden sm:table-cell">D</th>
                        <th className="py-4 px-6 text-[10px] font-black text-[#667788] uppercase tracking-[0.2em] text-center hidden sm:table-cell">L</th>
                        <th className="py-4 px-6 text-[10px] font-black text-[#667788] uppercase tracking-[0.2em] text-center hidden sm:table-cell">GD</th>
                        <th className="py-4 px-4 md:px-6 text-[10px] font-black text-white uppercase tracking-[0.2em] text-center bg-kickr/20 border-x border-white/5">PTS</th>
                        <th className="py-4 px-6 text-[10px] font-black text-[#667788] uppercase tracking-[0.2em] text-center hidden md:table-cell">Form</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((entry, idx) => (
                        <motion.tr
                            key={entry.team.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                        >
                            <td className="py-4 px-6">
                                <span className={`text-xs font-black italic text-white`}>
                                    {entry.rank}
                                </span>
                            </td>
                            <td className="py-4 px-6">
                                <Link to={`/teams/${entry.team.id}`} className="flex items-center gap-4 hover:opacity-70 transition-opacity">
                                    <img src={entry.team.logo} className="w-6 h-6 object-contain transition-all" alt="" />
                                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">{entry.team.name}</span>
                                </Link>
                            </td>
                            <td className="py-4 px-4 md:px-6 text-center text-xs font-bold text-[#8899aa]">{entry.all.played}</td>
                            <td className="py-4 px-6 text-center text-xs font-bold text-[#8899aa] hidden sm:table-cell">{entry.all.win}</td>
                            <td className="py-4 px-6 text-center text-xs font-bold text-[#8899aa] hidden sm:table-cell">{entry.all.draw}</td>
                            <td className="py-4 px-6 text-center text-xs font-bold text-[#8899aa] hidden sm:table-cell">{entry.all.lose}</td>
                            <td className="py-4 px-6 text-center text-xs font-bold text-[#8899aa] hidden sm:table-cell">{entry.goalsDiff > 0 ? `+${entry.goalsDiff}` : entry.goalsDiff}</td>
                            <td className="py-4 px-4 md:px-6 text-center text-sm font-black text-white italic bg-kickr/5 border-x border-white/5">{entry.points}</td>
                            <td className="py-4 px-6 text-center hidden md:table-cell">
                                <div className="flex items-center justify-center gap-1">
                                    {entry.form?.split('').map((char, i) => (
                                        <span
                                            key={i}
                                            className={`w-4 h-4 rounded-[2px] text-[8px] flex items-center justify-center font-black ${char === 'W' ? 'bg-green-500/20 text-green-500' :
                                                char === 'L' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-white/10 text-white/40'
                                                }`}
                                        >
                                            {char}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
