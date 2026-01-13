import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const TermsPage: FC = () => {
    return (
        <main className="min-h-screen bg-[#0a0b0d] pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-6">
                <header className="mb-16">
                    <Link to="/about" className="text-kickr text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-70 transition-opacity flex items-center gap-2 mb-8">
                        ← The Agency
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter uppercase mb-4">Legal Protocol</h1>
                    <p className="text-[#667788] text-xs uppercase tracking-[0.2em] font-bold">Terms & Infrastructure Intel • Last Modified Jan 2026</p>
                </header>

                <div className="space-y-12 prose prose-invert max-w-none">
                    {/* Infrastructure Section (formerly Legal Notice) */}
                    <section className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-6 border-b border-white/5 pb-4">0. Intelligence Infrastructure</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-kickr uppercase tracking-widest">Platform Editor</h3>
                                <ul className="list-none text-[#8899aa] text-sm space-y-1">
                                    <li>Agency Lead: <span className="text-white">Kickr</span></li>
                                    <li>Secure Intel: <span className="text-white">[VOTRE EMAIL]</span></li>
                                    <li>Status: Non-profit Research Project</li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-kickr uppercase tracking-widest">Data Hosting</h3>
                                <div className="text-[#8899aa] text-sm">
                                    <p className="font-bold text-white mb-2">Hetzner Online GmbH</p>
                                    <address className="not-italic opacity-80">
                                        Industriestr. 25, 91710 Gunzenhausen, DE
                                    </address>
                                    <p className="mt-2 text-[10px] opacity-60 uppercase tracking-tighter italic">Secured in European Data Centers</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-6 border-b border-white/5 pb-4">1. Acceptance of Protocol</h2>
                        <p className="text-[#8899aa] leading-relaxed text-sm">
                            By accessing or using the Kickr platform, you agree to be bound by these Terms of Service. If you do not agree to all of the terms and conditions, you are not authorized to use the service. We provide a platform for football match logging and tactical social interaction.
                        </p>
                    </section>

                    <section className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-6 border-b border-white/5 pb-4">2. Tactician Conduct</h2>
                        <p className="text-[#8899aa] leading-relaxed text-sm mb-4">
                            Users are responsible for the content they post. Kickr promotes a culture of respectful tactical debate. The following behaviors are prohibited:
                        </p>
                        <ul className="list-disc list-inside text-[#8899aa] text-sm space-y-2 ml-4">
                            <li>Harassment or hate speech towards other users or teams.</li>
                            <li>Posting spam or repetitive non-tactical content.</li>
                            <li>Attempting to circumvent security protocols or rate limits.</li>
                            <li>Intel theft: Impersonating other users or professional analysts.</li>
                        </ul>
                    </section>

                    <section className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-6 border-b border-white/5 pb-4">3. Data & Privacy (GDPR)</h2>
                        <p className="text-[#8899aa] leading-relaxed text-sm">
                            Your tactical intelligence is yours. In accordance with the GDPR, you have the right to access, rectify, and delete your personal data. We collect basic information (name, email) exclusively to provide the service. We do not sell your personal data. Your match logs are public by default to foster community analysis.
                        </p>
                    </section>

                    <section className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl">
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-6 border-b border-white/5 pb-4">4. Intellectual Property</h2>
                        <p className="text-[#8899aa] leading-relaxed text-sm">
                            All site design and branding are the property of Kickr Agency. Match data is provided by 3rd party APIs and remains the property of their respective owners. User-generated content remains yours, but you grant us a license to display it within our network.
                        </p>
                    </section>
                </div>

                <footer className="mt-20 pt-8 border-t border-white/5 text-center">
                    <span className="text-[#445566] text-[9px] font-black uppercase tracking-[0.4em]">Kickr Tactical Intelligence System v1.0</span>
                </footer>
            </div>
        </main>
    );
};
