import { useState, useEffect } from 'react';
import { useSearchMatches } from '../hooks/useNextMatches';
import { useCompetitions } from '../hooks/useCompetitions';
import { MatchCard } from '../components/matches/MatchCard';
import { MatchCardPosterSkeleton } from '../components/ui/LoadingSkeletons';
import { AnimatePresence, motion } from 'framer-motion';
import { EmptyState } from '../components/ui/EmptyState';
import { TopTeamsWidget } from '../components/widgets/TopTeamsWidget';
import { TopReviewsWidget } from '../components/widgets/TopReviewsWidget';

export const MatchesPage = () => {
  const [page, setPage] = useState(0);
  const [competitionId, setCompetitionId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<'all' | 'finished' | 'upcoming'>('all');
  const [sort, setSort] = useState<string>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: competitions } = useCompetitions();

  const finished = status === 'all' ? undefined : status === 'finished';

  const { data, isLoading, isError } = useSearchMatches({
    page,
    limit: 18,
    competitionId,
    finished,
    query: debouncedQuery,
    sort
  });

  if (isError) return <ErrorState />;

  const statsTotalFixtures = data?.totalElements || 0;

  return (
    <main className="min-h-screen bg-[#14181c] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-6 bg-kickr" />
            <span className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Fixtures</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase">
            Center <span className="text-kickr">Circle</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.25em] text-[11px] font-bold">
            Global Matchday Data. Analyze upcoming and past encounters.
          </p>

          <div className="mt-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-white/5 p-6 bg-white/[0.02] rounded-sm gap-8">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-6 w-full lg:w-auto">

                {/* Search */}
                <div className="flex flex-col gap-2 w-full sm:w-64">
                  <span className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] pl-1">Search Team</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
                    <input
                      type="text"
                      placeholder="Enter team name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/20 border border-white/5 rounded-sm pl-9 pr-4 py-2.5 text-base sm:text-[11px] font-bold text-white placeholder-white/20 focus:border-kickr/40 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* League Filter */}
                <div className="flex flex-col gap-2 w-full sm:w-48">
                  <span className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] pl-1">League</span>
                  <div className="relative">
                    <select
                      value={competitionId || ''}
                      onChange={(e) => {
                        setCompetitionId(e.target.value || undefined);
                        setPage(0);
                      }}
                      className="w-full bg-black/20 border border-white/5 rounded-sm pl-3 pr-8 py-2.5 text-[10px] font-bold text-white/60 focus:text-white focus:border-kickr/40 outline-none cursor-pointer appearance-none uppercase tracking-wider hover:bg-white/[0.05] transition-all"
                    >
                      <option value="" className="bg-[#1b2228]">All Leagues</option>
                      {competitions?.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#1b2228] w-64 md:w-auto overflow-hidden text-ellipsis">{c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-white/20">▼</div>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] pl-1">Status</span>
                  <div className="flex bg-black/20 p-1 rounded-sm border border-white/5">
                    {['all', 'upcoming', 'finished'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatus(s as any); setPage(0); }}
                        className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${status === s ? 'bg-kickr text-black' : 'text-white/40 hover:text-white/60'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-10 lg:border-l lg:border-white/5 lg:pl-10">
                <div className="flex flex-col items-end">
                  <span className="text-[20px] font-black text-white italic leading-none tracking-tighter">
                    {isLoading ? '...' : statsTotalFixtures}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1">Found</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90 italic">Match Feed</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <MatchCardPosterSkeleton key={i} />
                ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {data?.content.map((match) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MatchCard match={match} variant="poster" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Empty State */}
            {!isLoading && data?.content.length === 0 && (
              <EmptyState
                icon="🏟️"
                title="Stadium Quiet"
                description="No matches found for your current filters. Try selecting a different league or date range."
                actionLabel="Reset All Filters"
                onAction={() => { setSearchQuery(''); setCompetitionId(undefined); setStatus('all'); }}
              />
            )}

            {/* Pagination */}
            {!isLoading && data && data.totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center gap-8 border-t border-white/5 pt-12">
                <button
                  onClick={() => {
                    setPage(p => Math.max(0, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page === 0}
                  className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 disabled:opacity-20 hover:text-white transition-all"
                >
                  <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                  Prev
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Page <span className="text-white">{page + 1}</span> of {data.totalPages}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setPage(p => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={data?.last}
                  className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 disabled:opacity-20 hover:text-white transition-all"
                >
                  Next
                  <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <TopTeamsWidget />
            <TopReviewsWidget />
          </div>
        </div>
      </div>
    </main>
  );
};

const ErrorState = () => (
  <div className="min-h-screen flex items-center justify-center text-center p-12 bg-[#14181c]">
    <div className="max-w-md">
      <div className="text-5xl mb-8 opacity-20">📡</div>
      <h2 className="text-2xl font-black text-white/90 mb-4 uppercase tracking-tighter italic">Signal Interrupted</h2>
      <p className="text-white/40 text-sm mb-8 leading-relaxed font-medium">The stadium feed is temporarily down.</p>
      <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded hover:bg-white/10 hover:border-kickr/30 transition-all">
        Reconnect
      </button>
    </div>
  </div>
);
