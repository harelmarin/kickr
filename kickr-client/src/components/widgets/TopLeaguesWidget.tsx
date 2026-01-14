import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePopularReviews } from '../../hooks/useUserMatch';
import type { UserMatch } from '../../types/userMatch';

export const TopLeaguesWidget = () => {
    const { data: popularReviews, isLoading } = usePopularReviews(20);

    const trendingLeagues = useMemo(() => {
        if (!popularReviews || !Array.isArray(popularReviews)) return [];
        const sectors: Record<string, { count: number, totalNote: number, logo?: string, id?: string }> = {};
        popularReviews.forEach((review: UserMatch) => {
            const name = review.match.competition;
            if (!sectors[name]) sectors[name] = { count: 0, totalNote: 0, logo: review.match.competitionLogo, id: review.match.competitionId };
            sectors[name].count++;
            sectors[name].totalNote += review.note;
        });
        return Object.entries(sectors)
            .map(([name, data]) => ({
                name,
                activity: data.count,
                rating: data.totalNote / data.count,
                logo: data.logo,
                id: data.id
            }))
            .sort((a, b) => b.activity - a.activity)
            .slice(0, 5);
    }, [popularReviews]);

    return (
        <section className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.5em] italic">Top Leagues</h3>
                <span className="text-[8px] font-mono text-kickr uppercase tracking-widest animate-pulse">Live Stats</span>
            </div>
            <div className="space-y-8">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-white/5 animate-pulse rounded-sm"></div>)
                ) : trendingLeagues.length > 0 ? (
                    trendingLeagues.map((sector, i) => (
                        <Link
                            key={sector.name}
                            to={sector.id ? `/competitions/${sector.id}` : `/matches?competition=${encodeURIComponent(sector.name)}`}
                            className="group relative block"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-mono text-white/20">0{i + 1}</span>
                                    {sector.logo && (
                                        <img src={sector.logo} alt="" className="w-4 h-4 object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                                    )}
                                    <span className="text-[10px] font-black text-white/80 uppercase italic tracking-widest group-hover:text-kickr transition-colors max-w-[120px] truncate">{sector.name}</span>
                                </div>
                                <span className="text-[10px] font-mono text-kickr italic">{sector.rating.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between mt-1 pt-1 border-t border-white/5">
                                <span className="text-[7px] font-mono text-white/10 uppercase tracking-widest">Popularity</span>
                                <span className="text-[7px] font-mono text-white/10 uppercase tracking-widest">Reports: {sector.activity}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-[10px] text-[#445566] italic font-bold">Waiting for sector synchronization...</p>
                )}
            </div>
        </section>
    );
};
