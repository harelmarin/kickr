import { NextMatchesClient } from '@/components/Matchs/nextMatchsClient';

export default function HomePage() {
  return (
    <>
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 text-white">
        <div className="max-w-2xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Suivez vos matchs préférés ⚽</h1>
          <p className="text-lg md:text-xl opacity-90">
            Découvrez les prochains matchs, suivez vos clubs et partagez vos avis, comme sur Letterboxd mais pour le foot.
          </p>
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Prochains Matchs</h2>
        <NextMatchesClient />
      </section>
    </>
  );
}
