import { useCompetitions } from '../hooks/useCompetitions';
import { Link } from 'react-router-dom';

export const CompetitionsPage = () => {
  const { data: competitions, isLoading, isError } = useCompetitions();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#14181c]">
        <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#14181c] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-display text-white mb-2 italic">Leagues</h1>
          <p className="text-[#99aabb] uppercase tracking-[0.2em] text-[11px] font-bold">
            Major football competitions around the globe
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {[...competitions!].sort((a, b) => a.name.localeCompare(b.name)).map((comp) => (
            <Link
              key={comp.id}
              to={`/competitions/${comp.id}`}
              className="group"
            >
              <div className="aspect-square bg-[#2c3440] rounded-xl border border-white/5 p-8 flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-[var(--color-primary)] group-hover:bg-[#1b2228] shadow-lg">
                <img
                  src={comp.logoUrl}
                  alt={comp.name}
                  className="max-w-full max-h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-center text-sm font-bold text-white group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
                {comp.name}
              </h3>
              <p className="text-center text-[10px] text-[#667788] uppercase tracking-widest mt-1">
                {comp.country || 'International'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};
