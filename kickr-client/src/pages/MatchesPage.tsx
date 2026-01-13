import { useState, useEffect } from 'react';
import { useSearchMatches } from '../hooks/useNextMatches';
import { useCompetitions } from '../hooks/useCompetitions';
import { MatchCard } from '../components/matches/MatchCard';
import { MatchCardPosterSkeleton } from '../components/ui/LoadingSkeletons';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '../components/ui/EmptyState';

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

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0a0b0d] py-20"
    >
      <div className="max-w-7xl mx-auto px-6">

        <header className="mb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase display-font">
              The Pitch <span className="text-kickr">Matches</span>
            </h1>
            <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold">
              Explore {data?.totalElements || '...'} matchdays on Kickr
            </p>
          </motion.div>

          {/* Advanced Filter Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-12 flex flex-col gap-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-white/5 p-6 section-contrast rounded-2xl gap-8 relative overflow-hidden">

              <div className="flex flex-wrap items-center gap-x-10 gap-y-6 relative z-10">
                {/* Search Input */}
                <div className="flex flex-col gap-2 w-full sm:w-64">
                  <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em] pl-1">Search Team</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
                    <input
                      type="text"
                      placeholder="Enter team name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/20 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-bold text-white placeholder-[#445566] focus:border-kickr/40 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* League Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em] pl-1">League</span>
                  <select
                    value={competitionId || ''}
                    onChange={(e) => {
                      setCompetitionId(e.target.value || undefined);
                      setPage(0);
                    }}
                    className="bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-[11px] font-bold text-[#8899aa] focus:text-white focus:border-kickr/40 outline-none cursor-pointer min-w-[160px]"
                  >
                    <option value="" className="bg-[#14181c]">All Competitions</option>
                    {competitions?.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#14181c]">{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em] pl-1">Status</span>
                  <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                    {['all', 'finished', 'upcoming'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatus(s as any); setPage(0); }}
                        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${status === s ? 'bg-kickr text-white' : 'text-[#445566] hover:text-[#99aabb]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em] pl-1">Rank by</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as any);
                      setPage(0);
                    }}
                    className="bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-[11px] font-bold text-[#8899aa] focus:text-white focus:border-kickr/40 outline-none cursor-pointer"
                  >
                    <option value="date" className="bg-[#14181c]">Match Date</option>
                    <option value="popularity" className="bg-[#14181c]">Crowd Hype</option>
                    <option value="rating" className="bg-[#14181c]">Tactical Score</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 relative z-10 lg:border-l lg:border-white/5 lg:pl-8">
                <span className="text-[24px] font-black text-white italic leading-none tracking-tighter">
                  {isLoading ? '...' : (data?.totalElements || 0)}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#445566] font-bold">Fixtures Found</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Poster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <MatchCardPosterSkeleton key={i} />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {data?.content.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
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
            title="No tactical data found"
            description="The stadium feed is clear for these filters. Try adjusting your parameters to find other fixtures."
            actionLabel="Reset Filters"
            onAction={() => { setSearchQuery(''); setCompetitionId(undefined); setStatus('all'); }}
          />
        )}

        {/* Pagination Controls */}
        {!isLoading && data && data.totalPages > 1 && (
          <div className="mt-24 flex items-center justify-center gap-8 border-t border-white/5 pt-12">
            <button
              onClick={() => {
                setPage(p => Math.max(0, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page === 0}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#445566] disabled:opacity-20 hover:text-white transition-all shadow-glow"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
                const pageNum = i;
                // Simplified pagination for now
                return (
                  <button
                    key={i}
                    onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${page === pageNum ? 'bg-kickr text-white' : 'text-[#445566] hover:bg-white/5 hover:text-white'}`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={data?.last}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#445566] disabled:opacity-20 hover:text-white transition-all"
            >
              Next
              <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}

      </div>
    </motion.main>
  );
};

const ErrorState = () => (
  <div className="min-h-screen flex items-center justify-center text-center p-12 bg-[#0a0b0d]">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-md"
    >
      <div className="text-5xl mb-8">📡</div>
      <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Signal Interrupted</h2>
      <p className="text-[#667788] text-sm mb-8 leading-relaxed font-medium">The stadium feed is temporarily down. Our tactical analysts are working on restoring the connection.</p>
      <button onClick={() => window.location.reload()} className="btn-primary-kickr px-10 py-4 rounded text-[10px] hover:-translate-y-0.5 transition-all">
        Reconnect Session
      </button>
    </motion.div>
  </div>
);
