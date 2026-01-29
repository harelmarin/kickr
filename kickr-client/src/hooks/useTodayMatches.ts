import { useNextMatches } from './useNextMatches';

export const useTodayMatches = () => {
    return useNextMatches(0, 50); // Get enough matches to cover today
};
