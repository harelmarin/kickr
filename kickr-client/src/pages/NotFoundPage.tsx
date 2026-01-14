import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: FC = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#0a0b0d] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>

            <div className="text-center px-8 flex flex-col items-center relative z-10">
                <div className="relative mb-8">
                    <h1 className="text-[140px] font-black text-white leading-none opacity-5 tracking-tighter italic">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-[1px] bg-kickr/40 animate-pulse"></div>
                    </div>
                </div>

                <h2 className="text-white text-2xl font-black italic uppercase tracking-tighter mb-2">
                    Sector <span className="text-kickr">Offline</span>
                </h2>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mb-12 italic">
                    The requested data node does not exist
                </p>

                <Link
                    to="/"
                    className="bg-kickr text-black text-[10px] font-black uppercase tracking-[0.3em] px-12 py-4 rounded-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-kickr/5 italic"
                >
                    Return to Base
                </Link>
            </div>
        </div>
    );
};
