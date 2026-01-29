import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchTeams } from '../hooks/useTeams';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '../components/ui/EmptyState';
import { TopTeamsWidget } from '../components/widgets/TopTeamsWidget';
import { TopReviewsWidget } from '../components/widgets/TopReviewsWidget';

export const TeamsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const pageSize = 24;

  const { data, isLoading } = useSearchTeams(search, page, pageSize);

  useEffect(() => {
    setAllTeams([]);
    setPage(0);
  }, [search]);

  useEffect(() => {
    if (data?.content && data.content.length > 0) {
      setAllTeams(prev => {
        const existingIds = new Set(prev.map(t => t.id));
        const uniqueNewTeams = data.content.filter(t => !existingIds.has(t.id));
        return [...prev, ...uniqueNewTeams];
      });
    }
  }, [data]);

  return (
    <main className="min-h-screen bg-kickr-bg-primary pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-6">
            <div className="h-[1px] md:h-[2px] w-3 md:w-6 bg-kickr/40" />
            <span className="text-[10px] md:text-xs font-black text-kickr/80 uppercase tracking-[0.3em] md:tracking-[0.4em] italic leading-none">Clubs</span>
          </div>
          <h1 className="text-2xl md:text-6xl font-black text-main mb-1 md:mb-4 italic tracking-tighter uppercase leading-none">
            The Global <span className="text-kickr/80">Squads</span>
          </h1>
          <p className="text-muted uppercase tracking-[0.15em] md:tracking-[0.25em] text-[10px] md:text-[12px] font-black italic">
            Browse the global database of teams and clubs.
          </p>

          <div className="mt-12">
            <div className="flex items-end justify-between border-b border-white/5 pb-3 md:pb-4 gap-4">
              <div className="flex flex-col gap-1 w-full md:w-60">
                <span className="text-[10px] md:text-[11px] uppercase font-black text-muted tracking-[0.2em] pl-0.5 italic">Find Clubs</span>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted">🔍</span>
                  <input
                    type="text"
                    placeholder="SCAN..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search clubs"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-[11px] md:text-[12px] font-black text-main placeholder-white/20 focus:border-kickr/20 transition-all outline-none italic uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-base md:text-xl font-black text-main italic leading-none tracking-tighter">
                  {isLoading && allTeams.length === 0 ? '...' : (data?.totalElements || 0)}
                </span>
                <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-muted font-bold mt-1">Clubs Listed</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-white/5 pb-2 md:pb-4">
              <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted italic">All Clubs</h2>
              <span className="text-[10px] md:text-[10px] font-black text-muted uppercase tracking-widest italic font-mono">STATUS: OPERATIONAL</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <AnimatePresence>
                {allTeams.length === 0 && isLoading ? (
                  Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square bg-black/5 animate-pulse rounded-sm" />)
                ) : (
                  allTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.01, 0.2) }}
                    >
                      <Link
                        key={team.id}
                        to={`/teams/${team.id}`}
                        className="group relative bg-white/[0.01] border border-white/5 p-3 md:p-6 rounded-sm hover:border-kickr/30 hover:bg-black/[0.03] transition-all flex flex-col items-center gap-3 md:gap-4"
                      >
                        <div className="w-12 h-12 md:w-20 md:h-20 bg-black/10 rounded-sm flex items-center justify-center p-2 md:p-4 mb-2">
                          <img
                            src={team.logoUrl}
                            alt={`${team.name} logo`}
                            className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:drop-shadow-xl transition-all duration-500 transform group-hover:scale-110"
                          />
                        </div>
                        <h3 className="text-center text-[10px] md:text-[11px] font-black text-secondary group-hover:text-main transition-colors tracking-widest uppercase truncate px-1">
                          {team.name}
                        </h3>
                        {team.competition && (
                          <p className="text-center text-[9px] md:text-[10px] font-bold text-muted/50 group-hover:text-kickr/40 transition-colors tracking-widest uppercase truncate italic">
                            {team.competition.name}
                          </p>
                        )}
                      </Link>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {!isLoading && allTeams.length === 0 && (
              <EmptyState
                icon="🛡️"
                title="No Clubs Found"
                description="Try creating a new search query."
                actionLabel="Clear Search"
                onAction={() => setSearch('')}
              />
            )}

            {allTeams.length < (data?.totalElements || 0) && (
              <div className="mt-20 flex justify-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={isLoading}
                  className="group relative overflow-hidden px-10 py-4 rounded-sm bg-black/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-secondary hover:text-main hover:border-kickr/40 transition-all active:scale-95"
                >
                  <span className="relative z-10">{isLoading ? 'Loading...' : 'Load More Clubs'}</span>
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
