import { useParams, Link } from 'react-router-dom';
import { useCompetition } from '../hooks/useCompetitions';
import { useTeamsByCompetition } from '../hooks/useTeams';

export const CompetitionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: competition, isLoading: isLoadingComp } = useCompetition(id!);
  const { data: teams, isLoading: isLoadingTeams } = useTeamsByCompetition(id!);

  if (isLoadingComp || !competition) return null;

  return (
    <main className="min-h-screen bg-[#14181c]">
      {/* League Hero Area */}
      <div className="bg-[#1b2228] border-b border-black py-20 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-5 pointer-events-none">
          <img src={competition.logoUrl} className="w-full h-full object-contain grayscale scale-150 rotate-12" alt="" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-40 h-40 bg-[#2c3440] rounded-2xl p-6 shadow-2xl border border-white/5">
            <img src={competition.logoUrl} alt={competition.name} className="w-full h-full object-contain filter drop-shadow-2xl" />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-none">{competition.name}</h1>
            <p className="text-[#99aabb] uppercase tracking-[0.3em] font-bold text-[11px] mb-6">
              Official {competition.country || 'International'} League Page
            </p>

            <div className="flex items-center justify-center md:justify-start gap-8">
              <CompStat label="Clubs" value={teams?.length || 0} />
              <CompStat label="Status" value="Active" />
              <CompStat label="Season" value="2025" />
            </div>
          </div>
        </div>
      </div>

      {/* League Content: Clubs List */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-10">
          <h2 className="section-title">PARTICIPATING CLUBS IN {competition.name.toUpperCase()}</h2>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {isLoadingTeams ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-[#1b2228] animate-pulse rounded-xl" />
            ))
          ) : (
            teams?.map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="group"
              >
                <div className="aspect-square bg-[#1b2228] rounded-xl border border-white/5 p-6 flex items-center justify-center mb-3 transition-all duration-300 group-hover:border-[var(--color-green-primary)] group-hover:bg-[#2c3440] shadow-md relative overflow-hidden">
                  <img
                    src={team.logoUrl}
                    alt={team.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[11px] font-bold text-[#99aabb] text-center group-hover:text-white transition-colors truncate px-2 uppercase tracking-widest">
                  {team.name}
                </h3>
              </Link>
            ))
          )}
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
