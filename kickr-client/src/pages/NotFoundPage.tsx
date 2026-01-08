import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: FC = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#0a0b0d] flex items-center justify-center">
            <div className="text-center px-8 flex flex-col items-center">
                <h1 className="display-font text-[120px] font-black text-white leading-none mb-2 opacity-10 tracking-tighter">
                    404
                </h1>
                <p className="text-[#99aabb] text-[13px] font-bold uppercase tracking-[0.2em] mb-8">
                    Page Not Found
                </p>
                <Link
                    to="/"
                    className="text-kickr text-[12px] font-black uppercase tracking-widest px-8 py-3 border border-kickr/20 rounded hover:bg-kickr/5 hover:border-kickr transition-all"
                >
                    Back home
                </Link>
            </div>
        </div>
    );
};
