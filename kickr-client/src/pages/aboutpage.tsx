import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: FC = () => {
    return (
        <main className="min-h-screen bg-[#0a0b0d] pt-32 pb-20 overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 relative">
                {/* Decorative background gradients */}
                <div className="absolute inset-x-0 h-full opacity-5 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-kickr/10 to-transparent"></div>
                </div>

                <header className="mb-20 relative">
                    <div className="flex items-center gap-4 mb-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="h-[1px] w-12 bg-kickr/40" />
                        <span className="text-[10px] font-black text-kickr uppercase tracking-[0.4em]">The Intelligence Agency</span>
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black text-white italic tracking-tighter uppercase leading-tight mb-8 animate-in slide-in-from-bottom-6 duration-700">
                        Every match is a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-kickr to-kickr/40">Tactical Intel.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-[#99aabb] leading-relaxed max-w-2xl font-medium animate-in slide-in-from-bottom-8 duration-900">
                        Kickr is the ultimate platform for football analysis, where fans become tacticians and every opinion is backed by data and passion.
                    </p>
                </header>

                <div className="space-y-24 relative">
                    {/* Mission Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Our Mission</h2>
                            <p className="text-[#8899aa] leading-relaxed">
                                We believe football is more than just scores and highlights. It's a complex game of chess played on grass. Our mission is to give every fan the tools to log their tactical journey, share their intel, and connect with a community that values deep analysis.
                            </p>
                        </div>
                        <div className="bg-[#1b2228] border border-white/5 p-8 rounded-2xl shadow-2xl skew-x-[-1deg]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-kickr/20 flex items-center justify-center text-kickr font-black italic border border-kickr/20">
                                    01
                                </div>
                                <span className="text-xs font-black text-white uppercase tracking-widest text-white/80">Log Every Game</span>
                            </div>
                            <p className="text-[13px] text-[#445566] leading-relaxed font-bold uppercase tracking-tight">
                                Never forget a masterclass or a disaster. Build your tactical diary one match at a time.
                            </p>
                        </div>
                    </section>

                    {/* Tactical Card Feature */}
                    <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-12 space-y-8">
                                <div className="space-y-4">
                                    <span className="text-kickr text-[10px] font-black uppercase tracking-[0.4em]">Proprietary Tech</span>
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                                        The Tactical <br /> Intelligence Card
                                    </h2>
                                </div>
                                <p className="text-[#8899aa] leading-relaxed text-sm">
                                    Every review you post generates a unique <span className="text-white font-bold">Tactical Card</span>. It's your digital signature on a match, featuring your rating, tactical observations, and the atmosphere you felt.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Rate matches from 0 to 5 with precision',
                                        'Log key tactical shifts and player impacts',
                                        'Share your intel instantly with the network',
                                        'Build your global tactician rating'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-white/60 uppercase tracking-wide">
                                            <div className="w-1.5 h-1.5 rounded-full bg-kickr" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gradient-to-br from-kickr/10 to-transparent p-12 flex items-center justify-center relative">
                                {/* Mockup of a Tactical Card */}
                                <div className="w-full max-w-[280px] aspect-[3/4] bg-[#121418] border-2 border-kickr/30 rounded-3xl p-6 shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-500 group relative">
                                    <div className="absolute top-4 right-4 text-kickr font-black italic text-2xl tracking-tighter">4.5</div>
                                    <div className="h-full flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-kickr uppercase tracking-widest">Match Intel</div>
                                            <div className="text-white font-black italic uppercase text-lg leading-tight">UCL Final <br /> 2026</div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-[2px] w-12 bg-kickr/40" />
                                            <p className="text-[#445566] text-[10px] font-bold uppercase leading-tight">
                                                "Masterclass in high-pressing and vertical transitions. The mid-block was impenetrable."
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Kickr Verified</div>
                                            <div className="w-8 h-8 rounded-full bg-kickr/20 border border-kickr/20" />
                                        </div>
                                    </div>
                                    {/* Decorative pulse effect */}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="space-y-12">
                        <div className="text-center">
                            <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.3em] mb-4 block">The Protocol</span>
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">How Kickr Works</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { title: 'Watch', desc: 'Experience the beautiful game across all major competitions.', icon: '⚽️' },
                                { title: 'Log', desc: 'Rate performances, note tactical shifts, and log your thoughts.', icon: '✍️' },
                                { title: 'Share', desc: 'Connect with other tacticians and compare your intel.', icon: '🔄' },
                            ].map((step, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:border-kickr/20 transition-all group">
                                    <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-500 block">{step.icon}</div>
                                    <h3 className="text-lg font-black text-white uppercase italic mb-3">{step.title}</h3>
                                    <p className="text-[#667788] text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-kickr p-12 rounded-3xl text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-black italic uppercase tracking-tighter mb-6">Ready to join the network?</h2>
                            <p className="text-black/70 font-bold uppercase text-xs tracking-widest mb-10 max-w-md mx-auto">
                                Start your tactical diary today and join thousands of tacticians worldwide.
                            </p>
                            <Link to="/register" className="inline-block bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] px-10 py-4 rounded-xl hover:scale-105 transition-all shadow-2xl">
                                Initialize Intel →
                            </Link>
                        </div>
                    </section>
                </div>

                <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <span className="text-[#445566] text-[10px] font-black uppercase tracking-widest">© 2026 KICKR AGENCY. ALL INTEL RESERVED.</span>
                    <div className="flex gap-8">
                        <Link to="/terms" className="text-[#445566] hover:text-kickr text-[10px] font-black uppercase tracking-widest transition-colors">Terms</Link>
                        <Link to="/community" className="text-[#445566] hover:text-kickr text-[10px] font-black uppercase tracking-widest transition-colors">Tacticians</Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
