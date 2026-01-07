import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useUserMatchesByUser } from '../hooks/useUserMatch';
import { ReviewCard } from '../components/Review/ReviewCard';
import { useAuth } from '../hooks/useAuth';
import { useFollowStatus, useFollowAction, useFollowers, useFollowing } from '../hooks/useFollow';

export const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading: isUserLoading } = useUser(id);
    const { data: reviews, isLoading: isReviewsLoading } = useUserMatchesByUser(id || '');
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const { data: isFollowing } = useFollowStatus(currentUser?.id, id);
    const { data: followers } = useFollowers(id);
    const { data: following } = useFollowing(id);
    const followAction = useFollowAction();

    const isOwnProfile = currentUser?.id === id;

    const handleFollowToggle = () => {
        if (!currentUser) {
            navigate('/auth/login');
            return;
        }
        followAction.mutate({
            followerId: currentUser.id,
            followedId: id!,
            action: isFollowing ? 'unfollow' : 'follow'
        });
    };

    const [isHoveringFollow, setIsHoveringFollow] = useState(false);

    if (isUserLoading) return <LoadingState />;
    if (!user) return <NotFoundState />;

    return (
        <main className="min-h-screen bg-[#0a0b0d] pt-32 pb-20 pitch-pattern">
            <div className="max-w-6xl mx-auto px-6">

                {/* Profile Header */}
                <header className="flex flex-col md:flex-row items-start md:items-end gap-10 mb-20">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#1b2228] to-[#2c3440] border border-white/10 flex items-center justify-center text-4xl font-black text-kickr shadow-2xl relative z-10">
                            {user.name[0].toUpperCase()}
                        </div>
                        <div className="absolute inset-0 bg-kickr/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">{user.name}</h1>
                            {isOwnProfile && (
                                <span className="bg-kickr/10 text-kickr text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-kickr/20">
                                    You
                                </span>
                            )}
                        </div>
                        <p className="text-[#667788] text-sm font-medium tracking-tight mb-8">
                            Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </p>

                        <div className="flex gap-12">
                            <Stat
                                label="Matches"
                                value={user.matchesCount.toString()}
                                onClick={() => navigate(`/user/${id}/matches`)}
                            />
                            <Stat
                                label="Following"
                                value={following?.length.toString() || user.followingCount.toString()}
                                onClick={() => document.getElementById('network-section')?.scrollIntoView({ behavior: 'smooth' })}
                            />
                            <Stat
                                label="Fans"
                                value={followers?.length.toString() || user.followersCount.toString()}
                                onClick={() => document.getElementById('network-section')?.scrollIntoView({ behavior: 'smooth' })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {isOwnProfile ? (
                            <button className="bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest px-8 py-3 rounded-lg border border-white/10 transition-all">
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                onClick={handleFollowToggle}
                                onMouseEnter={() => setIsHoveringFollow(true)}
                                onMouseLeave={() => setIsHoveringFollow(false)}
                                disabled={followAction.isPending}
                                className={`${isFollowing
                                    ? 'bg-white/5 text-white border border-white/10 hover:border-red-500/50 hover:text-red-500'
                                    : 'bg-kickr text-black'
                                    } text-[11px] font-black uppercase tracking-widest px-10 py-3 rounded-lg hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50 min-w-[140px]`}
                            >
                                {followAction.isPending
                                    ? 'Updating...'
                                    : isFollowing
                                        ? (isHoveringFollow ? 'Unfollow' : 'Following')
                                        : 'Follow'}
                            </button>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    {/* Main Content: Activity */}
                    <div className="lg:col-span-2 space-y-24">
                        {/* Diary Section */}
                        <section id="diary-entries" className="space-y-12 section-contrast p-8 rounded-2xl">
                            <div className="flex items-center justify-between border-b border-kickr/20 pb-6">
                                <Link to={`/user/${id}/diary`} className="text-sm font-black text-white hover:text-kickr transition-colors uppercase tracking-[0.2em] glow-kickr">Recent Diary Entries →</Link>
                                <span className="text-[10px] font-bold text-kickr uppercase tracking-widest">{reviews?.length || 0} Total</span>
                            </div>

                            {isReviewsLoading ? (
                                <div className="space-y-12 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl"></div>)}
                                </div>
                            ) : reviews && reviews.length > 0 ? (
                                <div className="grid grid-cols-1 gap-12">
                                    {([...reviews]
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
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xs font-bold text-white uppercase tracking-widest">Following</h2>
                                        <span className="text-[9px] font-black px-2 py-0.5 bg-white/5 rounded text-[#445566]">{user.followingCount}</span>
                                    </div>
                                    <div className="space-y-4">
                                        {following && following.length > 0 ? following.map((f) => (
                                            <div key={f.id} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#1b2228] border border-white/5 flex items-center justify-center text-[10px] font-black text-kickr uppercase">
                                                        {f.name[0]}
                                                    </div>
                                                    <Link to={`/user/${f.id}`} className="text-[11px] font-bold text-[#99aabb] group-hover:text-white transition-colors uppercase">{f.name}</Link>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-[9px] text-[#445566] italic uppercase font-bold">Not following anyone yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Followers Column */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xs font-bold text-white uppercase tracking-widest">Followers</h2>
                                        <span className="text-[9px] font-black px-2 py-0.5 bg-white/5 rounded text-[#445566]">{followers?.length || 0}</span>
                                    </div>
                                    <div className="space-y-4">
                                        {followers && followers.length > 0 ? followers.map((f) => (
                                            <div key={f.id} className="flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#1b2228] border border-white/5 flex items-center justify-center text-[10px] font-black text-kickr uppercase">
                                                        {f.name[0]}
                                                    </div>
                                                    <Link to={`/user/${f.id}`} className="text-[11px] font-bold text-[#99aabb] group-hover:text-white transition-colors uppercase">{f.name}</Link>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-[9px] text-[#445566] italic uppercase font-bold">No followers yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Stats & Favorites */}
                    <div className="space-y-12 pitch-stripes">
                        <section className="bg-[#1b2228] border border-white/5 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Ratings Distribution</h3>
                            <RatingsChart reviews={reviews || []} />

                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-[#445566] uppercase tracking-widest leading-none mb-1">Total Ratings</span>
                                    <span className="text-xl font-black text-white italic">{reviews?.length || 0}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-bold text-[#445566] uppercase tracking-widest leading-none mb-1">Average</span>
                                    <span className="text-xl font-black text-kickr italic">
                                        {reviews && reviews.length > 0
                                            ? (reviews.reduce((acc, r) => acc + r.note, 0) / reviews.length).toFixed(1)
                                            : '0.0'}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-[#1b2228] border border-white/5 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Most Watched Teams</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center group cursor-pointer">
                                    <span className="text-[11px] font-bold text-[#99aabb] group-hover:text-white transition-colors">Real Madrid</span>
                                    <span className="text-[10px] font-black text-[#334455]">12</span>
                                </div>
                                <div className="flex justify-between items-center group cursor-pointer">
                                    <span className="text-[11px] font-bold text-[#99aabb] group-hover:text-white transition-colors">FC Barcelona</span>
                                    <span className="text-[10px] font-black text-[#334455]">8</span>
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

                return (
                    <div key={i} className="flex-1 h-full flex flex-col items-center group">
                        <div className="w-full flex-1 bg-white/[0.02] rounded-t-md relative flex items-end overflow-hidden border-x border-t border-white/[0.05]">
                            <div
                                className="w-full bg-gradient-to-t from-kickr/40 to-kickr group-hover:brightness-110 transition-all duration-700 ease-out relative rounded-t-sm"
                                style={{ height: `${heightPercentage}%`, minHeight: count > 0 ? '2px' : '0' }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-kickr shadow-[0_0_15px_rgba(68,102,255,0.8)]"></div>
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-center">
                                <span className="text-[11px] font-black text-white italic leading-none">{count}</span>
                                <span className="text-[7px] font-bold text-kickr uppercase tracking-tighter">{percentageOfTotal}%</span>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-col items-center">
                            <span className="text-[10px] font-black text-[#445566] group-hover:text-white transition-colors">{i + 1}</span>
                            <div className="w-1 h-1 rounded-full bg-white/5 mt-1 group-hover:bg-kickr transition-colors"></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const Stat = ({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-start hover:opacity-70 transition-opacity text-left cursor-pointer"
    >
        <span className="text-[9px] font-black text-[#445566] uppercase tracking-[0.25em] mb-1">{label}</span>
        <span className="text-3xl font-black text-white italic leading-none">{value}</span>
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
            <p className="text-[#667788] mb-8">This scout hasn't joined Kickr yet.</p>
            <Link to="/" className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded hover:bg-kickr/5 transition-all">Go Home</Link>
        </div>
    </div>
);
