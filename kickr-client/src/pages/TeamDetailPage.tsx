import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useTeam } from '../hooks/useTeams';
import { useMatchesByTeam } from '../hooks/useNextMatchs';
import { MatchCard } from '../components/Matchs/MatchCard';

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
    <main className="min-h-screen bg-[#0a0b0d]">
      <div className="bg-[#14181c] border-b border-white/5 pt-20 pb-20 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none">
          <img src={team.logoUrl} className="w-full h-full object-contain grayscale" alt="" />
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-end gap-12 relative z-10">
          <div className="w-32 h-32 sm:w-48 sm:h-48 bg-[#1b2228] rounded-md shadow-2xl p-8 border border-white/10 relative group flex-shrink-0">
            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain filter drop-shadow-2xl" />
          </div>

          <div className="flex-1 text-left mb-2">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none uppercase italic display-font">{team.name}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-[#667788] uppercase tracking-[0.25em] font-bold text-xs">{team.competition?.country || 'France'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2c3440]"></span>
              <span className="text-[#667788] uppercase tracking-[0.25em] font-bold text-xs">{team.competition?.name || 'Club International'}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12 mb-2">
            <BigStat label="Diary entries" value={totalDiaryEntries >= 1000 ? `${(totalDiaryEntries / 1000).toFixed(1)}k` : totalDiaryEntries.toString()} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-3 space-y-16">
            <section>
              <div className="flex flex-col gap-6 mb-10 border-b border-white/5 pb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#667788]">MATCHOGRAPHY</span>

                <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
                  {/* Status Filter */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em]">Status</span>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="bg-transparent text-[11px] font-bold text-[#8899aa] focus:text-white outline-none cursor-pointer border-none p-0 m-0"
                    >
                      <option value="all" className="bg-[#14181c]">All Matches</option>
                      <option value="finished" className="bg-[#14181c]">Finished</option>
                      <option value="upcoming" className="bg-[#14181c]">Upcoming</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black text-[#445566] tracking-[0.2em]">Sort by</span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as any)}
                      className="bg-transparent text-[11px] font-bold text-[#8899aa] focus:text-white outline-none cursor-pointer border-none p-0 m-0"
                    >
                      <option value="date" className="bg-[#14181c]">Date</option>
                      <option value="rating" className="bg-[#14181c]">Highest Rated</option>
                    </select>
                  </div>

                  {/* Match Count */}
                  <div className="ml-auto text-[10px] uppercase tracking-widest text-[#445566] font-bold">
                    {filteredAndSortedMatches.length} {filteredAndSortedMatches.length === 1 ? 'Match' : 'Matches'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-12">
                {isLoadingMatches ? (
                  Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-[2.5/1] bg-white/5 animate-pulse rounded-xl" />
                  ))
                ) : filteredAndSortedMatches.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-[#445566] uppercase tracking-widest text-xs font-bold">No matches found for these filters.</p>
                  </div>
                ) : (
                  filteredAndSortedMatches.map(match => (
                    <MatchCard key={match.id} match={match} variant="poster" />
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <section className="bg-[#1b2228] rounded-2xl border border-white/5 p-8 shadow-xl">
              <h3 className="text-[10px] font-black text-[#667788] uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">CLUB PERFORMANCE</h3>

              <div className="mb-10">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-[#445566] mb-3">
                  <span>Results Distribution</span>
                  <span className="text-white">{stats.wins}W - {stats.draws}D - {stats.losses}L</span>
                </div>
                <div className="h-2 w-full flex rounded-full overflow-hidden bg-white/5">
                  <div style={{ width: stats.winRate }} className="bg-kickr h-full" title={`Wins: ${stats.winRate}`}></div>
                  <div style={{ width: stats.drawRate }} className="bg-[#445566] h-full" title={`Draws: ${stats.drawRate}`}></div>
                  <div style={{ width: stats.lossRate }} className="bg-[#ef4444]/60 h-full" title={`Losses: ${stats.lossRate}`}></div>
                </div>
              </div>

              <div className="space-y-8 mb-10">
                <div className="flex items-center justify-between">
                  <MiniStat label="Attack" value={stats.avgScored} description="Avg goals" />
                  <div className="w-px h-10 bg-white/5"></div>
                  <MiniStat label="Community" value={stats.globalAverageRating} description="Avg stars" />
                  <div className="w-px h-10 bg-white/5"></div>
                  <MiniStat label="Defense" value={stats.avgConceded} description="Avg goals" />
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-[9px] font-bold text-[#667788] uppercase tracking-widest mb-4">Recent Form</h4>
                <div className="flex gap-2">
                  {stats.form.map((res, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-black ${res === 'W' ? 'bg-kickr text-black' :
                        res === 'D' ? 'bg-[#445566] text-white' :
                          'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/20'
                        }`}
                    >
                      {res}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between uppercase tracking-widest">
                  <span className="text-[9px] font-bold text-[#445566]">Clean Sheets</span>
                  <span className="text-xl font-black text-white italic">{stats.cleanSheets}</span>
                </div>
                <p className="text-[11px] text-[#5c6470] italic leading-relaxed">
                  Based on {matches?.filter(m => m.homeScore !== null).length || 0} real matches in the database.
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
    <div className="text-[10px] font-bold text-[#667788] uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black text-white italic">{value}</div>
  </div>
);

const MiniStat = ({ label, value, description }: { label: string; value: string; description: string }) => (
  <div>
    <div className="text-[9px] font-bold text-[#667788] uppercase tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black text-kickr font-display italic">{value}</div>
    <div className="text-[9px] text-[#445566] uppercase font-bold tracking-tighter mt-1">{description}</div>
  </div>
);
