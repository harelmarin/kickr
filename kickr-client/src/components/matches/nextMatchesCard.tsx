import { MatchCard } from './MatchCard';
import { useNextMatches } from '../../hooks/useNextMatches';

export const NextMatchesHomePage = () => {
  const { data, isLoading } = useNextMatches(0, 6);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-[2/3] bg-[#2c3440] animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {data?.content.map((match) => (
        <MatchCard key={match.id} match={match} variant="poster" />
      ))}
    </div>
  );
};
