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
    <main className="min-h-screen bg-[#14181c] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[2px] w-6 bg-kickr" />
            <span className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Clubs</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase">
            The Global <span className="text-kickr">Squads</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.25em] text-[11px] font-bold">
            Browse the global database of teams and clubs.
          </p>

          <div className="mt-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-white/5 p-6 bg-white/[0.02] rounded-sm gap-8">
              <div className="flex flex-col gap-2 w-full sm:w-80">
                <span className="text-[9px] uppercase font-black text-white/40 tracking-[0.2em] pl-1">Search Club</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
                  <input
                    type="text"
                    placeholder="Enter club name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#14181c]/20 border border-white/5 rounded-sm pl-9 pr-4 py-2.5 text-base sm:text-[11px] font-bold text-white placeholder-white/20 focus:border-kickr/40 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-10 lg:border-l lg:border-white/5 lg:pl-10">
                <div className="flex flex-col items-end">
                  <span className="text-[20px] font-black text-white italic leading-none tracking-tighter">
                    {isLoading && allTeams.length === 0 ? '...' : (data?.totalElements || 0)}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold mt-1">Clubs Listed</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/90 italic">All Clubs</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <AnimatePresence>
                {allTeams.length === 0 && isLoading ? (
                  Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-sm" />)
                ) : (
                  allTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.01, 0.2) }}
                    >
                      <Link
                        to={`/teams/${team.id}`}
                        className="group block"
                      >
                        <div className="aspect-square bg-white/[0.02] rounded-sm border border-white/5 p-4 md:p-6 flex items-center justify-center mb-2 md:mb-3 transition-all group-hover:border-white/10 group-hover:bg-white/[0.04] relative overflow-hidden">
                          <div className="absolute inset-0 bg-kickr/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <img
                            src={team.logoUrl}
                            alt={team.name}
                            className="max-w-[70%] max-h-[70%] object-contain filter drop-shadow-md group-hover:drop-shadow-xl transition-all duration-500 transform group-hover:scale-110"
                          />
                        </div>
                        <h3 className="text-center text-[7px] md:text-[9px] font-black text-white/40 md:text-white/60 group-hover:text-white transition-colors tracking-widest uppercase truncate px-1">
                          {team.name}
                        </h3>
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
                  className="group relative overflow-hidden px-10 py-4 rounded-sm bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:border-white/20 transition-all active:scale-95"
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
