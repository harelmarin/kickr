import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { matchService } from '../services/matchService';
import { useAuth } from '../hooks/useAuth';
import { useCreateUserMatch, useUserMatchesByMatch, useDeleteUserMatch } from '../hooks/useUserMatch';

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const { data: match, isLoading, isError } = useQuery({
    queryKey: ['match', id],
    queryFn: () => matchService.fetchMatchById(id!),
    enabled: !!id,
  });

  const { data: userMatches } = useUserMatchesByMatch(match?.matchUuid || '');
  const createUserMatch = useCreateUserMatch();
  const deleteUserMatch = useDeleteUserMatch();
  const myMatchEntry = userMatches?.find(m => m.user.id === user?.id);

  const previousEntryId = useRef<string | null>(null);

  // Pre-fill form if entry exists
  useEffect(() => {
    const currentEntryId = myMatchEntry?.id || null;

    // Only update if we're loading a different entry or initializing for the first time
    if (currentEntryId !== previousEntryId.current) {
      if (myMatchEntry) {
        setRating(myMatchEntry.note);
        setReview(myMatchEntry.comment);
        setIsLiked(myMatchEntry.isLiked || false);
      } else {
        setRating(0);
        setReview('');
        setIsLiked(false);
      }
      previousEntryId.current = currentEntryId;
    }
  }, [myMatchEntry]);

  const handleSaveRating = async () => {
    if (!user) {
      toast.error('Please log in to rate this match');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating (stars)');
      return;
    }

    if (!match || !match.matchUuid) {
      console.warn('Match data incomplete:', { match });
      toast.error('Match data is incomplete. Please try refreshing the page.');
      return;
    }

    try {
      await createUserMatch.mutateAsync({
        userId: user.id,
        matchId: match.matchUuid,
        note: rating,
        comment: review,
        isLiked: isLiked,
      });

      toast.success(myMatchEntry ? 'Rating updated successfully!' : 'Rating saved successfully!');
    } catch (error: any) {
      console.error('Error saving rating:', error);
      toast.error(error.response?.data?.message || 'Failed to save rating');
    }
  };

  const handleDeleteEntry = async () => {
    if (!myMatchEntry) return;

    if (window.confirm('Are you sure you want to remove your rating for this match?')) {
      try {
        await deleteUserMatch.mutateAsync(myMatchEntry.id);
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError || !match) return <ErrorState />;

  const matchDate = new Date(match.matchDate);
  const isPast = match.homeScore !== null;

  return (
    <main className="min-h-screen bg-[#14181c] text-[#99aabb]">
      {/* Cinematic Hero Backdrop */}
      <div className="relative h-[650px] w-full overflow-hidden">
        {/* Atmospheric Background Image - Using a high-quality stadium shot */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110 brightness-[0.4] grayscale-[0.2] saturate-[0.8]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=2000')` }}
        ></div>

        {/* Layered Gradients for Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#14181c] via-transparent to-[#14181c]/20"></div>

        {/* Subtle Mesh Glow Elements */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-kickr/5 rounded-full blur-[150px] mix-blend-screen opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#4466ff]/5 rounded-full blur-[120px] mix-blend-screen opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-[480px] relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Left: The "Match Poster" */}
          <div className="w-full lg:w-[240px] flex-shrink-0">
            <div className="aspect-[2/3] bg-[#2c3440] rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 flex flex-col items-center justify-around py-12 px-5 bg-gradient-to-br from-[#1b2228] to-[#2c3440]">
                <div className="flex flex-col items-center gap-3">
                  <Link to={`/teams/${match.homeTeamId}`} className="transition-transform hover:scale-110 active:scale-95 duration-300">
                    <img src={match.homeLogo} alt={match.homeTeam} className="w-20 h-20 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                  </Link>
                  <span className="text-[9px] font-black text-[#5c6470] uppercase tracking-[0.3em] italic">{match.homeTeam}</span>
                </div>

                <div className="text-white/20 font-black italic tracking-tighter text-2xl select-none">VS</div>

                <div className="flex flex-col items-center gap-3">
                  <Link to={`/teams/${match.awayTeamId}`} className="transition-transform hover:scale-110 active:scale-95 duration-300">
                    <img src={match.awayLogo} alt={match.awayTeam} className="w-20 h-20 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                  </Link>
                  <span className="text-[9px] font-black text-[#5c6470] uppercase tracking-[0.3em] italic">{match.awayTeam}</span>
                </div>
              </div>

              {isPast && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-xl p-6 text-center border-t border-white/10">
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-black text-[#667788] uppercase tracking-[0.2em]">Final</span>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-5xl font-black text-white tracking-tighter leading-none">{match.homeScore}</div>
                        </div>
                        <div className="text-white/20 font-black text-3xl">—</div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-5xl font-black text-white tracking-tighter leading-none">{match.awayScore}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats / Info below poster */}
            <div className="mt-8 space-y-6 text-[13px] border-t border-white/5 pt-8">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase font-black text-[#445566] tracking-[0.2em]">Competition</span>
                <Link
                  to={match.competitionId ? `/competitions/${match.competitionId}` : '#'}
                  className="flex items-center gap-4 group transition-all pb-2 border-b border-white/5"
                >
                  <img src={match.competitionLogo} alt="" className="w-6 h-6 object-contain filter brightness-110 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-black text-[#99aabb] group-hover:text-white uppercase tracking-wider truncate transition-colors">{match.competition}</span>
                    <span className="text-white text-[9px] font-bold group-hover:text-kickr transition-colors tracking-widest uppercase mt-0.5">VIEW LEAGUE →</span>
                  </div>
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-black text-[#445566] tracking-[0.2em]">Stade</span>
                <span className="text-white font-bold text-sm">{match.location}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-black text-[#445566] tracking-[0.2em]">Date</span>
                <span className="text-white font-bold text-sm">
                  {matchDate.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-black text-[#445566] tracking-[0.2em]">Heure de coup d'envoi</span>
                <span className="text-white font-bold text-sm">
                  {matchDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Match Details & Reviews */}
          <div className="flex-1 mt-12">
            <header className="mb-12">


              <div className="flex flex-col gap-4 mb-4">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.1]">
                  <Link to={`/teams/${match.homeTeamId}`} className="hover:text-kickr transition-colors relative inline-block group/home uppercase italic text-white">
                    {match.homeTeam}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-kickr group-hover/home:w-full transition-all duration-500"></span>
                  </Link>
                  <span className="mx-2 md:mx-4 text-white/30 font-thin not-italic">vs</span>
                  <Link to={`/teams/${match.awayTeamId}`} className="hover:text-kickr transition-colors relative inline-block group/away uppercase italic text-white">
                    {match.awayTeam}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-kickr group-hover/away:w-full transition-all duration-500"></span>
                  </Link>
                </h1>

                <div className="flex items-center gap-4">
                  <span className="text-xl md:text-2xl font-black uppercase tracking-[0.15em] italic text-[#99aabb]">
                    {matchDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-8 pt-2">
                <div className="flex items-center gap-4">
                  {match.averageRating && match.averageRating > 0 ? (
                    <div className="flex items-center gap-3 bg-kickr/[0.03] border border-kickr/10 px-4 py-2 rounded-lg">
                      <div className="flex text-kickr text-sm">
                        {'★'.repeat(Math.round(match.averageRating))}
                        <span className="text-white/5">{'★'.repeat(5 - Math.round(match.averageRating))}</span>
                      </div>
                      <span className="text-white font-black italic">{match.averageRating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-[#445566] uppercase tracking-widest">Awaiting community ratings</span>
                  )}
                </div>
              </div>

            </header>



            {/* Community Reviews Section */}
            <section className="mt-16 pt-8 border-t border-white/10">
              <h2 className="text-xs font-bold text-[#667788] uppercase tracking-[0.2em] mb-8">
                COMMUNITY REVIEWS ({userMatches?.length || 0})
              </h2>
              {userMatches && userMatches.length > 0 ? (
                <div className="space-y-8">
                  {userMatches.map((userMatch) => (
                    <ReviewItem
                      key={userMatch.id}
                      userId={userMatch.user.id}
                      user={userMatch.user.name}
                      rating={userMatch.note}
                      content={userMatch.comment}
                      watchedAt={userMatch.watchedAt}
                      isLiked={userMatch.isLiked}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[#667788] text-sm italic">No reviews yet. Be the first to review this match!</p>
              )}
            </section>
          </div>

          {/* Right: Actions Sidebar (The Letterboxd Box) */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="bg-[#1b2228] border border-white/10 rounded-lg overflow-hidden shadow-xl sticky top-24">
              <div className="p-6 bg-[#2c3440] border-b border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#8899aa] uppercase tracking-widest">
                      {myMatchEntry ? 'Watched by you' : 'Logged by you'}
                    </span>
                    {myMatchEntry && <span className="text-[#4466ff] text-[10px]">●</span>}
                  </div>
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
                        className={`text-4xl transition-all duration-200 ${star <= (hoveredRating || rating) ? (myMatchEntry ? 'text-[#4466ff]' : 'text-kickr') : 'text-[#445566]'
                          }`}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-[10px] font-bold text-[#667788] uppercase tracking-widest">
                    {myMatchEntry ? 'Your rating' : 'Rate this match'}
                  </div>
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

                <button
                  onClick={handleSaveRating}
                  disabled={rating === 0 || createUserMatch.isPending}
                  className={`w-full py-3 rounded text-[11px] font-bold hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all ${myMatchEntry ? 'bg-[#4466ff] text-white' : 'btn-primary-kickr'
                    }`}
                >
                  {createUserMatch.isPending ? 'SAVING...' : myMatchEntry ? 'UPDATE ENTRY' : 'SAVE ENTRY'}
                </button>

                {myMatchEntry && (
                  <button
                    onClick={handleDeleteEntry}
                    disabled={deleteUserMatch.isPending}
                    className="w-full text-[10px] font-bold text-[#445566] hover:text-red-500 transition-colors uppercase tracking-widest pt-2"
                  >
                    {deleteUserMatch.isPending ? 'REMOVING...' : 'Remove rating'}
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

const ReviewItem = ({ userId, user, rating, content, watchedAt, isLiked }: { userId: string; user: string; rating: number; content: string; watchedAt?: string; isLiked?: boolean }) => {
  return (
    <div className="flex gap-4 border-b border-white/5 pb-8">
      <div className="w-10 h-10 rounded-full bg-[#2c3440] flex-shrink-0 flex items-center justify-center text-[10px] text-white font-black uppercase">
        {user[0]}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/user/${userId}`} className="text-white font-bold hover:text-kickr transition-colors">{user}</Link>
          <span className="text-kickr font-bold text-xs pl-2 border-l border-white/10 ml-2">
            {'★'.repeat(Math.round(rating))}
            <span className="text-white/5">{'★'.repeat(5 - Math.round(rating))}</span>
          </span>
          {isLiked === true && (
            <span className="text-[#ff8000] text-sm ml-1" title="Liked">❤</span>
          )}
          {watchedAt && (
            <span className="text-[#667788] text-[9px] font-black uppercase tracking-widest ml-auto">
              {new Date(watchedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
        {content && content.trim() !== "" && (
          <p className="text-sm leading-relaxed text-[#99aabb] italic">"{content}"</p>
        )}
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-kickr border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen bg-[#14181c] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl text-white font-bold mb-4">Match non trouvé</h1>
      <Link to="/matches" className="text-kickr hover:underline uppercase tracking-widest text-sm font-bold">Retour aux matchs</Link>
    </div>
  </div>
);
