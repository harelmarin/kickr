import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompetition } from '../hooks/useCompetitions';
import { useSearchMatches } from '../hooks/useNextMatches';
import { LeagueStandings } from '../components/tournament/LeagueStandings';
import { CompactMatchCard } from '../components/matches/CompactMatchCard';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../services/axios';
import toast from 'react-hot-toast';

export const CompetitionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [matchPage, setMatchPage] = useState(0);
  const MATCHES_PER_PAGE = 5;
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: competition, isLoading: isLoadingComp } = useCompetition(id!);

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
      <div className="min-h-screen bg-kickr-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-kickr border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-kickr-bg-primary flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black text-main/90 uppercase italic mb-4">Competition Not Found</h1>
        <p className="text-main/40 mb-8">The requested sequence does not exist in our database.</p>
        <Link to="/" className="px-8 py-4 bg-kickr text-main font-black uppercase italic tracking-widest hover:bg-kickr/90 transition-all rounded-sm">
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
    <main className="min-h-screen bg-kickr-bg-primary">
      <div className="bg-black/[0.02] border-b border-white/5 pt-20 pb-6 md:py-24 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] opacity-[0.02] pointer-events-none">
          <img src={competition.logoUrl} className="w-full h-full object-contain" alt="" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-3 md:gap-12 relative z-10">
          <div className="w-16 h-16 md:w-32 md:h-32 bg-kickr-bg-primary rounded-sm p-3 md:p-6 border border-white/10 shadow-2xl flex-shrink-0">
            <img src={competition.logoUrl} alt={competition.name} className="w-full h-full object-contain filter drop-shadow-xl" />
          </div>

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-1 md:mb-4">
              <div className="h-[1px] w-4 md:w-6 bg-kickr opacity-50"></div>
              <span className="text-[6px] md:text-[9px] font-black text-kickr uppercase tracking-[0.4em] italic">Competition Hub</span>
            </div>
            <h1 className="text-xl md:text-6xl xl:text-8xl font-black text-main/90 mb-1 md:mb-4 tracking-tighter leading-none uppercase italic truncate">{competition.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-8">
              <CompStat label="Region" value={competition.country || 'Global'} />
              <CompStat label="Format" value={competition.type || (isTournament ? 'CUP' : 'LEAGUE')} />
              <CompStat label="ID" value={competition.externalId || 'AUTH'} />
            </div>
          </div>

          {isAdmin && (
            <div>
              <button
                disabled={isSyncing}
                onClick={handleSyncData}
                className="py-3 px-6 bg-kickr/10 border border-kickr/20 rounded-sm text-[10px] font-black text-kickr uppercase tracking-widest hover:bg-kickr/20 transition-all disabled:opacity-50"
              >
                {isSyncing ? 'Syncing...' : 'Force Data Sync'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-20">
        <div className={`grid grid-cols-1 ${!isTournament ? 'lg:grid-cols-12 gap-8 md:gap-20' : 'max-w-4xl mx-auto'}`}>

          {!isTournament && (
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              <header className="flex items-center justify-between border-b border-white/5 pb-3 md:pb-4">
                <div>
                  <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-kickr italic">League Standings</h2>
                  <p className="text-[7px] md:text-[10px] text-main/20 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Live hierarchy</p>
                </div>
              </header>
              <LeagueStandings standingsJson={competition.standingsJson} maxEntries={20} />
            </div>
          )}

          <div className={`${!isTournament ? 'lg:col-span-4' : 'w-full'} space-y-6 md:space-y-8`}>
            <header className="flex items-center justify-between border-b border-white/5 pb-3 md:pb-4">
              <div>
                <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-kickr italic">{showFinished ? 'Completed' : 'Upcoming'}</h2>
                <p className="text-[7px] md:text-[10px] text-main/20 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Season Timeline</p>
              </div>

              <div className="flex items-center gap-4">
                {totalMatchPages > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      disabled={matchPage === 0}
                      onClick={() => setMatchPage(p => p - 1)}
                      className="text-[10px] font-black uppercase text-main/40 hover:text-main disabled:opacity-20 transition-all font-mono"
                    >
                      ←
                    </button>
                    <span className="text-[9px] font-mono text-kickr/40 font-black">{matchPage + 1}/{totalMatchPages}</span>
                    <button
                      disabled={matchPage >= totalMatchPages - 1}
                      onClick={() => setMatchPage(p => p + 1)}
                      className="text-[10px] font-black uppercase text-main/40 hover:text-main disabled:opacity-20 transition-all font-mono"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </header>

            <div className="flex gap-1 p-1 bg-black/[0.02] border border-white/5 rounded-sm w-fit mb-6 md:mb-8">
              <button
                onClick={() => handleFilterChange(false)}
                className={`px-3 md:px-4 py-1 rounded-sm text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all ${!showFinished ? 'bg-kickr text-black shadow-[0_0_10px_rgba(var(--kickr-rgb),0.2)]' : 'text-main/20 hover:text-main/40'}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleFilterChange(true)}
                className={`px-3 md:px-4 py-1 rounded-sm text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all ${showFinished ? 'bg-kickr text-black shadow-[0_0_10px_rgba(var(--kickr-rgb),0.2)]' : 'text-main/20 hover:text-main/40'}`}
              >
                Finished
              </button>
            </div>

            <div className="space-y-4">
              {isLoadingMatches ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-black/[0.02] animate-pulse rounded-sm border border-white/5" />
                ))
              ) : timelineData?.content.length === 0 ? (
                <div className="py-12 border border-white/5 rounded-sm bg-white/[0.01] text-center">
                  <p className="text-[8px] font-black text-main/10 uppercase tracking-[0.3em] italic">No Records found.</p>
                </div>
              ) : (
                timelineData?.content.map((match) => (
                  <CompactMatchCard key={match.id} match={match} />
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
    <div className="text-[7px] md:text-[9px] font-bold text-main/20 uppercase tracking-[0.2em] mb-0.5 md:mb-1">{label}</div>
    <div className="text-lg md:text-xl font-black text-main/90 uppercase tracking-tighter tabular-nums leading-none">{value}</div>
  </div>
);
