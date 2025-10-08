'use client';

import { useNextMatchs } from '@/hooks/useNextMatchs';
import { NextMatchsCard } from './nextMatchsCard';

export function NextMatchesClient() {
  const { data: matches, isLoading, isError } = useNextMatchs();

   console.log('Matches:', matches); 

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur !</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches && matches.length > 0 ? (
        matches.map((match) => <NextMatchsCard key={match.id} match={match} />)
      ) : (
        <p>Aucun match prévu</p>
      )}
    </div>
  );
}
