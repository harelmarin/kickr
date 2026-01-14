import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePopularReviews } from '../../hooks/useUserMatch';
import type { UserMatch } from '../../types/userMatch';

export const TopTeamsWidget = () => {
    const { data: popularReviews, isLoading } = usePopularReviews(20);

    const trendingTeams = useMemo(() => {
        if (!popularReviews || !Array.isArray(popularReviews)) return [];

        // Aggregate popularity by team (both home and away)
        const teams: Record<string, { count: number, logo: string }> = {};

        popularReviews.forEach((review: UserMatch) => {
            const home = review.match.homeTeam;
            const away = review.match.awayTeam;

            if (!teams[home]) teams[home] = { count: 0, logo: review.match.homeLogo };
            teams[home].count += 1 + (review.note / 10); // Weight by rating slightly

            if (!teams[away]) teams[away] = { count: 0, logo: review.match.awayLogo };
            teams[away].count += 1 + (review.note / 10);
        });

        return Object.entries(teams)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [popularReviews]);

    return (
        <section className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.5em] italic">Trending Clubs</h3>
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Global Hype</span>
            </div>
            <div className="space-y-6">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
                            <div className="h-2 w-24 bg-white/5 animate-pulse rounded"></div>
                        </div>
                    ))
                ) : trendingTeams.length > 0 ? (
                    trendingTeams.map((team, i) => (
                        <Link key={team.name} to={`/teams?search=${encodeURIComponent(team.name)}`} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-mono text-white/20 w-3">0{i + 1}</span>
                                <div className="w-8 h-8 flex items-center justify-center bg-white/[0.02] rounded-full border border-white/5 p-1.5 group-hover:border-kickr/50 transition-colors">
                                    <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[10px] font-black text-white/80 uppercase italic tracking-wider group-hover:text-kickr transition-colors max-w-[120px] truncate">
                                    {team.name}
                                </span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-kickr opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                    ))
                ) : (
                    <p className="text-[10px] text-white/20 italic">No trending data.</p>
                )}
            </div>
        </section>
    );
};
