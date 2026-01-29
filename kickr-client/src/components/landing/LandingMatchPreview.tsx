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

            <div className="relative bg-kickr-bg-secondary border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                <div className="bg-kickr-bg-primary/40 border-b border-white/5 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 bg-rating animate-pulse rounded-full"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary opacity-60">Featured Match Review</span>
                    </div>
                </div>

                {/* Match Content */}
                <div className="p-4 md:p-12 flex flex-row items-center justify-around gap-2 md:gap-12">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-2 md:gap-6 flex-1">
                        <div className="w-12 h-12 md:w-32 md:h-32 p-2 md:p-4 bg-black/[0.02] border border-white/5 rounded-sm flex items-center justify-center">
                            <img src="https://crests.football-data.org/57.png" alt="Arsenal" className="w-full h-full object-contain filter drop-shadow-xl" />
                        </div>
                        <h3 className="text-[10px] md:text-xl font-black text-main italic tracking-tighter uppercase truncate w-full text-center">Arsenal</h3>
                    </div>

                    {/* Score & Stars */}
                    <div className="flex flex-col items-center gap-1 md:gap-4">
                        <div className="flex items-center gap-3 md:gap-10">
                            <span className="text-2xl md:text-8xl font-black text-main italic tabular-nums lining-nums tracking-tighter">3</span>
                            <div className="h-6 md:h-12 w-[1px] bg-black/10 rotate-12"></div>
                            <span className="text-2xl md:text-8xl font-black text-main italic tabular-nums lining-nums tracking-tighter">1</span>
                        </div>
                        <div className="flex gap-0.5 mt-1 md:mt-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <span key={i} className="text-rating text-xs md:text-2xl">★</span>
                            ))}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-2 md:gap-6 flex-1">
                        <div className="w-12 h-12 md:w-32 md:h-32 p-2 md:p-4 bg-black/[0.02] border border-white/5 rounded-sm flex items-center justify-center">
                            <img src="https://crests.football-data.org/65.png" alt="Man City" className="w-full h-full object-contain filter drop-shadow-xl" />
                        </div>
                        <h3 className="text-[10px] md:text-xl font-black text-main/60 italic tracking-tighter uppercase truncate w-full text-center">Man City</h3>
                    </div>
                </div>

                <div className="px-4 md:px-12 pb-6 md:pb-12">
                    <div className="bg-white/[0.02] border-l-2 border-kickr/40 p-4 md:p-8 rounded-r-md">
                        <p className="text-main/80 text-sm md:text-lg font-medium leading-relaxed italic pr-0 md:pr-12">
                            "Massive performance from Odegaard in the half-spaces. Arteta's press completely neutralized Rodri."
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-kickr/10 border border-kickr/20 flex items-center justify-center text-kickr font-bold text-xs uppercase">
                                KA
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-main uppercase tracking-widest">Kickr Staff</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex bg-white/[0.01] border-t border-white/5 p-4 justify-between items-center px-8">
                    <div className="flex gap-6">
                        <span className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-30">Premier League</span>
                        <span className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-30">15 JAN 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-rating"></div>
                        <span className="text-[9px] font-bold text-rating uppercase tracking-widest">Verified Review</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
