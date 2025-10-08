import { NextMatchesClient } from '@/components/Matchs/nextMatchsClient';

export default function Page() {
  return (
    <main className="min-h-screen p-6 md:p-12 bg-gray-100">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-12">Prochains Matchs ⚽</h1>
      <NextMatchesClient />
    </main>
  );
}
