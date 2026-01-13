import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompetition } from '../hooks/useCompetitions';
import { useTeamsByCompetition } from '../hooks/useTeams';
import { useSearchMatches } from '../hooks/useNextMatches';
import { motion } from 'framer-motion';
import { LeagueStandings } from '../components/tournament/LeagueStandings';
import { MatchCard } from '../components/matches/MatchCard';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../services/axios';
import toast from 'react-hot-toast';

export const CompetitionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [matchPage, setMatchPage] = useState(0);
  const MATCHES_PER_PAGE = 10;
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: competition, isLoading: isLoadingComp } = useCompetition(id!);
  const { data: teamsData } = useTeamsByCompetition(id!, 0, 1);

  const [showFinished, setShowFinished] = useState(false);
  const { data: timelineData, isLoading: isLoadingMatches } = useSearchMatches({
    competitionId: id,
    limit: MATCHES_PER_PAGE,
    page: matchPage,
    sort: showFinished ? 'date,desc' : 'date',
    finished: showFinished
  });

  const totalMatchPages = timelineData?.totalPages || 0;

  const handleFilterChange = (finished: boolean) => {
    setShowFinished(finished);
    setMatchPage(0);
  };

  if (isLoadingComp) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-kickr border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black text-white uppercase italic mb-4">Competition Not Found</h1>
        <p className="text-[#667788] mb-8">The requested sequence does not exist in our database.</p>
        <Link to="/" className="px-8 py-4 bg-kickr text-white font-black uppercase italic tracking-widest hover:scale-105 transition-transform">
          Back to base
        </Link>
      </div>
    );
  }

  const handleSyncData = async () => {
    if (!competition.externalId) return;
    setIsSyncing(true);
    const toastId = toast.loading('Synchronizing competition data...');
    try {
      await axiosInstance.get('/matchs/save', {
        params: {
          leagueId: competition.externalId,
          season: 2025
        }
      });
      toast.success('Synchronization complete!', { id: toastId });
      window.location.reload();
    } catch (err) {
      console.error('Sync error:', err);
      toast.error('Sync failed. Check console for details.', { id: toastId });
    } finally {
      setIsSyncing(false);
    }
  };

  const isTournament = competition.type === 'CUP' ||
    competition.name.toLowerCase().includes('cup') ||
    competition.name.toLowerCase().includes('champions league') ||
    competition.name.toLowerCase().includes('europa') ||
    competition.name.toLowerCase().includes('conference') ||
    competition.name.toLowerCase().includes('coupe de france') ||
    competition.name.toLowerCase().includes('copa del rey') ||
    competition.name.toLowerCase().includes('coppa italia') ||
    competition.name.toLowerCase().includes('dfb-pokal') ||
    competition.name.toLowerCase().includes('fa cup');

  return (
    <main className="min-h-screen bg-[#0a0b0d]">
      <div className="bg-[#14181c] border-b border-white/5 py-24 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-5 pointer-events-none">
          <img src={competition.logoUrl} className="w-full h-full object-contain grayscale scale-150 rotate-12" alt="" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 md:w-40 md:h-40 bg-[#1b2228] rounded-md p-6 shadow-2xl border border-white/5"
          >
            <img src={competition.logoUrl} alt={competition.name} className="w-full h-full object-contain filter drop-shadow-2xl" />
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-black text-white mb-2 md:mb-4 tracking-tighter leading-none uppercase italic display-font">{competition.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
              <p className="text-[#667788] uppercase tracking-[0.25em] font-bold text-[11px]">
                Official {competition.country || 'International'} {isTournament ? 'Tournament' : 'League'} Page
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-8 mt-4 md:mt-8">
              <CompStat label="Teams" value={teamsData?.totalElements || 0} />
              <CompStat label="Format" value={competition.type || (isTournament ? 'CUP' : 'LEAGUE')} />
              <CompStat label="Season" value="2025/26" />
            </div>
          </div>

          {isAdmin && (
            <div className="mt-8 md:mt-0">
              <button
                disabled={isSyncing}
                onClick={handleSyncData}
                className="py-3 px-6 bg-kickr/10 border border-kickr/20 rounded text-[10px] font-black text-kickr uppercase tracking-widest hover:bg-kickr/20 transition-all disabled:opacity-50"
              >
                {isSyncing ? 'Syncing...' : 'Force Data Sync'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 md:py-20">
        <div className={`grid grid-cols-1 ${!isTournament ? 'lg:grid-cols-12 gap-10 md:gap-20' : 'max-w-4xl mx-auto'}`}>

          {!isTournament && (
            <div className="lg:col-span-8 space-y-8">
              <header className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex flex-col">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-kickr">League Standings</h2>
                  <p className="text-[10px] text-[#445566] font-bold uppercase tracking-widest mt-1">Live hierarchy</p>
                </div>
              </header>
              <LeagueStandings standingsJson={competition.standingsJson} />
            </div>
          )}

          <div className={`${!isTournament ? 'lg:col-span-4' : 'w-full'} space-y-8`}>
            <header className="flex flex-col gap-6 border-b border-white/5 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#667788]">{showFinished ? 'Completed' : 'Upcoming'}</h2>
                  <p className="text-[10px] text-[#445566] font-bold uppercase tracking-widest mt-1">Season Timeline</p>
                </div>

                <div className="flex items-center gap-4">
                  {totalMatchPages > 1 && (
                    <div className="flex items-center gap-3">
                      <button
                        disabled={matchPage === 0}
                        onClick={() => setMatchPage(p => p - 1)}
                        className="text-[10px] font-black uppercase text-[#445566] hover:text-white disabled:opacity-20 transition-all font-mono"
                      >
                        ←
                      </button>
                      <span className="text-[9px] font-mono text-kickr/40 font-black">{matchPage + 1}/{totalMatchPages}</span>
                      <button
                        disabled={matchPage >= totalMatchPages - 1}
                        onClick={() => setMatchPage(p => p + 1)}
                        className="text-[10px] font-black uppercase text-[#445566] hover:text-white disabled:opacity-20 transition-all font-mono"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 p-1 bg-black/20 rounded-lg w-fit">
                <button
                  onClick={() => handleFilterChange(false)}
                  className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${!showFinished ? 'bg-kickr text-black' : 'text-[#667788] hover:text-[#99aabb]'}`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => handleFilterChange(true)}
                  className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${showFinished ? 'bg-kickr text-black' : 'text-[#667788] hover:text-[#99aabb]'}`}
                >
                  Finished
                </button>
              </div>
            </header>

            <div className="space-y-4">
              {isLoadingMatches ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-[#1b2228] animate-pulse rounded-xl border border-white/5" />
                ))
              ) : timelineData?.content.length === 0 ? (
                <div className="py-20 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                  <p className="text-[#445566] uppercase tracking-[0.3em] text-[10px] font-black">Segment Offline</p>
                  <p className="text-[11px] text-[#667788] font-bold uppercase mt-2">
                    No {showFinished ? 'finished' : 'upcoming'} matches found
                  </p>
                </div>
              ) : (
                timelineData?.content.map((match) => (
                  <MatchCard key={match.id} match={match} variant="compact" />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

const CompStat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="text-left">
    <div className="text-[9px] font-bold text-[#667788] uppercase tracking-[0.2em] mb-1">{label}</div>
    <div className="text-xl font-black text-white uppercase tracking-tighter">{value}</div>
  </div>
);
