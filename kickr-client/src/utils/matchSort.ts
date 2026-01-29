import type { Match } from '../types/match';


const getMatchWeight = (match: Match): number => {
    const compName = match.competition || '';

    if (compName.includes('UEFA Champions League')) return 1000;
    if (compName.includes('Premier League')) return 900;
    if (compName.includes('La Liga')) return 800;
    if (compName.includes('UEFA Europa League')) return 700;
    if (compName.includes('Bundesliga')) return 600;
    if (compName.includes('Serie A')) return 500;
    if (compName.includes('Ligue 1')) return 400;
    if (compName.includes('UEFA Europa Conference League')) return 300;

    return 100;
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
