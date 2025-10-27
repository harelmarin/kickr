import { NextMatchesHomePage } from '../components/Matchs/nextMatchsClient';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#0F0D13] text-white">
      <section className="relative flex items-center justify-center h-[80vh] overflow-hidden">
        <img
          src="/img/hero.jpg"
          alt="Football stadium with supporters"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-[#0F0D13]/90" />

        {/* Text */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold header-title mb-6">
            Rate Your Favorite Matches
          </h1>
          <p className="text-lg md:text-xl regular opacity-90 mb-8">
            Discover upcoming games, follow your favorite clubs, and share your
            opinions with your friends
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 text-xl rounded-lg bg-secondary text-white header-title hover:opacity-90 transition cursor-pointer">
              Get Started
            </button>
            <button className="px-6 py-3 text-xl rounded-lg border border-white/50 text-white header-title hover:bg-white/10 transition cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mt-16 mx-auto px-6">
        <h2 className="text-[70px] font-bold header-title border-b-2 border-gray-700 w-fit mx-auto mb-12 leading-tight">
          Upcoming Matches
        </h2>
        <NextMatchesHomePage />
      </section>
    </main>
  );
}
