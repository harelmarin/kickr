import { useCompetitions } from '../hooks/useCompetitions';
import { Link } from 'react-router-dom';

export const CompetitionsPage = () => {
  const { data: competitions, isLoading, isError } = useCompetitions();

  if (isLoading)
    return (
      <div className="text-center py-20 text-lg">Loading competitions...</div>
    );
  if (isError)
    return (
      <div className="text-center py-20 text-lg text-red-500">
        Erreur lors du chargement des compétitions
      </div>
    );

  return (
    <main className="flex flex-col min-h-screen bg-[#0F0D13] text-white">
      <section className="max-w-7xl  mt-16 pb-16">
        <h2 className="text-[50px] font-bold header-title border-b-2 border-gray-700 w-fit mb-12 leading-tight">
          Competitions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {competitions!.map((comp) => (
            <Link
              key={comp.id}
              to={`/competitions/${comp.id}`}
              className="bg-gray-900 hover:bg-gray-800 transition rounded-lg flex flex-col items-center p-6 text-center shadow-lg"
            >
              {comp.logoUrl ? (
                <img
                  src={comp.logoUrl}
                  alt={comp.name}
                  className="w-24 h-24 mb-4 object-contain"
                />
              ) : (
                <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-700 rounded-full text-xl">
                  {comp.name.charAt(0)}
                </div>
              )}
              <span className="text-xl font-semibold">{comp.name}</span>
              {comp.country && (
                <span className="text-gray-400 text-sm mt-1">
                  {comp.country}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};
