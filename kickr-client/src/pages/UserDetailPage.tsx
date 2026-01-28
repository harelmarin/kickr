import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useUserMatchesByUser } from '../hooks/useUserMatch';
import { ReviewPosterCard } from '../components/review/ReviewPosterCard';

import { useAuth } from '../hooks/useAuth';
import { useFollowStatus, useFollowAction, useFollowers, useFollowing } from '../hooks/useFollow';
import type { UserMatch } from '../types/userMatch';
import toast from 'react-hot-toast';

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
            toast.error('You need to be logged in to follow users', {
                duration: 2000,
                position: 'top-center',
            });
            setTimeout(() => {
                navigate('/register');
            }, 500);
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
        <main className="min-h-screen bg-kickr-bg-primary pt-20 pb-16">
            <div className="max-w-6xl mx-auto px-4 md:px-6">

                <header className="mb-6 md:mb-16">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 md:gap-8 mb-6 sm:mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-10 text-center md:text-left">
                            {isOwnProfile ? (
                                <Link
                                    to="/settings"
                                    className="relative group/avatar w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden shadow-2xl transition-transform hover:scale-105"
                                    title="Change Profile Picture"
                                >
                                    <div className="w-full h-full bg-kickr-bg-secondary border border-white/5 flex items-center justify-center text-xl md:text-3xl font-black text-kickr">
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
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-kickr-bg-primary/40">
                                        <span className="text-[8px] font-black text-main uppercase tracking-widest">Edit</span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-sm bg-kickr-bg-secondary border border-white/5 flex items-center justify-center text-xl md:text-3xl font-black text-kickr overflow-hidden shadow-2xl">
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
                                <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                                    <h1 className="text-xl md:text-4xl font-black text-main tracking-tight italic uppercase">{user.name}</h1>
                                    {isOwnProfile && (
                                        <span className="bg-kickr/10 text-kickr text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-kickr/20">
                                            SELF
                                        </span>
                                    )}
                                </div>
                                <p className="text-muted text-[8px] md:text-xs uppercase tracking-widest italic font-bold">
                                    DEPLOYED {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex justify-center gap-2 md:gap-3">
                            <Link
                                to={`/user/${id}/diary`}
                                className="bg-black/[0.03] border border-white/5 hover:border-kickr/40 text-secondary hover:text-main text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-sm transition-all flex items-center gap-2 justify-center italic"
                            >
                                DIARY
                            </Link>
                            {isOwnProfile ? (
                                <Link
                                    to="/settings"
                                    className="bg-kickr hover:brightness-110 text-black text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-sm transition-all flex items-center gap-2 w-full md:w-auto justify-center italic"
                                >
                                    CONFIG
                                </Link>
                            ) : (
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={followAction.isPending}
                                    className={`group flex items-center justify-center gap-3 px-6 py-2 rounded-sm transition-all w-full md:w-auto italic ${isFollowing
                                        ? 'bg-black/5 border border-white/10 hover:border-red-500/50'
                                        : 'bg-kickr hover:brightness-110 text-black'
                                        } disabled:opacity-50`}
                                >
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${isFollowing
                                        ? 'text-secondary group-hover:text-red-500'
                                        : 'text-black'
                                        }`}>
                                        {followAction.isPending ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center justify-between md:justify-start gap-2 md:gap-8 px-3 md:px-6 py-3 md:py-4 bg-white/[0.01] border border-white/5 rounded-sm overflow-x-auto no-scrollbar">
                        <StatHorizontal
                            label="Logs"
                            value={user.matchesCount.toString()}
                            onClick={() => navigate(`/user/${id}/diary`)}
                        />
                        <div className="w-[1px] h-6 md:h-8 bg-black/5" />
                        <StatHorizontal
                            label="Following"
                            value={user.followingCount.toString()}
                            onClick={() => navigate(`/user/${id}/following`)}
                        />
                        <div className="w-[1px] h-6 md:h-8 bg-black/5" />
                        <StatHorizontal
                            label="Followers"
                            value={user.followersCount.toString()}
                            onClick={() => navigate(`/user/${id}/followers`)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
                    {/* Main Content: Activity */}
                    <div className="lg:col-span-2 space-y-8 md:space-y-12">
                        {/* Diary Section */}
                        <section id="diary-entries" className="space-y-6 md:space-y-8 bg-black/[0.02] border border-white/5 p-4 md:p-6 rounded-sm">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3 md:pb-4">
                                <Link to={`/user/${id}/diary`} className="text-[10px] md:text-sm font-black text-main/90 hover:text-kickr transition-colors uppercase tracking-[0.2em] italic">Tactical Diary</Link>
                                <span className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-widest leading-none">DATABASE: {pageData?.totalElements || 0}</span>
                            </div>

                            {isReviewsLoading ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-black/5 rounded-sm"></div>)}
                                </div>
                            ) : pageData?.content && pageData.content.length > 0 ? (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 md:gap-4">
                                    {(pageData.content)
                                        .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
                                        .slice(0, 4)
                                        .map((review: any) => (
                                            <ReviewPosterCard key={review.id} review={review} />
                                        ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-sm">
                                    <p className="text-secondary text-[8px] font-bold uppercase tracking-widest">No match entries detected.</p>
                                </div>
                            )}
                        </section>

                        {/* Top Teams & Leagues Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <section className="bg-black/[0.02] border border-white/5 rounded-sm p-5 md:p-8">
                                <h3 className="text-[9px] md:text-[10px] font-black text-kickr uppercase tracking-[0.4em] mb-6 md:mb-8 border-b border-white/5 pb-4 md:pb-6 italic">Top Squads</h3>
                                <MostWatchedTeams reviews={pageData?.content || []} />
                            </section>

                            <section className="bg-black/[0.02] border border-white/5 rounded-sm p-5 md:p-8">
                                <h3 className="text-[9px] md:text-[10px] font-black text-kickr uppercase tracking-[0.4em] mb-6 md:mb-8 border-b border-white/5 pb-4 md:pb-6 italic">Top Leagues</h3>
                                <MostWatchedLeagues reviews={pageData?.content || []} />
                            </section>
                        </div>
                    </div>

                    {/* Sidebar: Stats & Favorites */}
                    <div className="space-y-6 md:space-y-8">
                        {/* Network Section (Followers/Following) */}
                        <section className="bg-black/[0.02] border border-white/5 rounded-sm p-5 md:p-8">
                            <div className="space-y-6 md:space-y-8 relative z-10">
                                {/* Following */}
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <h4 className="text-[8px] md:text-[10px] font-black text-secondary uppercase tracking-widest">Following</h4>
                                            <span className="text-[7px] md:text-[8px] font-black px-1.5 py-0.5 bg-kickr/10 rounded-sm text-kickr italic">{following?.totalElements ?? user.followingCount}</span>
                                        </div>
                                        <Link to={`/user/${id}/following`} className="text-[7px] md:text-[8px] font-black text-muted hover:text-kickr transition-colors uppercase tracking-widest cursor-pointer leading-none">All</Link>
                                    </div>
                                    {following?.content && following.content.length > 0 ? (
                                        <div className="grid grid-cols-8 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
                                            {following.content.slice(0, 16).map((f: any) => (
                                                <Link
                                                    key={f.id}
                                                    to={`/user/${f.id}`}
                                                    className="group relative cursor-pointer"
                                                    title={f.name}
                                                >
                                                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-sm bg-gradient-to-br from-[#1b2228] to-[#2c3440] border border-white/5 flex items-center justify-center text-[7px] md:text-[8px] font-black text-kickr uppercase group-hover:border-kickr/50 transition-all overflow-hidden">
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
                                        <p className="text-muted italic font-bold uppercase tracking-tighter">Silence.</p>
                                    )}
                                </div>

                                {/* Followers */}
                                <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <h4 className="text-[8px] md:text-[10px] font-black text-secondary uppercase tracking-widest">Followers</h4>
                                            <span className="text-[7px] md:text-[8px] font-black px-1.5 py-0.5 bg-kickr/10 rounded-sm text-kickr italic">{followers?.totalElements ?? user.followersCount}</span>
                                        </div>
                                        <Link to={`/user/${id}/followers`} className="text-[7px] md:text-[8px] font-black text-muted hover:text-kickr transition-colors uppercase tracking-widest cursor-pointer leading-none">All</Link>
                                    </div>
                                    {followers?.content && followers.content.length > 0 ? (
                                        <div className="grid grid-cols-8 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
                                            {followers.content.slice(0, 16).map((f: any) => (
                                                <Link
                                                    key={f.id}
                                                    to={`/user/${f.id}`}
                                                    className="group relative cursor-pointer"
                                                    title={f.name}
                                                >
                                                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-sm bg-gradient-to-br from-[#1b2228] to-[#2c3440] border border-white/5 flex items-center justify-center text-[7px] md:text-[8px] font-black text-kickr uppercase group-hover:border-kickr/50 transition-all overflow-hidden">
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
                                        <p className="text-muted italic font-bold uppercase tracking-tighter">Isolated.</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="bg-black/[0.02] border border-white/5 rounded-sm p-5 md:p-8">
                            <h3 className="text-[9px] md:text-[10px] font-black text-kickr uppercase tracking-[0.4em] mb-6 md:mb-8 border-b border-white/5 pb-4 md:pb-6 italic">Rating Spread</h3>
                            <RatingsChart reviews={pageData?.content || []} />

                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center tabular-nums">
                                <div className="flex flex-col">
                                    <span className="text-[6px] md:text-[7px] font-black text-muted uppercase tracking-widest leading-none mb-1 md:mb-2 italic">DEPLOYMENTS</span>
                                    <span className="text-base md:text-xl font-black text-main/90 italic">{pageData?.totalElements || 0}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[6px] md:text-[7px] font-black text-muted uppercase tracking-widest leading-none mb-1 md:mb-2 italic">INTEL AVG</span>
                                    <span className="text-base md:text-xl font-black text-kickr italic">
                                        {pageData && pageData.content.length > 0
                                            ? (pageData.content.reduce((acc: number, r: any) => acc + r.note, 0) / pageData.content.length).toFixed(1)
                                            : '0.0'}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-black/[0.02] border border-white/5 rounded-sm p-5 md:p-8">
                            <h3 className="text-[9px] md:text-[10px] font-black text-kickr uppercase tracking-[0.4em] mb-6 md:mb-8 border-b border-white/5 pb-4 md:pb-6 italic">Operational Data</h3>
                            <div className="space-y-4 md:space-y-6 tabular-nums">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2.5 md:pb-3">
                                    <span className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-widest">Total Logs</span>
                                    <span className="text-xs md:text-base font-black text-main/90 italic">{pageData?.totalElements || 0}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-2.5 md:pb-3">
                                    <span className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-widest">Avg Stars</span>
                                    <span className="text-xs md:text-base font-black text-kickr italic">
                                        {pageData && pageData.content.length > 0
                                            ? (pageData.content.reduce((acc: number, r: any) => acc + r.note, 0) / pageData.content.length).toFixed(1)
                                            : '0.0'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-widest">Marked Favorites</span>
                                    <span className="text-xs md:text-base font-black text-main/90 italic">
                                        {pageData?.content.filter((r: any) => r.isLiked).length || 0}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div >
                </div >
            </div >
        </main >
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
                        <div className="w-full flex-1 bg-black/[0.02] rounded-t-md relative flex items-end overflow-hidden border-x border-t border-black/[0.05] hover:border-kickr/30 transition-all">
                            <div
                                className="w-full bg-gradient-to-t from-kickr/40 to-kickr group-hover:brightness-125 transition-all duration-300 ease-out relative rounded-t-sm"
                                style={{ height: `${heightPercentage}%`, minHeight: count > 0 ? '2px' : '0' }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/20"></div>
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-center">
                                <span className="text-[11px] font-black text-main italic leading-none">{count}</span>
                                <span className="text-[8px] font-bold text-main/70 uppercase tracking-tighter">{percentageOfTotal}%</span>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-col items-center">
                            <span className="text-[10px] font-black text-secondary group-hover:text-kickr transition-colors">{rating}★</span>
                            <div className="w-1 h-1 rounded-full bg-black/5 mt-1 group-hover:bg-kickr transition-colors"></div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

const MostWatchedTeams = ({ reviews }: { reviews: UserMatch[] }) => {
    // Calculate team statistics from reviews (ID as key, storing name, logo and count)
    const teamStats = reviews.reduce((acc, review) => {
        const home = { id: review.match.homeTeamId, name: review.match.homeTeam, logo: review.match.homeLogo };
        const away = { id: review.match.awayTeamId, name: review.match.awayTeam, logo: review.match.awayLogo };

        [home, away].forEach(team => {
            if (!acc[team.id]) {
                acc[team.id] = { name: team.name, logo: team.logo, count: 0 };
            }
            acc[team.id].count += 1;
        });

        return acc;
    }, {} as Record<string, { name: string, logo: string, count: number }>);

    // Sort teams by count and get top 4
    const topTeams = Object.entries(teamStats)
        .map(([id, data]: [string, any]) => ({ id, name: data.name, logo: data.logo, count: data.count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 4);

    if (topTeams.length === 0) {
        return (
            <p className="text-[10px] text-muted italic font-bold">
                No teams watched yet.
            </p>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {topTeams.map((team, index) => (
                <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    className="group relative block cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-1.5 md:mb-2">
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-[7px] md:text-[9px] font-mono text-main/10 uppercase leading-none">{index + 1}</span>
                            {team.logo && (
                                <img src={team.logo} alt="" className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain" />
                            )}
                            <span className="text-[9px] md:text-[10px] font-black text-main uppercase italic tracking-widest truncate max-w-[120px] md:max-w-none">{team.name}</span>
                        </div>
                        <span className="text-[9px] md:text-[10px] font-mono text-kickr italic tabular-nums">{team.count}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-black/[0.02]">
                        <span className="text-[6px] md:text-[7px] font-black text-muted uppercase tracking-widest italic">DEPLOYED</span>
                        <span className="text-[6px] md:text-[7px] font-black text-muted uppercase tracking-widest italic">{team.count} MATCHES</span>
                    </div>
                </Link>
            ))}
        </div>
    );
};

const MostWatchedLeagues = ({ reviews }: { reviews: UserMatch[] }) => {
    // Calculate league statistics from reviews
    const leagueStats = reviews.reduce((acc, review) => {
        const competition = review.match.competition;
        const logo = review.match.competitionLogo;
        const id = review.match.competitionId;

        if (!acc[competition]) {
            acc[competition] = { logo, id, count: 0, totalNote: 0 };
        }
        acc[competition].count += 1;
        acc[competition].totalNote += review.note;

        return acc;
    }, {} as Record<string, { logo?: string, id?: string, count: number, totalNote: number }>);

    // Sort leagues by count and get top 4
    const topLeagues = Object.entries(leagueStats)
        .map(([name, data]) => ({
            name,
            logo: data.logo,
            id: data.id,
            count: data.count,
            rating: data.totalNote / data.count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

    if (topLeagues.length === 0) {
        return (
            <p className="text-[10px] text-muted italic font-bold">
                No leagues watched yet.
            </p>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {topLeagues.map((league, index) => (
                <Link
                    key={league.name}
                    to={league.id ? `/competitions/${league.id}` : `/matches?competition=${encodeURIComponent(league.name)}`}
                    className="group relative block cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-1.5 md:mb-2">
                        <div className="flex items-center gap-2 md:gap-3">
                            <span className="text-[7px] md:text-[9px] font-mono text-main/10 uppercase leading-none">{index + 1}</span>
                            {league.logo && (
                                <img src={league.logo} alt="" className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain" />
                            )}
                            <span className="text-[9px] md:text-[10px] font-black text-main uppercase italic tracking-widest truncate max-w-[120px] md:max-w-none">{league.name}</span>
                        </div>
                        <span className="text-[9px] md:text-[10px] font-mono text-kickr italic tabular-nums">{league.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-black/[0.02]">
                        <span className="text-[6px] md:text-[7px] font-black text-muted uppercase tracking-widest italic">LEAGUE</span>
                        <span className="text-[6px] md:text-[7px] font-black text-muted uppercase tracking-widest italic">{league.count} RECS</span>
                    </div>
                </Link>
            ))}
        </div>
    );
};

const StatHorizontal = ({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer group"
    >
        <span className="text-xl md:text-2xl font-black text-main/90 group-hover:text-kickr transition-colors italic tabular-nums leading-none">{value}</span>
        <span className="text-[7px] md:text-[10px] font-bold text-muted uppercase tracking-[0.2em] italic">{label}</span>
    </button>
);

const LoadingState = () => (
    <div className="min-h-screen bg-kickr-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-kickr/20 border-t-kickr rounded-full animate-spin"></div>
    </div>
);

const NotFoundState = () => (
    <div className="min-h-screen bg-kickr-bg-primary flex items-center justify-center text-center">
        <div>
            <h2 className="text-4xl font-black text-main/90 mb-4 italic tracking-tighter uppercase">User Not Found</h2>
            <p className="text-muted mb-8">This member hasn't joined Kickr yet.</p>
            <Link to="/" className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded-sm hover:bg-kickr/5 transition-all">Go Home</Link>
        </div>
    </div>
);
