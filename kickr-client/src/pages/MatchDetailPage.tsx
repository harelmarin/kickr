import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  // TODO: Fetch match data from API
  const match = {
    id: id,
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeLogo: 'https://via.placeholder.com/100',
    awayLogo: 'https://via.placeholder.com/100',
    homeScore: 2,
    awayScore: 1,
    matchDate: new Date().toISOString(),
    competition: 'Premier League',
    location: 'Old Trafford',
  };

  const matchDate = new Date(match.matchDate);

  return (
    <main className="flex flex-col min-h-screen bg-primary">
      {/* Header */}
      <section className="bg-secondary border-b border-primary py-8">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="text-sm text-tertiary hover:text-green-bright mb-4 inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to matches
          </Link>

          <div className="mt-4">
            <span className="badge badge-green text-xs mb-3 inline-block">{match.competition}</span>
            <div className="flex items-center justify-between gap-8">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-24 h-24 bg-tertiary rounded-xl p-4 mb-3">
                  <img src={match.homeLogo} alt={match.homeTeam} className="w-full h-full object-contain" />
                </div>
                <h2 className="text-2xl font-display text-primary text-center">{match.homeTeam}</h2>
                {match.homeScore !== null && (
                  <span className="text-5xl font-display text-green-bright mt-2">{match.homeScore}</span>
                )}
              </div>

              {/* VS */}
              <div className="flex flex-col items-center">
                <span className="text-3xl font-display text-green-bright">VS</span>
                <span className="text-sm text-tertiary mt-2">
                  {matchDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="text-sm text-tertiary">
                  {matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-24 h-24 bg-tertiary rounded-xl p-4 mb-3">
                  <img src={match.awayLogo} alt={match.awayTeam} className="w-full h-full object-contain" />
                </div>
                <h2 className="text-2xl font-display text-primary text-center">{match.awayTeam}</h2>
                {match.awayScore !== null && (
                  <span className="text-5xl font-display text-green-bright mt-2">{match.awayScore}</span>
                )}
              </div>
            </div>

            {match.location && (
              <div className="flex items-center justify-center gap-2 text-sm text-tertiary mt-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {match.location}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rating Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="card p-8">
            <h3 className="text-2xl font-display text-primary mb-6">Rate This Match</h3>
            
            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="group"
                >
                  <svg
                    className={`w-12 h-12 transition-all ${
                      star <= rating
                        ? 'text-green-bright fill-current'
                        : 'text-tertiary hover:text-green-bright'
                    }`}
                    fill={star <= rating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              ))}
              {rating > 0 && (
                <span className="text-2xl font-display text-green-bright ml-4">
                  {rating}/5
                </span>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-primary mb-2">
                Your Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this match..."
                rows={4}
                className="w-full px-4 py-3 bg-secondary border-2 border-primary text-primary placeholder-tertiary rounded-xl focus:outline-none focus:border-green-bright transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={rating === 0}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Rating
            </button>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12 bg-secondary">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-display text-primary mb-6">Community Ratings</h3>
          
          {/* Empty State */}
          <div className="card-glass p-12 text-center">
            <div className="w-16 h-16 bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-primary mb-2">No Ratings Yet</h4>
            <p className="text-secondary">Be the first to rate this match!</p>
          </div>
        </div>
      </section>
    </main>
  );
};
