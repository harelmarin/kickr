import { useState, useEffect } from 'react';
import { useSearchMatches } from '../hooks/useNextMatches';
import { useCompetitions } from '../hooks/useCompetitions';
import { CompactMatchCard } from '../components/matches/CompactMatchCard';
import { AnimatePresence, motion } from 'framer-motion';
import { EmptyState } from '../components/ui/EmptyState';
import { TopTeamsWidget } from '../components/widgets/TopTeamsWidget';
import { TopReviewsWidget } from '../components/widgets/TopReviewsWidget';

export const MatchesPage = () => {
  const [page, setPage] = useState(0);
  const [competitionId, setCompetitionId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<'all' | 'finished' | 'upcoming'>('all');

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

  // Sort logic: Upcoming/All -> Closest first (ASC). Finished -> Most recent first (DESC).
  // Now using backend-supported keys 'date_asc' and 'date_desc'
  const sortParam = status === 'finished' ? 'date_desc' : 'date_asc';

  const { data, isLoading, isError } = useSearchMatches({
    page,
    limit: 12,
    competitionId,
    finished,
    query: debouncedQuery,
    sort: sortParam
  });

  if (isError) return <ErrorState />;

  return (
    <main className="min-h-screen bg-[#14181c] pt-10 pb-24 md:pt-32 md:pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-kickr" />
            <span className="text-[9px] font-black text-kickr uppercase tracking-[0.4em] italic">Fixtures</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-white mb-2 italic tracking-tighter uppercase display-font">
            Center <span className="text-kickr">Circle</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.2em] text-[9px] md:text-[11px] font-bold">
            Live Global Matchday Data Hub
          </p>

          <div className="mt-6 md:mt-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-white/5 p-3 md:p-6 bg-white/[0.01] rounded-sm gap-4 md:gap-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-x-10 w-full lg:w-auto">

                {/* Search */}
                <div className="relative w-full md:w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-20 italic">🔍</span>
                  <input
                    type="text"
                    placeholder="SCAN TEAMS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-sm pl-9 pr-4 py-2 text-[10px] md:text-[11px] font-black text-white placeholder-white/10 focus:border-kickr/40 transition-all outline-none italic uppercase tracking-widest"
                  />
                </div>

                {/* League Filter */}
                <div className="relative w-full md:w-48">
                  <select
                    value={competitionId || ''}
                    onChange={(e) => {
                      setCompetitionId(e.target.value || undefined);
                      setPage(0);
                    }}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-sm pl-3 pr-8 py-2 text-[10px] font-black text-white/40 focus:text-white focus:border-kickr/40 outline-none cursor-pointer appearance-none uppercase tracking-widest hover:bg-white/[0.05] transition-all italic"
                  >
                    <option value="" className="bg-[#14181c]">ALL SECTORS</option>
                    {competitions?.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#14181c]">{c.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-white/10 italic">▼</div>
                </div>

                {/* Status Filter */}
                <div className="flex bg-white/[0.02] p-0.5 rounded-sm border border-white/5 w-full md:w-auto">
                  {['all', 'upcoming', 'finished'].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatus(s as any); setPage(0); }}
                      className={`flex-1 md:flex-none px-3 py-1.5 rounded-sm text-[8px] font-black uppercase tracking-widest transition-all ${status === s ? 'bg-kickr text-black' : 'text-white/20 hover:text-white/40'}`}
                    >
                      {s}
                    </button>
                  ))}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-[2.5/1] bg-white/5 animate-pulse rounded-sm" />
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
                      <CompactMatchCard match={match} />
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
              <div className="mt-8 flex items-center justify-center gap-8 border-t border-white/5 pt-6">
                <button
                  onClick={() => {
                    setPage(p => Math.max(0, p - 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
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
                    window.scrollTo({ top: 300, behavior: 'smooth' });
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

          {/* Sidebar - Adapted for Mobile (Bottom placement) */}
          <div className="lg:col-span-4 space-y-8 mt-12 lg:mt-0">
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
      <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-white/10 hover:border-kickr/30 transition-all">
        Reconnect
      </button>
    </div>
  </div>
);
