import type { Match } from '../types/match';

const TIER_1 = [
    'UEFA Champions League',
    'Champions League',
    'Premier League',
    'La Liga',
    'Ligue 1',
    'Serie A',
    'Bundesliga'
];

const TIER_2 = [
    'UEFA Europa League',
    'Europa League',
    'UEFA Europa Conference League',
    'Conference League'
];

const getMatchWeight = (match: Match): number => {
    const compName = match.competition || '';

    if (TIER_1.some(name => compName.includes(name))) return 100;
    if (TIER_2.some(name => compName.includes(name))) return 50;

    return 10;
};

export const sortMatchesByHierarchy = (matches: Match[]): Match[] => {
    return [...matches].sort((a, b) => {
        const weightA = getMatchWeight(a);
        const weightB = getMatchWeight(b);

        if (weightA !== weightB) {
            return weightB - weightA;
        }

        // Secondarily sort by date (closest first for upcoming, most recent for finished)
        // Note: This logic might need refinement based on whether we are viewing finished or upcoming
        // For now, we assume upcoming matches are primary for this sorting
        return new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
    });
};
