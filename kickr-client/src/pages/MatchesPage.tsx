import { useState } from 'react';
import { useNextMatchs } from '../hooks/useNextMatchs';
import { MatchPoster } from '../components/Matchs/MatchPoster';

export const MatchesPage = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useNextMatchs(page, 18); // Large grid

  if (isError) return <ErrorState />;

  return (
    <main className="min-h-screen bg-[#14181c] py-16">
      <div className="max-w-7xl mx-auto px-6">

        <header className="mb-16">
          <h1 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase display-font">Matches</h1>
          <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold">
            Explore {data?.totalElements || '...'} matchdays on Kickr
          </p>

          {/* Letterboxd Style Filter/Bar */}
          <div className="mt-12 flex items-center justify-between border-y border-white/5 py-4">
            <div className="flex items-center gap-10">
              <Filter label="Browse by" value="League" />
              <Filter label="Year" value="2024" />
              <Filter label="Sort by" value="Popularity" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#445566] font-bold">
              Page {page + 1} of {data?.totalPages || 1}
            </div>
          </div>
        </header>

        {/* Poster Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded" />
            ))
          ) : (
            data?.content.map((match) => (
              <MatchPoster key={match.id} match={match} />
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-24 flex justify-center gap-10 border-t border-white/5 pt-10">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-[11px] font-black uppercase tracking-[0.2em] text-[#667788] hover:text-white transition-colors disabled:opacity-20"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={data?.last}
            className="text-[11px] font-black uppercase tracking-[0.2em] text-[#667788] hover:text-white transition-colors disabled:opacity-20"
          >
            Next
          </button>
        </div>

      </div>
    </main>
  );
};

const Filter = ({ label, value }: { label: string; value: string }) => (
  <button className="flex flex-col items-start group">
    <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em] mb-1">{label}</span>
    <span className="text-[11px] font-bold text-[#8899aa] group-hover:text-white transition-colors">{value}</span>
  </button>
);

const ErrorState = () => (
  <div className="min-h-screen flex items-center justify-center text-center p-12 bg-[#14181c]">
    <div className="max-w-md">
      <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Connexion Interrompue</h2>
      <p className="text-[#667788] text-sm mb-8 leading-relaxed">Les tribunes sont vides... Il semble y avoir un souci de connexion avec les serveurs de matchs.</p>
      <button onClick={() => window.location.reload()} className="text-[var(--color-primary)] font-black uppercase tracking-widest text-xs border border-[var(--color-primary)]/20 px-8 py-3 rounded hover:bg-[var(--color-primary)]/5">Réessayer</button>
    </div>
  </div>
);
