import { useCompetitions } from '../hooks/useCompetitions';
import { Link } from 'react-router-dom';

export const CompetitionsPage = () => {
  const { data: competitions, isLoading, isError } = useCompetitions();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0b0d]">
        <div className="w-12 h-12 border-4 border-kickr border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0a0b0d] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 italic tracking-tighter uppercase display-font">Leagues</h1>
          <p className="text-[#667788] uppercase tracking-[0.25em] text-[11px] font-bold">
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
              <div className="aspect-square bg-[#1b2228] rounded-md border border-white/5 p-8 flex items-center justify-center mb-4 transition-all duration-300 poster-hover-effect">
                <img
                  src={comp.logoUrl}
                  alt={comp.name}
                  className="max-w-[75%] max-h-[75%] object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-center text-[11px] font-bold text-[#8899aa] group-hover:text-white transition-colors tracking-widest uppercase">
                {comp.name}
              </h3>
              <p className="text-center text-[9px] text-[#5c6470] uppercase font-black tracking-[0.2em] mt-2 leading-none">
                {comp.country || 'International'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};
