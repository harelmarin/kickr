import React from 'react';
import type { UserMatch } from '../../types/userMatch';

interface TacticalCardProps {
    review: UserMatch;
    cardRef: React.RefObject<HTMLDivElement | null>;
}

const getProxyUrl = (url: string) => {
    if (!url) return '';
    // If it's already a local URL or base64, don't proxy
    if (url.startsWith('data:') || url.startsWith('/') || url.startsWith(window.location.origin)) {
        return url;
    }

    // In production, just use relative path to avoid domain doubling issues
    if (window.location.hostname !== 'localhost' && !import.meta.env.VITE_API_URL) {
        return `/api/proxy/image?url=${encodeURIComponent(url)}`;
    }

    // Use environment variable or default
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    return `${baseUrl}/api/proxy/image?url=${encodeURIComponent(url)}`;
};

export const TacticalCard = ({ review, cardRef }: TacticalCardProps) => {
    return (
        <div
            ref={cardRef}
            className="w-[1080px] min-h-[1080px] bg-[#0d1117] flex flex-col p-16 relative"
            style={{ fontFamily: 'Inter, sans-serif' }}
        >
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]"></div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            {/* Header: Competition & Date */}
            <div className="flex justify-between items-center mb-16 z-10">
                <span className="text-[#4466ff] text-2xl font-black uppercase tracking-[0.2em]">
                    {review.match.competition}
                </span>
                <span className="text-white/40 text-2xl font-bold uppercase tracking-widest">
                    {new Date(review.watchedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
            </div>

            {/* Match Display */}
            <div className="flex flex-col items-center justify-center flex-1 z-10">
                <div className="flex items-center justify-center gap-20 mb-12">
                    <div className="flex flex-col items-center gap-6 w-[280px]">
                        <img src={getProxyUrl(review.match.homeLogo)} crossOrigin="anonymous" className="w-48 h-48 object-contain" alt="" />
                        <span className="text-white text-3xl font-black uppercase text-center tracking-tight leading-tight">
                            {review.match.homeTeam}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-10 bg-white/[0.03] border border-white/10 px-12 py-8 rounded-sm">
                            <span className="text-[120px] font-black text-white leading-none tabular-nums">{review.match.homeScore}</span>
                            <div className="w-[2px] h-24 bg-[#4466ff]/30"></div>
                            <span className="text-[120px] font-black text-white leading-none tabular-nums">{review.match.awayScore}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 w-[280px]">
                        <img src={getProxyUrl(review.match.awayLogo)} crossOrigin="anonymous" className="w-48 h-48 object-contain" alt="" />
                        <span className="text-white text-3xl font-black uppercase text-center tracking-tight leading-tight">
                            {review.match.awayTeam}
                        </span>
                    </div>
                </div>

                {/* Stars/Rating */}
                <div className="flex items-center gap-4 mb-20 bg-[#4466ff]/5 px-8 py-4 rounded-full border border-[#4466ff]/20">
                    <div className="flex text-[#4466ff] text-5xl">
                        {'★'.repeat(Math.round(review.note))}
                        <span className="text-white/5">{'★'.repeat(5 - Math.round(review.note))}</span>
                    </div>
                    {review.isLiked && (
                        <span className="text-[#ff8000] text-4xl ml-2">❤</span>
                    )}
                </div>

                {/* Commentary - adaptive height with safety limit */}
                {review.comment && (
                    <div className="w-full max-w-[800px] text-center px-10">
                        <p className="text-[#99aabb] text-[32px] leading-[1.5] font-medium">
                            {review.comment.length > 1000
                                ? `${review.comment.substring(0, 1000)}...`
                                : review.comment
                            }
                        </p>
                        {review.comment.length > 1000 && (
                            <p className="text-[#4466ff] text-[24px] font-bold uppercase tracking-wider mt-8">
                                Read full review on kickr.app
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer: User & Branding */}
            <div className="flex justify-between items-end mt-16 z-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full border-2 border-[#4466ff]/30 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                            {review.user?.avatarUrl ? (
                                <img src={getProxyUrl(review.user.avatarUrl)} crossOrigin="anonymous" alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-black text-white">{review.user?.name[0]}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white/40 text-xl font-bold uppercase tracking-widest leading-none mb-2">Tactician</span>
                        <span className="text-white text-3xl font-black uppercase tracking-tight">{review.user?.name}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#4466ff] flex items-center justify-center rounded-sm">
                            <span className="font-black text-white text-2xl uppercase">K</span>
                        </div>
                        <span className="text-white text-4xl font-black tracking-tighter uppercase">Kickr</span>
                    </div>
                    <span className="text-white/30 text-lg font-bold tracking-[0.3em] uppercase">kickr.app</span>
                </div>
            </div>
        </div>
    );
};
