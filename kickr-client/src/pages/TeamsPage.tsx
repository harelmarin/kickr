import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchTeams } from '../hooks/useTeams';
import { motion, AnimatePresence } from 'framer-motion';
import { LeagueCardSkeleton } from '../components/ui/LoadingSkeletons';

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
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase display-font">
              The Global <span className="text-kickr">Clubs</span>
            </h1>
            <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold">
              Browse the global database of teams
            </p>
          </motion.div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-y border-white/5 py-6 gap-6">
            <div className="flex-1 max-w-md w-full relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search global clubs..."
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-[11px] font-bold text-white focus:outline-none focus:border-kickr/40 transition-all placeholder-[#445566]"
              />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-white italic leading-none tabular-nums">
                {isLoading && allTeams.length === 0 ? '...' : (data?.totalElements || 0)}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#445566] font-bold">Clubs Found</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <AnimatePresence>
            {allTeams.length === 0 && isLoading ? (
              Array.from({ length: 18 }).map((_, i) => <LeagueCardSkeleton key={i} />)
            ) : (
              allTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
                >
                  <Link
                    to={`/teams/${team.id}`}
                    className="group block"
                  >
                    <div className="aspect-square bg-[#14181c] rounded-2xl border border-white/5 p-8 flex items-center justify-center mb-4 transition-all duration-500 group-hover:border-kickr/40 group-hover:bg-[#1b2228] relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-kickr scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <img
                        src={team.logoUrl}
                        alt={team.name}
                        className="max-w-[75%] max-h-[75%] object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-[10px] font-black text-[#667788] text-center group-hover:text-white transition-colors tracking-widest uppercase truncate px-2">
                      {team.name}
                    </h3>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {allTeams.length < (data?.totalElements || 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 flex justify-center"
          >
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={isLoading}
              className="group relative overflow-hidden px-12 py-4 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-[#667788] hover:text-white hover:border-kickr/40 transition-all active:scale-95"
            >
              <span className="relative z-10">{isLoading ? 'Loading...' : 'Expand Archive'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-kickr/0 via-kickr/5 to-kickr/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
};
