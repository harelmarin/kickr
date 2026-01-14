import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompetition } from '../hooks/useCompetitions';
import { useTeamsByCompetition } from '../hooks/useTeams';
import { useSearchMatches } from '../hooks/useNextMatches';
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
        <p className="text-white/60 mb-8">The requested sequence does not exist in our database.</p>
        <Link to="/" className="px-8 py-4 bg-kickr text-white font-black uppercase italic tracking-widest hover:bg-kickr/90 transition-all rounded-sm">
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
    <main className="min-h-screen bg-[#121212]">
      <div className="bg-white/[0.02] border-b border-white/5 py-24">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="w-32 h-32 bg-white/[0.02] rounded-sm p-6 border border-white/5">
            <img src={competition.logoUrl} alt={competition.name} className="w-full h-full object-contain" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none uppercase italic">{competition.name}</h1>
            <p className="text-white/40 uppercase tracking-[0.25em] font-bold text-[11px]">
              Official {competition.country || 'International'} {isTournament ? 'Tournament' : 'League'} Page
            </p>

            <div className="flex items-center justify-center md:justify-start gap-8 mt-8">
              <CompStat label="Teams" value={teamsData?.totalElements || 0} />
              <CompStat label="Format" value={competition.type || (isTournament ? 'CUP' : 'LEAGUE')} />
              <CompStat label="Season" value="2025/26" />
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

      <div className="max-w-[1400px] mx-auto px-6 py-20">
        <div className={`grid grid-cols-1 ${!isTournament ? 'lg:grid-cols-12 gap-20' : 'max-w-4xl mx-auto'}`}>

          {!isTournament && (
            <div className="lg:col-span-8 space-y-8">
              <header className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-kickr italic">League Standings</h2>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Live hierarchy</p>
                </div>
              </header>
              <LeagueStandings standingsJson={competition.standingsJson} maxEntries={20} />
            </div>
          )}

          <div className={`${!isTournament ? 'lg:col-span-4' : 'w-full'} space-y-8`}>
            <header className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-kickr italic">{showFinished ? 'Completed' : 'Upcoming'}</h2>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Season Timeline</p>
              </div>

              <div className="flex items-center gap-4">
                {totalMatchPages > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      disabled={matchPage === 0}
                      onClick={() => setMatchPage(p => p - 1)}
                      className="text-[10px] font-black uppercase text-white/40 hover:text-white disabled:opacity-20 transition-all font-mono"
                    >
                      ←
                    </button>
                    <span className="text-[9px] font-mono text-kickr/40 font-black">{matchPage + 1}/{totalMatchPages}</span>
                    <button
                      disabled={matchPage >= totalMatchPages - 1}
                      onClick={() => setMatchPage(p => p + 1)}
                      className="text-[10px] font-black uppercase text-white/40 hover:text-white disabled:opacity-20 transition-all font-mono"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </header>

            <div className="flex gap-2 p-1 bg-black/20 rounded-sm w-fit mb-8">
              <button
                onClick={() => handleFilterChange(false)}
                className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${!showFinished ? 'bg-kickr text-black' : 'text-white/40 hover:text-white/60'}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleFilterChange(true)}
                className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${showFinished ? 'bg-kickr text-black' : 'text-white/40 hover:text-white/60'}`}
              >
                Finished
              </button>
            </div>

            <div className="space-y-4">
              {isLoadingMatches ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-white/[0.02] animate-pulse rounded-sm border border-white/5" />
                ))
              ) : timelineData?.content.length === 0 ? (
                <div className="py-20 text-center border border-white/5 rounded-sm bg-white/[0.02]">
                  <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black">Segment Offline</p>
                  <p className="text-[11px] text-white/60 font-bold uppercase mt-2">
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
    <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">{label}</div>
    <div className="text-xl font-black text-white uppercase tracking-tighter">{value}</div>
  </div>
);
