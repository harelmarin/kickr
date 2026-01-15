import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: FC = () => {
    return (
        <main className="min-h-screen bg-[#14181c] pt-20 md:pt-32 pb-16">
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                <header className="mb-12 md:mb-20">
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="h-[1px] md:h-[2px] w-4 md:w-6 bg-kickr" />
                        <span className="text-[8px] md:text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Intelligence Bureau</span>
                    </div>
                    <h1 className="text-3xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none mb-6 md:mb-8">
                        Every match is a <br />
                        <span className="text-kickr">Tactical Intel.</span>
                    </h1>
                    <p className="text-xs md:text-xl text-white/40 md:text-white/60 leading-relaxed max-w-2xl font-bold uppercase tracking-tight italic">
                        The ultimate platform for football analysis, where fans become tacticians and every opinion is backed by intel.
                    </p>
                </header>

                <div className="space-y-12 md:space-y-16">
                    {/* Mission Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-4 md:space-y-6">
                            <h2 className="text-[8px] md:text-[10px] font-black text-kickr uppercase tracking-[0.4em] mb-3 md:mb-4 border-b border-white/5 pb-3 md:pb-4 italic">Operational Mission</h2>
                            <p className="text-white/40 md:text-white/60 leading-relaxed text-[11px] md:text-sm font-bold uppercase tracking-tight">
                                We believe football is more than just scores. It's a game of chess played on grass. Our mission is to give every fan the tools to log their tactical journey and share their intel.
                            </p>
                        </div>
                        <div className="bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-sm">
                            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-sm bg-kickr/10 flex items-center justify-center text-kickr font-black italic border border-kickr/20 text-[10px] md:text-sm">
                                    01
                                </div>
                                <span className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-widest leading-none">Log Every Game</span>
                            </div>
                            <p className="text-[9px] md:text-[11px] text-white/20 leading-relaxed font-black uppercase tracking-widest italic">
                                Build your tactical diary one match at a time. Never forget a masterclass.
                            </p>
                        </div>
                    </section>

                    {/* Tactical Card Feature */}
                    <section className="bg-white/[0.01] border border-white/5 rounded-sm overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-6 md:p-12 space-y-6 md:space-y-8">
                                <div className="space-y-3 md:space-y-4">
                                    <span className="text-kickr text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] italic">Proprietary Intel</span>
                                    <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                                        The Tactical <br /> Intelligence Card
                                    </h2>
                                </div>
                                <p className="text-white/40 md:text-white/60 leading-relaxed text-[11px] md:text-sm font-black uppercase tracking-widest italic">
                                    Every review you post generates a unique <span className="text-kickr">Tactical Card</span>. It's your digital signature on a match.
                                </p>
                                <ul className="space-y-3 md:space-y-4">
                                    {[
                                        'Rate matches from 0 to 5',
                                        'Log key tactical shifts',
                                        'Share intel instantly',
                                        'Build your tactician rating'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 md:gap-3 text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest italic">
                                            <div className="w-1 h-1 rounded-full bg-kickr" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gradient-to-br from-kickr/5 to-transparent p-6 md:p-12 flex items-center justify-center">
                                {/* Mockup of a Tactical Card */}
                                <div className="w-full max-w-[220px] md:max-w-[280px] aspect-[3/4] bg-white/[0.02] border border-kickr/20 rounded-sm p-4 md:p-6 group relative">
                                    <div className="absolute top-3 right-4 text-kickr font-black italic text-xl md:text-2xl tracking-tighter leading-none">4.5</div>
                                    <div className="h-full flex flex-col justify-between">
                                        <div className="space-y-1.5 md:space-y-2">
                                            <div className="text-[7px] md:text-[10px] font-black text-kickr uppercase tracking-widest italic leading-none">INTEL RECORD</div>
                                            <div className="text-white font-black italic uppercase text-base md:text-lg leading-tight">UCL FINAL <br /> 2026</div>
                                        </div>
                                        <div className="space-y-3 md:space-y-4">
                                            <div className="h-[1px] md:h-[2px] w-8 md:w-12 bg-kickr/40" />
                                            <p className="text-white/20 text-[8px] md:text-[10px] font-black uppercase leading-[1.3] italic">
                                                "Masterclass in high-pressing and vertical transitions. The mid-block was impenetrable."
                                            </p>
                                        </div>
                                        <div className="pt-3 md:pt-4 border-t border-white/5 flex justify-between items-end">
                                            <div className="text-[6px] md:text-[8px] font-black text-white/10 uppercase tracking-[0.2em] italic leading-none">KICKR VERIFIED</div>
                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-kickr/20 border border-kickr/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="space-y-8 md:space-y-12">
                        <div className="text-center">
                            <span className="text-[7px] md:text-[9px] font-black text-white/10 uppercase tracking-[0.3em] mb-2 md:mb-4 block italic">The Protocol</span>
                            <h2 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter">Operational Protocol</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                            {[
                                { title: 'Watch', desc: 'Experience the game across all theaters of operation.', icon: '⚽️' },
                                { title: 'Log', desc: 'Rate performances, note tactical shifts, and log intel.', icon: '✍️' },
                                { title: 'Share', desc: 'Connect with tacticians and compare intel cards.', icon: '🔄' },
                            ].map((step, i) => (
                                <div key={i} className="bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-sm hover:border-kickr/20 transition-all text-center sm:text-left">
                                    <div className="text-2xl md:text-3xl mb-4 md:mb-6 block">{step.icon}</div>
                                    <h3 className="text-base md:text-lg font-black text-white uppercase italic mb-2 md:mb-3">{step.title}</h3>
                                    <p className="text-white/20 text-[11px] md:text-sm font-black uppercase tracking-widest italic leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-kickr p-8 md:p-12 rounded-sm text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-black italic uppercase tracking-tighter mb-4 md:mb-6">Initialize Connection</h2>
                        <p className="text-black/60 font-black uppercase text-[9px] md:text-xs tracking-[0.2em] mb-6 md:mb-10 max-w-xs md:max-w-md mx-auto italic">
                            Start your tactical diary today and join the worldwide network of intel.
                        </p>
                        <Link to="/register" className="inline-block bg-[#14181c] text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] px-8 md:px-10 py-3 md:py-4 rounded-sm hover:translate-y-[-2px] transition-all italic">
                            Initialize Intel →
                        </Link>
                    </section>
                </div>

                <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">© 2026 KICKR. ALL INTEL RESERVED.</span>
                    <div className="flex gap-8">
                        <Link to="/terms" className="text-white/40 hover:text-kickr text-[10px] font-black uppercase tracking-widest transition-colors">Terms</Link>
                        <Link to="/community" className="text-white/40 hover:text-kickr text-[10px] font-black uppercase tracking-widest transition-colors">Tacticians</Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
