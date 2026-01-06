import { useParams } from 'react-router-dom';
import { useTeam } from '../hooks/useTeams';
import { useMatchesByTeam } from '../hooks/useNextMatchs';
import { MatchPoster } from '../components/Matchs/MatchPoster';

export const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: team, isLoading: isLoadingTeam } = useTeam(id!);
  const { data: matches, isLoading: isLoadingMatches } = useMatchesByTeam(id!);

  if (isLoadingTeam || !team) return null;

  return (
    <main className="min-h-screen bg-[#14181c]">
      {/* Team Profile Header - Cinematic Identity */}
      <div className="bg-[#1b2228] border-b border-black pt-20 pb-16 relative overflow-hidden">
        {/* Subtle Crest Backdrop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none">
          <img src={team.logoUrl} className="w-full h-full object-contain grayscale" alt="" />
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-end gap-12 relative z-10">
          <div className="w-48 h-48 bg-[#2c3440] rounded shadow-2xl p-8 border border-white/10 relative group flex-shrink-0">
            <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain filter drop-shadow-2xl" />
          </div>

          <div className="flex-1 text-left mb-2">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none uppercase italic">{team.name}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-[#99aabb] uppercase tracking-[0.2em] font-bold text-xs">{team.country}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#445566]"></span>
              <span className="text-[#99aabb] uppercase tracking-[0.2em] font-bold text-xs">{team.competitionId ? 'Division 1' : 'Club International'}</span>
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
              <div className="flex items-center justify-between section-title mb-10 border-b border-white/5 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#667788]">MATCHOGRAPHY</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                {isLoadingMatches ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded" />
                  ))
                ) : (
                  matches?.map(match => (
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
    <div className="text-2xl font-black text-[var(--color-green-primary)] font-display italic">{value}</div>
    <div className="text-[9px] text-[#445566] uppercase font-bold tracking-tighter mt-1">{description}</div>
  </div>
);
