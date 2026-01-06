import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { matchService } from '../services/matchService';

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  const { data: match, isLoading, isError } = useQuery({
    queryKey: ['match', id],
    queryFn: () => matchService.fetchMatchById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary text-lg">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="card-glass p-8 text-center max-w-md">
          <h3 className="text-xl font-semibold text-primary mb-2">Match Not Found</h3>
          <p className="text-secondary mb-6">The match you are looking for does not exist or has been removed.</p>
          <Link to="/matches" className="btn btn-primary">Back to Matches</Link>
        </div>
      </div>
    );
  }

  const matchDate = new Date(match.matchDate);
  const hasScore = match.homeScore !== null && match.awayScore !== null;

  return (
    <main className="flex flex-col min-h-screen bg-primary overflow-x-hidden">
      {/* Cinematic Backdrop */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="/img/hero.jpg"
          alt="Stadium Backdrop"
          className="w-full h-full object-cover opacity-40 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-64 relative z-10 w-full">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Match Poster / Card */}
          <div className="flex-shrink-0 w-full md:w-[320px]">
            <div className="card p-0 overflow-hidden shadow-2xl border-primary bg-secondary/80 backdrop-blur-xl">
              <div className="p-8 flex flex-col items-center gap-6">
                <div className="flex items-center justify-center gap-4 w-full">
                  <div className="w-24 h-24 bg-tertiary rounded-xl p-3 shadow-lg">
                    <img src={match.homeLogo} alt={match.homeTeam} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-2xl font-display text-green-bright">VS</div>
                  <div className="w-24 h-24 bg-tertiary rounded-xl p-3 shadow-lg">
                    <img src={match.awayLogo} alt={match.awayTeam} className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="w-full text-center">
                  <div className="text-xs font-bold text-green-bright uppercase tracking-widest mb-1">
                    {match.competition}
                  </div>
                  <div className="text-sm text-secondary">
                    {matchDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                {hasScore && (
                  <div className="flex items-center justify-center gap-6 w-full py-4 bg-tertiary/30 rounded-2xl border border-primary">
                    <span className="text-5xl font-display font-black text-primary">{match.homeScore}</span>
                    <span className="text-2xl font-display text-tertiary">-</span>
                    <span className="text-5xl font-display font-black text-primary">{match.awayScore}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions (Sidebar Style) */}
            <div className="mt-8 space-y-3">
              <button className="btn btn-secondary w-full py-3 flex justify-between items-center group">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Add to Diary
                </span>
                <span className="text-xs text-muted">M</span>
              </button>
              <button className="btn btn-secondary w-full py-3 flex justify-between items-center group">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-bright" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Like Match
                </span>
                <span className="text-xs text-muted">L</span>
              </button>
            </div>
          </div>

          {/* Match Info & Rating (Main Content Style) */}
          <div className="flex-1">
            <header className="mb-10 pt-10">
              <div className="flex items-center gap-3 text-tertiary text-sm mb-4">
                <Link to="/matches" className="hover:text-green-bright transition-colors">Matches</Link>
                <span>›</span>
                <span className="text-secondary">{match.homeTeam} vs {match.awayTeam}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display text-primary mb-4 leading-none">
                {match.homeTeam} <span className="text-tertiary">v</span> {match.awayTeam}
              </h1>
              <div className="flex items-center gap-6 text-xl text-secondary">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-bright" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {match.location}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {matchDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
              </div>
            </header>

            {/* Rating Section - Letterboxd Style */}
            <div className="card-glass p-8 mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <h3 className="text-xs font-bold text-tertiary uppercase tracking-[0.2em] mb-4">Rate this match</h3>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform duration-200 active:scale-90"
                      >
                        <svg
                          className={`w-12 h-12 transition-colors ${star <= (hoveredRating || rating)
                              ? 'text-green-bright fill-current'
                              : 'text-tertiary/30'
                            }`}
                          stroke="currentColor"
                          strokeWidth={2}
                          fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    ))}
                    {rating > 0 && <span className="text-3xl font-display text-green-bright ml-4">{rating}</span>}
                  </div>
                </div>
                <div className="flex-1 max-w-md">
                  <h3 className="text-xs font-bold text-tertiary uppercase tracking-[0.2em] mb-4">Add a review</h3>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your thoughts..."
                    className="w-full bg-primary/50 border border-primary rounded-xl p-4 text-primary min-h-[100px] focus:outline-none focus:border-green-bright transition-all"
                  />
                  <div className="flex justify-end mt-4">
                    <button className="btn btn-primary px-8 py-2">Post Review</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Section */}
            <div>
              <div className="flex items-center justify-between border-b border-primary pb-4 mb-8">
                <h3 className="text-xl font-display text-primary uppercase tracking-widest">Recent Reviews</h3>
                <Link to="#" className="text-xs text-tertiary hover:text-green-bright uppercase tracking-widest">See all activity</Link>
              </div>

              <div className="card-glass p-12 text-center">
                <div className="text-tertiary text-lg">No reviews yet. Be the first to share your opinion!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
