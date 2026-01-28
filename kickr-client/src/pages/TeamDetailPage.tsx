import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useTeam } from '../hooks/useTeams';
import { useMatchesByTeam } from '../hooks/useNextMatches';
import { CompactMatchCard } from '../components/matches/CompactMatchCard';

export const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<'all' | 'finished' | 'upcoming'>('all');
  const [sort, setSort] = useState<'date' | 'rating'>('date');

  const { data: team, isLoading: isLoadingTeam } = useTeam(id!);
  const { data: matches, isLoading: isLoadingMatches } = useMatchesByTeam(id!);

  const filteredAndSortedMatches = useMemo(() => {
    if (!matches) return [];

    let filtered = [...matches];

    if (status === 'finished') {
      filtered = filtered.filter(m => m.homeScore !== null);
    } else if (status === 'upcoming') {
      filtered = filtered.filter(m => m.homeScore === null);
    }

    filtered.sort((a, b) => {
      switch (sort) {
        case 'date':
          return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [matches, status, sort]);

  const totalDiaryEntries = useMemo(() => {
    if (!matches) return 0;
    return matches.reduce((acc, match) => acc + (match.reviewsCount || 0), 0);
  }, [matches]);

  const stats = useMemo(() => {
    if (!matches || matches.length === 0 || !team) return {
      winRate: '0%', drawRate: '0%', lossRate: '0%',
      wins: 0, draws: 0, losses: 0,
      avgScored: '0.0', avgConceded: '0.0',
      globalAverageRating: '0.0',
      form: [] as ('W' | 'D' | 'L')[]
    };

    const finished = matches
      .filter(m => m.homeScore !== null && m.awayScore !== null)
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());

    let wins = 0, draws = 0, losses = 0;
    let scored = 0, conceded = 0;
    let cleanSheets = 0;

    finished.forEach(m => {
      const isHome = m.homeTeamId === team.id;
      const hS = m.homeScore!;
      const aS = m.awayScore!;

      const teamScore = isHome ? hS : aS;
      const opponentScore = isHome ? aS : hS;

      scored += teamScore;
      conceded += opponentScore;

      if (opponentScore === 0) cleanSheets++;

      if (teamScore > opponentScore) wins++;
      else if (teamScore === opponentScore) draws++;
      else losses++;
    });

    const total = finished.length || 1;
    const form = finished.slice(0, 5).map(m => {
      const isHome = m.homeTeamId === team.id;
      const teamScore = isHome ? m.homeScore! : m.awayScore!;
      const oppScore = isHome ? m.awayScore! : m.homeScore!;
      if (teamScore > oppScore) return 'W';
      if (teamScore === oppScore) return 'D';
      return 'L';
    });

    const ratedMatches = matches.filter(m => m.averageRating !== undefined && m.averageRating > 0);
    const avgRating = ratedMatches.length > 0
      ? ratedMatches.reduce((acc, m) => acc + (m.averageRating || 0), 0) / ratedMatches.length
      : 0;

    return {
      wins, draws, losses,
      winRate: `${Math.round((wins / total) * 100)}%`,
      drawRate: `${Math.round((draws / total) * 100)}%`,
      lossRate: `${Math.round((losses / total) * 100)}%`,
      avgScored: (scored / total).toFixed(1),
      avgConceded: (conceded / total).toFixed(1),
      globalAverageRating: avgRating.toFixed(1),
      cleanSheets,
      form
    };
  }, [matches, team?.id]);

  if (isLoadingTeam || !team) return null;

  return (
    <main className="min-h-screen bg-kickr-bg-primary pb-24">
      <div className="bg-kickr-bg-primary border-b border-white/5 pt-12 pb-4 md:pt-20 md:pb-20 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] opacity-[0.02] pointer-events-none">
          <img src={team.logoUrl} className="w-full h-full object-contain" alt="" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center md:items-end gap-3 md:gap-12 relative z-10 text-center md:text-left">
          <div className="w-16 h-16 md:w-32 md:h-32 xl:w-48 xl:h-48 bg-kickr-bg-primary rounded-sm shadow-2xl p-3 md:p-6 border border-white/10 relative group flex-shrink-0">
            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain filter drop-shadow-2xl" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-1 md:mb-4">
              <div className="h-[1px] w-4 md:w-6 bg-kickr opacity-50"></div>
              <span className="text-[6px] md:text-[9px] font-black text-kickr uppercase tracking-[0.4em] italic">Tactical Deployment</span>
            </div>
            <h1 className="text-xl md:text-6xl xl:text-8xl font-black text-main mb-1 md:mb-4 tracking-tighter leading-none uppercase italic display-font truncate">
              {team.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-6">
              <span className="text-muted uppercase tracking-[0.2em] font-black text-[6px] md:text-xs italic">{team.competition?.country || 'France'}</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-black/10 px-0"></span>
              <span className="text-muted uppercase tracking-[0.2em] font-black text-[6px] md:text-xs italic">{team.competition?.name || 'Club International'}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12 mb-2">
            <BigStat label="Logs Recorded" value={totalDiaryEntries >= 1000 ? `${(totalDiaryEntries / 1000).toFixed(1)}k` : totalDiaryEntries.toString()} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-16">
          <div className="lg:col-span-3 space-y-8 md:space-y-16">
            <section>
              <div className="flex flex-col gap-4 mb-6 md:mb-10 border-b border-white/5 pb-4 md:pb-6">
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-kickr italic">Matchography</span>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6 md:gap-12">
                    {/* Status Filter */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7px] md:text-[9px] uppercase font-black text-secondary tracking-[0.2em]">Status</span>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="bg-transparent text-[10px] md:text-[11px] font-bold text-muted focus:text-main outline-none cursor-pointer border-none p-0 m-0"
                      >
                        <option value="all" className="bg-kickr-bg-primary">All</option>
                        <option value="finished" className="bg-kickr-bg-primary">Finished</option>
                        <option value="upcoming" className="bg-kickr-bg-primary">Upcoming</option>
                      </select>
                    </div>

                    {/* Sort Filter */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[7px] md:text-[9px] uppercase font-black text-secondary tracking-[0.2em]">Order</span>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as any)}
                        className="bg-transparent text-[10px] md:text-[11px] font-bold text-muted focus:text-main outline-none cursor-pointer border-none p-0 m-0"
                      >
                        <option value="date" className="bg-kickr-bg-primary">Date</option>
                        <option value="rating" className="bg-kickr-bg-primary">Stars</option>
                      </select>
                    </div>
                  </div>

                  {/* Match Count */}
                  <div className="text-[7px] md:text-[10px] uppercase tracking-[0.3em] text-muted font-black italic">
                    {filteredAndSortedMatches.length} RECORDS
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {isLoadingMatches ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-[1.5/1] md:aspect-[2.5/1] bg-black/5 animate-pulse rounded-sm" />
                  ))
                ) : filteredAndSortedMatches.length === 0 ? (
                  <div className="col-span-full py-12 text-center border border-white/5 bg-white/[0.01]">
                    <p className="text-secondary uppercase tracking-[0.3em] text-[8px] font-black italic">No records in database.</p>
                  </div>
                ) : (
                  filteredAndSortedMatches.map(match => (
                    <CompactMatchCard key={match.id} match={match} />
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6 md:space-y-8">
            <section className="bg-black/[0.02] border border-white/5 rounded-sm p-4 md:p-8">
              <h3 className="text-[9px] font-black text-kickr uppercase tracking-[0.4em] mb-6 md:mb-8 border-b border-white/5 pb-4 md:pb-6 italic">Tactical Report</h3>

              <div className="mb-8">
                <div className="flex justify-between text-[7px] md:text-[9px] font-black uppercase tracking-widest text-secondary mb-2 md:mb-3 italic">
                  <span>Battle Records</span>
                  <span className="text-muted">{stats.wins}W <span className="text-muted/30 mx-0.5 md:mx-1">/</span> {stats.draws}D <span className="text-muted/30 mx-0.5 md:mx-1">/</span> {stats.losses}L</span>
                </div>
                <div className="h-1 md:h-1.5 w-full flex rounded-full overflow-hidden bg-black/5">
                  <div style={{ width: stats.winRate }} className="bg-kickr h-full shadow-[0_0_10px_rgba(var(--kickr-rgb),0.3)]" title={`Wins: ${stats.winRate}`}></div>
                  <div style={{ width: stats.drawRate }} className="bg-black/10 h-full" title={`Draws: ${stats.drawRate}`}></div>
                  <div style={{ width: stats.lossRate }} className="bg-[#ef4444]/40 h-full" title={`Losses: ${stats.lossRate}`}></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 border-y border-white/5 py-6 md:py-8">
                <MiniStat label="Attack" value={stats.avgScored} description="Avg" />
                <MiniStat label="Intel" value={stats.globalAverageRating} description="Avg" />
                <MiniStat label="Defense" value={stats.avgConceded} description="Avg" />
              </div>

              <div className="mb-8">
                <h4 className="text-[7px] md:text-[9px] font-black text-secondary uppercase tracking-widest mb-3 md:mb-4 italic">Operational Form</h4>
                <div className="flex gap-1">
                  {stats.form.map((res, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 md:w-6 md:h-6 rounded-sm flex items-center justify-center text-[8px] md:text-[9px] font-black ${res === 'W' ? 'bg-kickr text-black shadow-[0_0_8px_rgba(var(--kickr-rgb),0.2)]' :
                        res === 'D' ? 'bg-black/10 text-secondary' :
                          'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20'
                        }`}
                    >
                      {res}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 md:pt-6 border-t border-white/5 space-y-3 md:space-y-4">
                <div className="flex items-center justify-between uppercase tracking-widest">
                  <span className="text-[7px] md:text-[8px] font-black text-muted">Clean Sheets</span>
                  <span className="text-lg md:text-xl font-black text-main italic leading-none">{stats.cleanSheets}</span>
                </div>
                <p className="text-[7px] md:text-[10px] text-muted italic leading-relaxed uppercase tracking-tighter">
                  Source: {matches?.filter(m => m.homeScore !== null).length || 0} Records analyzed.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

const BigStat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-right">
    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black text-main italic">{value}</div>
  </div>
);

const MiniStat = ({ label, value, description }: { label: string; value: string; description: string }) => (
  <div>
    <div className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black text-kickr font-display italic">{value}</div>
    <div className="text-[9px] text-muted uppercase font-bold tracking-tighter mt-1">{description}</div>
  </div>
);
