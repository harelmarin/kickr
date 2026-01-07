import { useState } from 'react';
import { useSearchMatches } from '../hooks/useNextMatchs';
import { useCompetitions } from '../hooks/useCompetitions';
import { MatchPoster } from '../components/Matchs/MatchPoster';

export const MatchesPage = () => {
  const [page, setPage] = useState(0);
  const [competitionId, setCompetitionId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<'all' | 'finished' | 'upcoming'>('all');
  const [sort, setSort] = useState<string>('date');

  const { data: competitions } = useCompetitions();

  const finished = status === 'all' ? undefined : status === 'finished';

  const { data, isLoading, isError } = useSearchMatches({
    page,
    limit: 18,
    competitionId,
    finished,
    sort
  });

  if (isError) return <ErrorState />;

  return (
    <main className="min-h-screen bg-[#0a0b0d] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase display-font">Matches</h1>
          <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold">
            Explore {data?.totalElements || '...'} matchdays on Kickr
          </p>

          {/* Cinematic Filter Bar */}
          <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between border-y border-white/5 py-4 gap-8">
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4">

              {/* League Filter */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em]">League</span>
                <select
                  value={competitionId || ''}
                  onChange={(e) => {
                    setCompetitionId(e.target.value || undefined);
                    setPage(0);
                  }}
                  className="bg-transparent text-[11px] font-bold text-[#8899aa] focus:text-white outline-none cursor-pointer border-none p-0 m-0"
                >
                  <option value="" className="bg-[#14181c]">All Leagues</option>
                  {competitions?.map(c => (
                    <option key={c.id} value={c.id} className="bg-[#14181c]">{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em]">Status</span>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as any);
                    setPage(0);
                  }}
                  className="bg-transparent text-[11px] font-bold text-[#8899aa] focus:text-white outline-none cursor-pointer border-none p-0 m-0"
                >
                  <option value="all" className="bg-[#14181c]">All Matches</option>
                  <option value="finished" className="bg-[#14181c]">Finished</option>
                  <option value="upcoming" className="bg-[#14181c]">Upcoming</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em]">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as any);
                    setPage(0);
                  }}
                  className="bg-transparent text-[11px] font-bold text-[#8899aa] focus:text-white outline-none cursor-pointer border-none p-0 m-0"
                >
                  <option value="date" className="bg-[#14181c]">Date (Newest)</option>
                  <option value="popularity" className="bg-[#14181c]">Popularity</option>
                  <option value="rating" className="bg-[#14181c]">Highest Rated</option>
                </select>
              </div>

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

        {/* Empty State */}
        {!isLoading && data?.content.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[#445566] uppercase tracking-widest text-xs font-bold">No matches found for these filters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="mt-24 flex justify-center gap-10 border-t border-white/5 pt-10">
          <button
            onClick={() => {
              setPage(p => Math.max(0, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={page === 0}
            className="text-[11px] font-black uppercase tracking-[0.25em] text-[#667788] hover:text-white transition-colors disabled:opacity-20"
          >
            ← Previous
          </button>
          <button
            onClick={() => {
              setPage(p => p + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={data?.last}
            className="text-[11px] font-black uppercase tracking-[0.25em] text-[#667788] hover:text-white transition-colors disabled:opacity-20"
          >
            Next →
          </button>
        </div>

      </div>
    </main>
  );
};

const ErrorState = () => (
  <div className="min-h-screen flex items-center justify-center text-center p-12 bg-[#0a0b0d]">
    <div className="max-w-md">
      <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Connexion Interrompue</h2>
      <p className="text-[#667788] text-sm mb-8 leading-relaxed">Les tribunes sont vides... Il semble y avoir un souci de connexion avec les serveurs de matchs.</p>
      <button onClick={() => window.location.reload()} className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded hover:bg-kickr/5 transition-all">Réessayer</button>
    </div>
  </div>
);
