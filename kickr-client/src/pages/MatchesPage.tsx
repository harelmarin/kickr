import { useState, useEffect } from 'react';
import { useSearchMatches } from '../hooks/useNextMatches';
import { useCompetitions } from '../hooks/useCompetitions';
import { CompactMatchCard } from '../components/matches/CompactMatchCard';
import { sortMatchesByHierarchy } from '../utils/matchSort';
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
    limit: 9,
    competitionId,
    finished,
    query: debouncedQuery,
    sort: sortParam
  });

  if (isError) return <ErrorState />;

  return (
    <main className="min-h-screen bg-kickr-bg-primary pt-16 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-16">
          <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-6">
            <div className="h-[1px] md:h-[2px] w-3 md:w-6 bg-kickr/40" />
            <span className="text-xs md:text-sm font-black text-kickr/80 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Match Feed</span>
          </div>
          <h1 className="text-2xl md:text-6xl font-black text-main mb-1 md:mb-4 italic tracking-tighter uppercase leading-none">
            Center <span className="text-kickr/80">Circle</span>
          </h1>
          <p className="text-muted uppercase tracking-[0.15em] md:tracking-[0.25em] text-xs md:text-sm font-black italic">
            Global Match Database
          </p>

          <div className="mt-4 md:mt-12">
            <div className="flex items-end justify-between border-b border-white/5 pb-2 md:pb-4 gap-4">
              <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-x-8 flex-1">
                {/* Search */}
                <div className="flex flex-col gap-1 w-full md:w-60">
                  <span className="text-xs md:text-sm uppercase font-black text-muted tracking-[0.2em] pl-0.5 italic">Find Clubs</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted">🔍</span>
                    <input
                      type="text"
                      placeholder="SCAN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search clubs"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-xs md:text-sm font-black text-main placeholder-white/20 focus:border-kickr/20 transition-all outline-none italic uppercase tracking-widest"
                    />
                  </div>
                </div>

                {/* League Filter */}
                <div className="flex flex-col gap-0.5 w-full md:w-48">
                  <span className="text-xs md:text-sm uppercase font-black text-muted tracking-[0.2em] pl-0.5 italic">League</span>
                  <div className="relative">
                    <select
                      value={competitionId || ''}
                      onChange={(e) => {
                        setCompetitionId(e.target.value || undefined);
                        setPage(0);
                      }}
                      className="w-full bg-white/[0.01] border border-white/5 rounded-sm pl-1.5 pr-6 py-1 text-xs font-black text-secondary focus:text-main focus:border-kickr/20 outline-none cursor-pointer appearance-none uppercase tracking-widest hover:bg-black/[0.03] transition-all italic"
                    >
                      <option value="" className="bg-kickr-bg-primary">ALL</option>
                      {competitions?.map(c => (
                        <option key={c.id} value={c.id} className="bg-kickr-bg-primary">{c.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-muted italic">▼</div>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex bg-white/[0.01] p-0.5 rounded-sm border border-white/5 w-full md:w-auto h-7 md:h-8">
                  {['all', 'upcoming', 'finished'].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatus(s as any); setPage(0); }}
                      className={`px-2 md:px-3 flex items-center rounded-sm text-xs md:text-sm font-black uppercase tracking-widest transition-all ${status === s ? 'bg-kickr text-black' : 'text-secondary hover:text-main/50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/5 pb-2 md:pb-4">
              <h2 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted italic">Match Feed</h2>
              <span className="text-xs md:text-sm font-black text-muted uppercase tracking-widest italic font-mono">STATUS: OPERATIONAL</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {isLoading ? (
                Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-[1.5/1] md:aspect-[2.5/1] bg-black/5 animate-pulse rounded-sm" />
                ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {sortMatchesByHierarchy(data?.content || []).map((match) => (
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
              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4 md:pt-6">
                <button
                  onClick={() => {
                    setPage(p => Math.max(0, p - 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={page === 0}
                  className="group flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-secondary disabled:opacity-5 hover:text-main transition-all italic"
                >
                  <span className="text-sm group-hover:-translate-x-1 transition-transform leading-none mb-0.5">←</span>
                  PREV
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-black text-muted uppercase tracking-widest italic tabular-nums font-mono">
                    PAGE {page + 1} / {data.totalPages}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setPage(p => p + 1);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={data?.last}
                  className="group flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-secondary disabled:opacity-5 hover:text-main transition-all italic"
                >
                  NEXT
                  <span className="text-sm group-hover:translate-x-1 transition-transform leading-none mb-0.5">→</span>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Adapted for Mobile (Bottom placement) */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8 mt-12 lg:mt-0">
            <TopTeamsWidget />
            <TopReviewsWidget />
          </div>
        </div>
      </div>
    </main>
  );
};

const ErrorState = () => (
  <div className="min-h-screen flex items-center justify-center text-center p-12 bg-kickr-bg-primary">
    <div className="max-w-md">
      <div className="text-4xl mb-6 opacity-10">📡</div>
      <h2 className="text-lg font-black text-main/90 mb-2 uppercase tracking-tighter italic">Match Feed Lost</h2>
      <p className="text-muted text-xs mb-8 leading-relaxed font-medium">The stadium feed is temporarily down.</p>
      <button onClick={() => window.location.reload()} className="px-8 py-3 bg-black/5 border border-white/10 text-main font-black uppercase tracking-widest text-xs rounded-sm hover:bg-black/10 hover:border-kickr/30 transition-all">
        Reconnect
      </button>
    </div>
  </div>
);
