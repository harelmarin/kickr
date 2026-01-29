import { useState, useEffect } from 'react';
import { useSearchMatches } from '../hooks/useNextMatches';
import { useCompetitions } from '../hooks/useCompetitions';
import { CompactMatchCard } from '../components/matches/CompactMatchCard';
import { sortMatchesByHierarchy } from '../utils/matchSort';
import { AnimatePresence, motion } from 'framer-motion';
import { EmptyState } from '../components/ui/EmptyState';
import { TopTeamsWidget } from '../components/widgets/TopTeamsWidget';
import { TopReviewsWidget } from '../components/widgets/TopReviewsWidget';
import { TodayMatches } from '../components/matches/TodayMatches';

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
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
            <h1 className="cinematic-header text-sm md:text-base">Browse Matches</h1>
          </div>

          <div className="mt-4 md:mt-12 bg-kickr-bg-secondary border border-white/5 p-4 md:p-6 rounded-sm poster-shadow">
            <div className="flex items-end justify-between border-b border-white/[0.03] pb-6 gap-4">
              <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-x-8 flex-1">
                {/* Search */}
                <div className="flex flex-col gap-1 w-full md:w-60">
                  <span className="text-[10px] md:text-[11px] uppercase font-black text-muted tracking-[0.2em] pl-0.5 italic">Find Teams</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted">🔍</span>
                    <input
                      type="text"
                      placeholder="SCAN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search clubs"
                      className="w-full bg-kickr-bg-primary/40 border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-[11px] md:text-[12px] font-black text-main placeholder-white/20 focus:border-kickr/40 transition-all outline-none italic uppercase tracking-widest"
                    />
                  </div>
                </div>

                {/* League Filter */}
                <div className="flex flex-col gap-1 w-full md:w-56">
                  <span className="text-[10px] md:text-[11px] uppercase font-black text-muted tracking-[0.2em] pl-0.5 italic">Select League</span>
                  <div className="relative">
                    <select
                      value={competitionId || ''}
                      onChange={(e) => {
                        setCompetitionId(e.target.value || undefined);
                        setPage(0);
                      }}
                      className="w-full bg-kickr-bg-primary/40 border border-white/10 rounded-sm px-3 py-1.5 text-[11px] md:text-[12px] font-black text-main focus:border-kickr/40 outline-none cursor-pointer appearance-none hover:bg-white/[0.04] transition-all uppercase italic tracking-widest"
                    >
                      <option value="" className="bg-kickr-bg-secondary">All Leagues</option>
                      {competitions?.map(c => (
                        <option key={c.id} value={c.id} className="bg-kickr-bg-secondary">{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex bg-black/[0.1] p-1 rounded-sm border border-white/5 w-full md:w-auto h-[32px] md:h-[34px] items-center self-end">
                  {['all', 'upcoming', 'finished'].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatus(s as any); setPage(0); }}
                      className={`px-4 py-1.5 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all ${status === s ? 'bg-kickr text-white shadow-[0_0_15px_rgba(93,139,255,0.3)]' : 'text-muted hover:text-main'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 mt-8 md:mt-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            {/* TODAY'S MATCHES SECTION */}
            <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
              <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="cinematic-header text-[11px] md:text-[11px] text-kickr italic">Today's Matches</h2>
                  <span className="text-[8px] md:text-[10px] font-black text-kickr uppercase tracking-widest px-2 py-0.5 bg-kickr/10 rounded-sm">LIVE</span>
                </div>
              </div>
              <TodayMatches />
            </section>

            {/* LIVE FEED SECTION */}
            <section className="bg-kickr-bg-secondary border border-white/5 p-4 md:p-8 rounded-sm poster-shadow">
              <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/[0.03] pb-4">
                <h2 className="cinematic-header text-[11px] md:text-[11px] text-muted italic">Live Feed</h2>
                <span className="text-[10px] md:text-[10px] font-black text-muted uppercase tracking-widest italic font-mono">STATUS: LIVE</span>
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
            </section>

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
                  className="group flex items-center gap-2 px-6 py-2.5 bg-black/[0.02] border border-white/5 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-secondary hover:text-kickr hover:border-kickr/40 disabled:opacity-5 transition-all italic active:scale-95"
                >
                  <span className="text-sm group-hover:-translate-x-1 transition-transform leading-none mb-0.5">←</span>
                  PREV
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-[11px] font-black text-muted uppercase tracking-widest italic tabular-nums font-mono">
                    Page <span className="text-main">{page + 1}</span> / {data.totalPages}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setPage(p => p + 1);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={data?.last}
                  className="group flex items-center gap-2 px-6 py-2.5 bg-kickr text-white rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 disabled:opacity-5 transition-all italic shadow-[0_0_20px_rgba(93,139,255,0.2)] active:scale-95"
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
