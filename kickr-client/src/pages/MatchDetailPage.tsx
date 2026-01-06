import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { matchService } from '../services/matchService';

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const { data: match, isLoading, isError } = useQuery({
    queryKey: ['match', id],
    queryFn: () => matchService.fetchMatchById(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !match) return <ErrorState />;

  const matchDate = new Date(match.matchDate);
  const isPast = match.homeScore !== null;

  return (
    <main className="min-h-screen bg-[#14181c] text-[#99aabb]">
      {/* Cinematic Backdrop */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-30"
          style={{ backgroundImage: `url(${match.homeLogo})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#14181c]/60 to-[#14181c]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-[300px] relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left: The "Match Poster" */}
          <div className="w-full lg:w-[230px] flex-shrink-0">
            <div className="aspect-[2/3] bg-[#2c3440] rounded shadow-2xl border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 flex flex-col items-center justify-around py-10 px-4 bg-gradient-to-br from-[#1b2228] to-[#2c3440]">
                <img src={match.homeLogo} alt={match.homeTeam} className="w-20 h-20 object-contain drop-shadow-xl" />
                <div className="text-white font-black italic tracking-tighter text-xl">VS</div>
                <img src={match.awayLogo} alt={match.awayTeam} className="w-20 h-20 object-contain drop-shadow-xl" />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md p-3 text-center border-t border-white/10">
                <div className="text-white font-black text-lg">
                  {isPast ? `${match.homeScore} - ${match.awayScore}` : 'UPCOMING'}
                </div>
              </div>
            </div>

            {/* Quick Stats / Info below poster */}
            <div className="mt-6 space-y-4 text-[13px] border-t border-white/5 pt-6">
              <div className="flex justify-between">
                <span className="text-[#667788]">Competition</span>
                <Link to={`/competitions/${match.competition}`} className="text-white hover:text-[var(--color-green-primary)] transition-colors">{match.competition}</Link>
              </div>
              <div className="flex justify-between">
                <span className="text-[#667788]">Stade</span>
                <span className="text-white">{match.location}</span>
              </div>
            </div>
          </div>

          {/* Center: Match Details & Reviews */}
          <div className="flex-1">
            <header className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <h1 className="text-5xl font-black text-white tracking-tighter">
                  {match.homeTeam} v {match.awayTeam}
                </h1>
                <span className="text-2xl font-medium text-[#667788]">{matchDate.getFullYear()}</span>
              </div>
              <p className="text-lg font-medium text-white italic opacity-80 decoration-[var(--color-green-primary)]">
                The matchday that shook the {match.competition}.
              </p>
            </header>

            {/* Summary / Description (Could be real data later) */}
            <div className="prose prose-invert max-w-none text-[16px] leading-relaxed mb-12">
              <p>
                Un match d'anthologie disputé au {match.location}. Les deux équipes se sont affrontées dans une ambiance électrique pour le compte de la {match.competition}.
                Un moment d'histoire gravé dans le journal des supporters.
              </p>
            </div>

            {/* Community Reviews Section */}
            <section className="mt-16 pt-8 border-t border-white/10">
              <h2 className="text-xs font-bold text-[#667788] uppercase tracking-[0.2em] mb-8">REVIEWS FROM FRIENDS</h2>
              <div className="space-y-8">
                <ReviewItem
                  user="Alex"
                  rating={4.5}
                  content="Quelle intensité ! Le pressing de match.homeTeam était incroyable en première période."
                />
                <ReviewItem
                  user="Sarah"
                  rating={3}
                  content="Un peu déçue par le manque d'occasions franches, mais tactiquement c'était du haut niveau."
                />
              </div>
            </section>
          </div>

          {/* Right: Actions Sidebar (The Letterboxd Box) */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="bg-[#1b2228] border border-white/10 rounded-lg overflow-hidden shadow-xl sticky top-24">
              <div className="p-6 bg-[#2c3440] border-b border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#8899aa] uppercase tracking-widest">Logged by you</span>
                  <span className="text-white font-bold">{matchDate.toLocaleDateString('fr', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`text-2xl transition-all ${isLiked ? 'text-[#ff8000] scale-110' : 'text-[#445566] hover:text-white'}`}
                >
                  ❤
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Rating Star Picker */}
                <div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`text-4xl transition-all duration-200 ${star <= (hoveredRating || rating) ? 'text-[var(--color-green-primary)]' : 'text-[#445566]'
                          }`}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-[10px] font-bold text-[#667788] uppercase tracking-widest">Rate this match</div>
                </div>

                {/* Review Text Area */}
                <div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Add a review..."
                    className="w-full bg-[#14181c] border border-white/10 rounded p-4 text-sm text-white focus:outline-none focus:border-white/30 h-40 transition-all resize-none"
                  />
                </div>

                <button className="w-full bg-[var(--color-green-primary)] text-black font-black uppercase tracking-[0.2em] py-3 rounded text-[11px] hover:bg-[#3ef87b] transition-all active:scale-[0.98]">
                  SAVE ENTRY
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

const ReviewItem = ({ user, rating, content }: { user: string; rating: number; content: string }) => (
  <div className="flex gap-4 border-b border-white/5 pb-8">
    <div className="w-10 h-10 rounded-full bg-[#2c3440] flex-shrink-0"></div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white font-bold">{user}</span>
        <span className="text-[var(--color-green-primary)] font-bold text-xs">
          {'★'.repeat(Math.floor(rating))}{rating % 1 !== 0 ? '½' : ''}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[#99aabb]">{content}</p>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[var(--color-green-primary)] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl text-white font-bold mb-4">Match non trouvé</h1>
      <Link to="/matches" className="text-[var(--color-green-primary)] hover:underline uppercase tracking-widest text-sm font-bold">Retour aux matchs</Link>
    </div>
  </div>
);
