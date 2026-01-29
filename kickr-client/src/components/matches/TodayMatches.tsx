import { useTodayMatches } from '../../hooks/useTodayMatches';
import { sortMatchesByHierarchy } from '../../utils/matchSort';
import { CompactMatchCard } from './CompactMatchCard';

export function TodayMatches() {
    const { data, isLoading } = useTodayMatches();

    const rawMatches = data?.content || [];

    // Filter for today's matches only
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMatches = rawMatches.filter(match => {
        const matchDate = new Date(match.matchDate);
        return matchDate >= today && matchDate < tomorrow;
    });

    const matches = sortMatchesByHierarchy(todayMatches).slice(0, 6);

    if (isLoading && matches.length === 0) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-[1.5/1] md:aspect-[2.5/1] bg-black/5 animate-pulse rounded-sm" />
                ))}
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest">No matches today</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {matches.map((match) => (
                <CompactMatchCard key={match.id} match={match} />
            ))}
        </div>
    );
}
