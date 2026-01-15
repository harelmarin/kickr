import { motion } from 'framer-motion';

export const LandingMatchPreview = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-4xl mx-auto md:mt-20 relative px-4"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-kickr/20 via-transparent to-kickr/20 blur opacity-30"></div>

            <div className="relative bg-[#1a1e23] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                {/* Tactical Header */}
                <div className="bg-[#14181c]/40 border-b border-white/5 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="h-1.5 w-1.5 bg-kickr animate-pulse rounded-full"></div>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/40 italic">Live Analysis Hub</span>
                    </div>
                </div>

                {/* Match Content */}
                <div className="p-4 md:p-12 flex flex-row items-center justify-around gap-2 md:gap-12">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2 md:gap-6 flex-1">
                        <div className="w-12 h-12 md:w-32 md:h-32 p-2 md:p-4 bg-white/[0.02] border border-white/5 rounded-sm flex items-center justify-center">
                            <img src="https://crests.football-data.org/57.png" alt="Arsenal" className="w-full h-full object-contain filter drop-shadow-xl" />
                        </div>
                        <h3 className="text-[10px] md:text-xl font-black text-white italic tracking-tighter uppercase truncate w-full text-center">Arsenal</h3>
                    </div>

                    {/* Score & Stars */}
                    <div className="flex flex-col items-center gap-1 md:gap-4">
                        <div className="flex items-center gap-3 md:gap-10">
                            <span className="text-2xl md:text-8xl font-black text-white italic tabular-nums lining-nums tracking-tighter">3</span>
                            <div className="h-6 md:h-12 w-[1px] bg-white/10 rotate-12"></div>
                            <span className="text-2xl md:text-8xl font-black text-white italic tabular-nums lining-nums tracking-tighter">1</span>
                        </div>
                        <div className="flex gap-0.5 mt-1 md:mt-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <span key={i} className="text-kickr text-xs md:text-2xl">★</span>
                            ))}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 md:gap-6 flex-1">
                        <div className="w-12 h-12 md:w-32 md:h-32 p-2 md:p-4 bg-white/[0.02] border border-white/5 rounded-sm flex items-center justify-center">
                            <img src="https://crests.football-data.org/65.png" alt="Man City" className="w-full h-full object-contain filter drop-shadow-xl" />
                        </div>
                        <h3 className="text-[10px] md:text-xl font-black text-white/60 italic tracking-tighter uppercase truncate w-full text-center">Man City</h3>
                    </div>
                </div>

                {/* Tactical Review Extract */}
                <div className="px-4 md:px-12 pb-6 md:pb-12">
                    <div className="bg-white/[0.02] border-l-2 border-kickr p-4 md:p-8 relative">
                        <p className="text-white/80 text-[10px] md:text-lg font-medium leading-relaxed italic pr-0 md:pr-12">
                            "Massive performance from Odegaard in the half-spaces. Arteta's press completely neutralized Rodri."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-6 h-6 rounded-sm bg-kickr/20 border border-kickr/40 flex items-center justify-center text-kickr font-black italic text-[8px] overflow-hidden">
                                KA
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-white uppercase tracking-widest truncate">Kickr Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Footer Labels - Hidden on Mobile */}
                <div className="hidden md:flex bg-white/[0.01] border-t border-white/5 p-4 justify-between items-center px-8">
                    <div className="flex gap-4">
                        <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Comp: Premier League</span>
                        <span className="text-[8px] font-black text-white/10 uppercase tracking-widest">Date: 15 JAN 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-kickr"></div>
                        <span className="text-[8px] font-black text-kickr/60 uppercase tracking-widest italic">Authenticity Verified</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
