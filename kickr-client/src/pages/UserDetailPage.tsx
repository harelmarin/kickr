import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useUserMatchesByUser } from '../hooks/useUserMatch';
import { ReviewCard } from '../components/review/ReviewCard';
import { useAuth } from '../hooks/useAuth';
import { useFollowStatus, useFollowAction, useFollowers, useFollowing } from '../hooks/useFollow';
import type { UserMatch } from '../types/userMatch';

export const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading: isUserLoading } = useUser(id);
    const { data: pageData, isLoading: isReviewsLoading } = useUserMatchesByUser(id || '', 0, 50);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const { data: isFollowing } = useFollowStatus(currentUser?.id, id);
    const { data: followers } = useFollowers(id);
    const { data: following } = useFollowing(id);
    const followAction = useFollowAction();

    const isOwnProfile = currentUser?.id === id;

    const handleFollowToggle = () => {
        if (!currentUser) {
            navigate('/register');
            return;
        }
        followAction.mutate({
            followerId: currentUser.id,
            followedId: id!,
            action: isFollowing ? 'unfollow' : 'follow'
        });
    };

    if (isUserLoading) return <LoadingState />;
    if (!user) return <NotFoundState />;

    return (
        <main className="min-h-screen bg-[#0a0b0d] pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-6">

                <header className="mb-12 md:mb-16">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 mb-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 text-center sm:text-left">
                            {isOwnProfile ? (
                                <Link
                                    to="/settings"
                                    className="relative group/avatar w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-105"
                                    title="Change Profile Picture"
                                >
                                    <div className="w-full h-full bg-gradient-to-br from-kickr/20 to-kickr/5 border border-kickr/20 flex items-center justify-center text-2xl sm:text-3xl font-black text-kickr">
                                        {user.avatarUrl ? (
                                            <img
                                                key={user.avatarUrl}
                                                src={user.avatarUrl}
                                                alt={user.name}
                                                className="w-full h-full object-cover group-hover/avatar:opacity-40 transition-opacity"
                                            />
                                        ) : (
                                            user.name[0].toUpperCase()
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-black/40">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Edit</span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-kickr/20 to-kickr/5 border border-kickr/20 flex items-center justify-center text-2xl sm:text-3xl font-black text-kickr overflow-hidden shadow-2xl">
                                    {user.avatarUrl ? (
                                        <img
                                            key={user.avatarUrl}
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        user.name[0].toUpperCase()
                                    )}
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{user.name}</h1>
                                    {isOwnProfile && (
                                        <span className="bg-kickr/10 text-kickr text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-kickr/20">
                                            You
                                        </span>
                                    )}
                                </div>
                                <p className="text-[#667788] text-xs uppercase tracking-widest">
                                    Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div>
                            {isOwnProfile ? (
                                <Link
                                    to="/settings"
                                    className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg border border-white/10 transition-all flex items-center gap-2"
                                >
                                    <span>✎</span>
                                    Edit Settings
                                </Link>
                            ) : (
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={followAction.isPending}
                                    className={`group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all ${isFollowing
                                        ? 'bg-white/5 border border-white/10 hover:border-red-500/50'
                                        : 'bg-kickr/10 border border-kickr/30 hover:bg-kickr/20'
                                        } disabled:opacity-50`}
                                    title={isFollowing ? 'Unfollow' : 'Follow'}
                                >
                                    <span className={`text-sm transition-colors ${isFollowing
                                        ? 'text-white group-hover:text-red-500'
                                        : 'text-kickr'
                                        }`}>
                                        👤
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isFollowing
                                        ? 'text-white group-hover:text-red-500'
                                        : 'text-kickr'
                                        }`}>
                                        {followAction.isPending ? '...' : isFollowing ? 'Following' : 'Follow'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-8 px-4 sm:px-6 py-4 bg-[#1b2228] border border-white/5 rounded-xl overflow-x-auto no-scrollbar">
                        <StatHorizontal
                            label="Logs"
                            value={user.matchesCount.toString()}
                            onClick={() => navigate(`/user/${id}/diary`)}
                        />
                        <div className="w-px h-8 bg-white/10" />
                        <StatHorizontal
                            label="Following"
                            value={user.followingCount.toString()}
                            onClick={() => navigate(`/user/${id}/following`)}
                        />
                        <div className="w-px h-8 bg-white/10" />
                        <StatHorizontal
                            label="Fans"
                            value={user.followersCount.toString()}
                            onClick={() => navigate(`/user/${id}/followers`)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    {/* Main Content: Activity */}
                    <div className="lg:col-span-2 space-y-24">
                        {/* Diary Section */}
                        <section id="diary-entries" className="space-y-12 section-contrast p-8 rounded-2xl">
                            <div className="flex items-center justify-between border-b border-kickr/20 pb-6">
                                <Link to={`/user/${id}/diary`} className="text-sm font-black text-white hover:text-kickr transition-colors uppercase tracking-[0.2em]">Recent Diary Entries →</Link>
                                <span className="text-[10px] font-bold text-kickr uppercase tracking-widest">{pageData?.totalElements || 0} Total</span>
                            </div>

                            {isReviewsLoading ? (
                                <div className="space-y-12 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl"></div>)}
                                </div>
                            ) : pageData?.content && pageData.content.length > 0 ? (
                                <div className="grid grid-cols-1 gap-12">
                                    {([...pageData.content]
                                        .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
                                        .slice(0, 3)
                                    ).map(review => (
                                        <ReviewCard key={review.id} review={review} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                                    <p className="text-[#445566] text-xs font-bold uppercase tracking-widest">No match entries in the diary yet.</p>
                                </div>
                            )}
                        </section>

                        {/* Network Section (Followers/Following) */}
                        <section id="network-section" className="space-y-16 pt-12 bg-[#14181c]/50 p-8 rounded-2xl border border-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {/* Following Column */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xs font-bold text-white uppercase tracking-widest">Following</h2>
                                            <span className="text-[9px] font-black px-2 py-0.5 bg-kickr/10 rounded text-kickr">{following?.totalElements ?? user.followingCount}</span>
                                        </div>
                                        <Link to={`/user/${id}/following`} className="text-[9px] font-bold text-kickr hover:text-white transition-colors uppercase tracking-widest">View All →</Link>
                                    </div>
                                    {following?.content && following.content.length > 0 ? (
                                        <div className="grid grid-cols-12 gap-3">
                                            {following.content.slice(0, 24).map((f) => (
                                                <Link
                                                    key={f.id}
                                                    to={`/user/${f.id}`}
                                                    className="group relative"
                                                    title={f.name}
                                                >
                                                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#1b2228] to-[#2c3440] border border-white/10 flex items-center justify-center text-[8px] font-black text-kickr uppercase group-hover:border-kickr/50 group-hover:scale-110 transition-all shadow-lg overflow-hidden">
                                                        {f.avatarUrl ? (
                                                            <img src={f.avatarUrl} alt={f.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            f.name[0]
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[9px] text-[#445566] italic uppercase font-bold">Not following anyone yet.</p>
                                    )}
                                </div>

                                {/* Followers Column */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xs font-bold text-white uppercase tracking-widest">Followers</h2>
                                            <span className="text-[9px] font-black px-2 py-0.5 bg-kickr/10 rounded text-kickr">{followers?.totalElements ?? user.followersCount}</span>
                                        </div>
                                        <Link to={`/user/${id}/followers`} className="text-[9px] font-bold text-kickr hover:text-white transition-colors uppercase tracking-widest">View All →</Link>
                                    </div>
                                    {followers?.content && followers.content.length > 0 ? (
                                        <div className="grid grid-cols-12 gap-3">
                                            {followers.content.slice(0, 24).map((f) => (
                                                <Link
                                                    key={f.id}
                                                    to={`/user/${f.id}`}
                                                    className="group relative"
                                                    title={f.name}
                                                >
                                                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#1b2228] to-[#2c3440] border border-white/10 flex items-center justify-center text-[8px] font-black text-kickr uppercase group-hover:border-kickr/50 group-hover:scale-110 transition-all shadow-lg overflow-hidden">
                                                        {f.avatarUrl ? (
                                                            <img src={f.avatarUrl} alt={f.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            f.name[0]
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[9px] text-[#445566] italic uppercase font-bold">No followers yet.</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Stats & Favorites */}
                    <div className="space-y-12">
                        <section className="bg-[#1b2228] border border-white/5 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Ratings Distribution</h3>
                            <RatingsChart reviews={pageData?.content || []} />

                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-[#445566] uppercase tracking-widest leading-none mb-1">Total Logs</span>
                                    <span className="text-xl font-black text-white italic">{pageData?.totalElements || 0}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-bold text-[#445566] uppercase tracking-widest leading-none mb-1">Average</span>
                                    <span className="text-xl font-black text-kickr italic">
                                        {pageData && pageData.content.length > 0
                                            ? (pageData.content.reduce((acc, r) => acc + r.note, 0) / pageData.content.length).toFixed(1)
                                            : '0.0'}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-[#1b2228] border border-white/5 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Most Watched Teams</h3>
                            <MostWatchedTeams reviews={pageData?.content || []} />
                        </section>

                        <section className="bg-[#1b2228] border border-white/5 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-[#99aabb]">Total Logs</span>
                                    <span className="text-sm font-black text-white">{pageData?.totalElements || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-[#99aabb]">Avg Rating</span>
                                    <span className="text-sm font-black text-kickr">
                                        {pageData && pageData.content.length > 0
                                            ? (pageData.content.reduce((acc, r) => acc + r.note, 0) / pageData.content.length).toFixed(1)
                                            : '0.0'} ★
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-[#99aabb]">Liked Matches</span>
                                    <span className="text-sm font-black text-orange-500">
                                        {pageData?.content.filter(r => r.isLiked).length || 0}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
};

const RatingsChart = ({ reviews }: { reviews: any[] }) => {
    const { id } = useParams<{ id: string }>();
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
        const note = Math.round(r.note);
        const index = Math.max(0, Math.min(note - 1, 4));
        counts[index]++;
    });

    const total = reviews.length || 1;
    const max = Math.max(...counts, 1);

    return (
        <div className="flex items-end justify-between h-32 gap-3 px-1">
            {counts.map((count, i) => {
                const heightPercentage = (count / max) * 100;
                const percentageOfTotal = Math.round((count / total) * 100);
                const rating = i + 1;

                return (
                    <Link
                        key={i}
                        to={`/user/${id}/matches?rating=${rating}`}
                        className="flex-1 h-full flex flex-col items-center group cursor-pointer"
                        title={`View ${rating}-star reviews`}
                    >
                        <div className="w-full flex-1 bg-white/[0.02] rounded-t-md relative flex items-end overflow-hidden border-x border-t border-white/[0.05] hover:border-kickr/30 transition-all">
                            <div
                                className="w-full bg-gradient-to-t from-kickr/40 to-kickr group-hover:brightness-125 transition-all duration-300 ease-out relative rounded-t-sm"
                                style={{ height: `${heightPercentage}%`, minHeight: count > 0 ? '2px' : '0' }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/20"></div>
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-center">
                                <span className="text-[11px] font-black text-white italic leading-none">{count}</span>
                                <span className="text-[8px] font-bold text-white/70 uppercase tracking-tighter">{percentageOfTotal}%</span>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-col items-center">
                            <span className="text-[10px] font-black text-[#445566] group-hover:text-kickr transition-colors">{rating}★</span>
                            <div className="w-1 h-1 rounded-full bg-white/5 mt-1 group-hover:bg-kickr transition-colors"></div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

const MostWatchedTeams = ({ reviews }: { reviews: UserMatch[] }) => {
    // Calculate team statistics from reviews (ID as key, storing name and count)
    const teamStats = reviews.reduce((acc, review) => {
        const home = { id: review.match.homeTeamId, name: review.match.homeTeam };
        const away = { id: review.match.awayTeamId, name: review.match.awayTeam };

        [home, away].forEach(team => {
            if (!acc[team.id]) {
                acc[team.id] = { name: team.name, count: 0 };
            }
            acc[team.id].count += 1;
        });

        return acc;
    }, {} as Record<string, { name: string, count: number }>);

    // Sort teams by count and get top 5
    const topTeams = Object.entries(teamStats)
        .map(([id, data]) => ({ id, name: data.name, count: data.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    if (topTeams.length === 0) {
        return (
            <p className="text-[9px] text-[#445566] italic uppercase font-bold">
                No teams watched yet.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {topTeams.map((team, index) => (
                <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform"
                >
                    <div className="flex items-center gap-3 flex-1">
                        <span className="text-[10px] font-black text-kickr/50 w-4">#{index + 1}</span>
                        <span className="text-[11px] font-bold text-[#99aabb] group-hover:text-white transition-colors truncate">
                            {team.name}
                        </span>
                    </div>
                    <span className="text-sm font-black text-white">{team.count}</span>
                </Link>
            ))}
        </div>
    );
};

const StatHorizontal = ({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 hover:opacity-70 transition-opacity cursor-pointer group"
    >
        <span className="text-lg sm:text-2xl font-black text-white group-hover:text-kickr transition-colors">{value}</span>
        <span className="text-[10px] font-bold text-[#667788] uppercase tracking-widest">{label}</span>
    </button>
);

const LoadingState = () => (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-kickr/20 border-t-kickr rounded-full animate-spin"></div>
    </div>
);

const NotFoundState = () => (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center text-center">
        <div>
            <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">User Not Found</h2>
            <p className="text-[#667788] mb-8">This tactician hasn't joined Kickr yet.</p>
            <Link to="/" className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded hover:bg-kickr/5 transition-all">Go Home</Link>
        </div>
    </div>
);
