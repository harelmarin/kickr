import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLatestReviews } from '../../hooks/useUserMatch';
import type { UserMatch } from '../../types/userMatch';

export const TopLeaguesWidget = () => {
    const { data: latestReviews, isLoading } = useLatestReviews(200);

    const trendingLeagues = useMemo(() => {
        if (!latestReviews || !Array.isArray(latestReviews)) return [];
        const sectors: Record<string, { count: number, totalNote: number, logo?: string, name: string, id?: string }> = {};

        latestReviews.forEach((review: UserMatch) => {
            const competitionId = review.match.competitionId || review.match.competition;
            if (!competitionId) return;

            if (!sectors[competitionId]) {
                sectors[competitionId] = {
                    count: 0,
                    totalNote: 0,
                    logo: review.match.competitionLogo,
                    name: review.match.competition,
                    id: review.match.competitionId
                };
            }
            sectors[competitionId].count++;
            sectors[competitionId].totalNote += review.note;
        });

        return Object.values(sectors)
            .map((data) => ({
                name: data.name,
                activity: data.count,
                rating: data.totalNote / data.count,
                logo: data.logo,
                id: data.id
            }))
            // We use a weighted score: average_rating * log10(activity + 1)
            // This ensures high-rated leagues (like one 5-star Ligue 1 rating) 
            // can compete with high-volume leagues (like 50 3-star PL ratings).
            .sort((a, b) => {
                const aScore = a.rating * Math.log10(a.activity + 1);
                const bScore = b.rating * Math.log10(b.activity + 1);
                if (Math.abs(bScore - aScore) > 0.01) {
                    return bScore - aScore;
                }
                return b.activity - a.activity;
            })
            .slice(0, 5);
    }, [latestReviews]);

    return (
        <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
            <div className="flex items-center justify-between mb-8 border-b border-white/[0.03] pb-6">
                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.5em] italic">Top Leagues</h3>
                <span className="text-[8px] font-mono text-muted uppercase tracking-widest">Active Data</span>
            </div>
            <div className="space-y-8">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-black/5 animate-pulse rounded-sm"></div>)
                ) : trendingLeagues.length > 0 ? (
                    trendingLeagues.map((sector, i) => (
                        <Link
                            key={sector.name}
                            to={sector.id ? `/competitions/${sector.id}` : `/matches?competition=${encodeURIComponent(sector.name)}`}
                            className="group relative block"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-mono text-main/20">0{i + 1}</span>
                                    {sector.logo && (
                                        <img src={sector.logo} alt="" className="w-4 h-4 object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                                    )}
                                    <span className="text-[10px] font-bold text-main uppercase tracking-widest transition-colors max-w-[120px] truncate">{sector.name}</span>
                                </div>
                                <span className="text-[10px] font-bold text-rating tabular-nums">{sector.rating.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between mt-1 pt-1 border-t border-white/5">
                                <span className="text-[7px] font-mono text-main/10 uppercase tracking-widest">Popularity</span>
                                <span className="text-[7px] font-mono text-main/10 uppercase tracking-widest">Reports: {sector.activity}</span>
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
