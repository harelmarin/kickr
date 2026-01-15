import { motion } from 'framer-motion';

export const LandingMatchPreview = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-4xl mx-auto mt-20 relative px-4"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-kickr/20 via-transparent to-kickr/20 blur opacity-30"></div>

            <div className="relative bg-[#1a1e23] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                {/* Tactical Header */}
                <div className="bg-[#0a0b0d]/40 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 bg-kickr animate-pulse rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Live Analysis Hub</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Protocol: 0x7F2A</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-white/10"></div>)}
                        </div>
                    </div>
                </div>

                {/* Match Content */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-6 flex-1">
                        <div className="w-20 h-20 md:w-32 md:h-32 p-4 bg-white/[0.02] border border-white/5 rounded-sm flex items-center justify-center group hover:border-kickr transition-colors">
                            <img src="https://crests.football-data.org/57.png" alt="Arsenal" className="w-full h-full object-contain filter drop-shadow-2xl" />
                        </div>
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Arsenal</h3>
                    </div>

                    {/* Score & Stars */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-6 md:gap-10">
                            <span className="text-5xl md:text-8xl font-black text-white italic tabular-nums lining-nums tracking-tighter">3</span>
                            <div className="h-12 w-[1px] bg-white/10 rotate-12"></div>
                            <span className="text-5xl md:text-8xl font-black text-kickr italic tabular-nums lining-nums tracking-tighter">1</span>
                        </div>
                        <div className="flex gap-1 mt-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <span key={i} className="text-kickr text-xl md:text-2xl">★</span>
                            ))}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-6 flex-1">
                        <div className="w-20 h-20 md:w-32 md:h-32 p-4 bg-white/[0.02] border border-white/5 rounded-sm flex items-center justify-center group hover:border-kickr transition-colors">
                            <img src="https://crests.football-data.org/65.png" alt="Man City" className="w-full h-full object-contain filter drop-shadow-2xl" />
                        </div>
                        <h3 className="text-xl font-black text-white/60 italic tracking-tighter uppercase">Man City</h3>
                    </div>
                </div>

                {/* Tactical Review Extract */}
                <div className="px-8 md:px-12 pb-12">
                    <div className="bg-white/[0.02] border-l-2 border-kickr p-6 md:p-8 relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-12 h-12 text-kickr" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L21.017 3V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8C8.55228 16 9 15.5523 9 15V9C9 8.44772 8.55228 8 8 8H5C3.89543 8 3 7.10457 3 6V3L10 3V15C10 18.3137 7.31371 21 4 21H3Z" />
                            </svg>
                        </div>
                        <p className="text-white/80 text-sm md:text-lg font-medium leading-relaxed italic pr-12">
                            "Massive performance from Odegaard in the half-spaces. Arteta's press completely neutralized Rodri. The atmosphere at the Emirates was electric — one of those nights where the statistics only tell half the story."
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-sm bg-kickr/20 border border-kickr/40 flex items-center justify-center text-kickr font-black italic text-xs overflow-hidden">
                                KA
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] sm:text-[11px] font-black text-white hover:text-kickr transition-colors uppercase tracking-widest truncate">Kickr Admin</span>
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none mt-1">Tactician ID: #4402</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Labels */}
                <div className="bg-white/[0.01] border-t border-white/5 p-4 flex justify-between items-center px-8">
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
