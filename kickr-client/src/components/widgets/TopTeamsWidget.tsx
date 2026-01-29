import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLatestReviews } from '../../hooks/useUserMatch';
import type { UserMatch } from '../../types/userMatch';

export const TopTeamsWidget = () => {
    const { data: latestReviews, isLoading } = useLatestReviews(200);

    const trendingTeams = useMemo(() => {
        if (!latestReviews || !Array.isArray(latestReviews)) return [];

        const teams: Record<string, { count: number, totalNote: number, name: string, logo: string, id?: string }> = {};

        latestReviews.forEach((review: UserMatch) => {
            const homeName = review.match.homeTeam;
            const homeId = review.match.homeTeamId || homeName;
            const awayName = review.match.awayTeam;
            const awayId = review.match.awayTeamId || awayName;

            if (!teams[homeId]) {
                teams[homeId] = {
                    count: 0,
                    totalNote: 0,
                    name: homeName,
                    logo: review.match.homeLogo,
                    id: review.match.homeTeamId
                };
            }
            teams[homeId].count += 1;
            teams[homeId].totalNote += review.note;

            if (!teams[awayId]) {
                teams[awayId] = {
                    count: 0,
                    totalNote: 0,
                    name: awayName,
                    logo: review.match.awayLogo,
                    id: review.match.awayTeamId
                };
            }
            teams[awayId].count += 1;
            teams[awayId].totalNote += review.note;
        });

        return Object.values(teams)
            .sort((a, b) => {
                // Combine rating and count into a weighted score
                // Score = average_rating * log(count + 1)
                const aAvg = a.totalNote / a.count;
                const bAvg = b.totalNote / b.count;
                const aScore = aAvg * Math.log(a.count + 1);
                const bScore = bAvg * Math.log(b.count + 1);

                if (Math.abs(bScore - aScore) > 0.01) {
                    return bScore - aScore;
                }
                return b.count - a.count;
            })
            .slice(0, 5);
    }, [latestReviews]);

    return (
        <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
            <div className="flex items-center justify-between mb-8 border-b border-white/[0.03] pb-6">
                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.5em] italic">Trending Clubs</h3>
                <span className="text-[8px] font-mono text-muted uppercase tracking-widest">Global Hype</span>
            </div>
            <div className="space-y-6">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-black/5 animate-pulse"></div>
                            <div className="h-2 w-24 bg-black/5 animate-pulse rounded"></div>
                        </div>
                    ))
                ) : trendingTeams.length > 0 ? (
                    trendingTeams.map((team, i) => (
                        <Link key={team.name} to={team.id ? `/teams/${team.id}` : `/matches?search=${encodeURIComponent(team.name)}`} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-mono text-muted w-3">0{i + 1}</span>
                                <div className="w-8 h-8 flex items-center justify-center bg-black/[0.02] rounded-full border border-white/5 p-1.5 group-hover:border-kickr/50 transition-colors">
                                    <img src={team.logo} alt={`${team.name} logo`} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[10px] font-black text-main uppercase italic tracking-wider group-hover:text-kickr transition-colors max-w-[120px] truncate">
                                    {team.name}
                                </span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-kickr opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                    ))
                ) : (
                    <p className="text-[10px] text-muted italic">No trending data.</p>
                )}
            </div>
        </section>
    );
};
