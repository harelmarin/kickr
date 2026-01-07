import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useTeam } from '../hooks/useTeams';
import { useMatchesByTeam } from '../hooks/useNextMatchs';
import { MatchPoster } from '../components/Matchs/MatchPoster';
import type { Match } from '../types/Match';

export const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<'all' | 'finished' | 'upcoming'>('all');
  const [sort, setSort] = useState<'date' | 'popularity' | 'rating'>('date');

  const { data: team, isLoading: isLoadingTeam } = useTeam(id!);
  const { data: matches, isLoading: isLoadingMatches } = useMatchesByTeam(id!);

  // Filter and sort matches
  const filteredAndSortedMatches = useMemo(() => {
    if (!matches) return [];

    let filtered = [...matches];

    // Filter by status
    if (status === 'finished') {
      filtered = filtered.filter(m => m.homeScore !== null);
    } else if (status === 'upcoming') {
      filtered = filtered.filter(m => m.homeScore === null);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sort) {
        case 'date':
          return new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime();
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'popularity':
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [matches, status, sort]);

  if (isLoadingTeam || !team) return null;

  return (
    <main className="min-h-screen bg-[#0a0b0d]">
      {/* Team Profile Header - Cinematic Identity */}
      <div className="bg-[#14181c] border-b border-white/5 pt-20 pb-20 relative overflow-hidden">
        {/* Subtle Crest Backdrop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none">
          <img src={team.logoUrl} className="w-full h-full object-contain grayscale" alt="" />
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-end gap-12 relative z-10">
          <div className="w-48 h-48 bg-[#1b2228] rounded-md shadow-2xl p-8 border border-white/10 relative group flex-shrink-0">
            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain filter drop-shadow-2xl" />
          </div>

          <div className="flex-1 text-left mb-2">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none uppercase italic display-font">{team.name}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-[#667788] uppercase tracking-[0.25em] font-bold text-xs">{team.country}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2c3440]"></span>
              <span className="text-[#667788] uppercase tracking-[0.25em] font-bold text-xs">{team.competitionId ? 'Division 1' : 'Club International'}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12 mb-2">
            <BigStat label="Popularity" value="High" />
            <BigStat label="Diary entries" value="12k" />
          </div>
        </div>
      </div>

      {/* Team Content: The "Matchography" */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">

          {/* Main List of Matches */}
          <div className="lg:col-span-3 space-y-16">
            <section>
              <div className="flex flex-col gap-6 mb-10 border-b border-white/5 pb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#667788]">MATCHOGRAPHY</span>

                {/* Filters */}
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
                      <option value="popularity" className="bg-[#14181c]">Popularity</option>
                      <option value="rating" className="bg-[#14181c]">Highest Rated</option>
                    </select>
                  </div>

                  {/* Match Count */}
                  <div className="ml-auto text-[10px] uppercase tracking-widest text-[#445566] font-bold">
                    {filteredAndSortedMatches.length} {filteredAndSortedMatches.length === 1 ? 'Match' : 'Matches'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                {isLoadingMatches ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded" />
                  ))
                ) : filteredAndSortedMatches.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-[#445566] uppercase tracking-widest text-xs font-bold">No matches found for these filters.</p>
                  </div>
                ) : (
                  filteredAndSortedMatches.map(match => (
                    <MatchPoster key={match.id} match={match} />
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar: Tactical Overview */}
          <div className="space-y-12">
            <section className="bg-[#1b2228] rounded border border-white/5 p-8 shadow-xl">
              <h3 className="text-[10px] font-black text-[#667788] uppercase tracking-[0.3em] mb-8">CLUB PERFORMANCE</h3>
              <div className="space-y-8">
                <MiniStat label="Average Rating" value="4.2" description="Community score" />
                <MiniStat label="Winning Season" value="82%" description="In all venues" />
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[11px] text-[#5c6470] italic leading-relaxed">
                  Ce club est l'un des plus suivis sur Kickr. Leurs matchs génèrent en moyenne 1.5x plus de reviews que le reste de la ligue.
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
