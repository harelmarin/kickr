import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useFollowers, useFollowing } from '../hooks/useFollow';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

interface UserNetworkPageProps {
    type: 'followers' | 'following';
}

export const UserNetworkPage: React.FC<UserNetworkPageProps> = ({ type }) => {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    const { data: profileUser, isLoading: isUserLoading } = useUser(id);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 12; // 3 columns * 4 rows

    const { data: pageData, isLoading: isNetworkLoading } =
        type === 'followers'
            ? useFollowers(id, currentPage, pageSize)
            : useFollowing(id, currentPage, pageSize);

    const networkUsers = pageData?.content || [];

    if (isUserLoading || isNetworkLoading) return <LoadingState />;
    if (!profileUser) return <NotFoundState />;

    return (
        <main className="min-h-screen bg-kickr-bg-primary pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Context */}
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[2px] w-6 bg-kickr" />
                        <span className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] italic">Network</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-kickr-bg-secondary border border-white/5 p-4 md:p-10 rounded-sm poster-shadow">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-main italic tracking-tighter uppercase mb-2">
                                {type === 'followers' ? 'Followers' : 'Following'}
                            </h1>
                            <p className="text-secondary uppercase tracking-[0.25em] text-[10px] font-black italic">
                                Connections for <span className="text-kickr">{profileUser.name}</span>
                            </p>
                        </div>

                        <nav className="flex items-center gap-2 bg-black/[0.1] p-1.5 rounded-sm border border-white/5">
                            <Link
                                to={`/user/${id}/following`}
                                className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all italic ${type === 'following' ? 'bg-kickr text-white shadow-[0_0_15px_rgba(93,139,255,0.3)]' : 'text-secondary hover:text-main'}`}
                            >
                                Following [{profileUser.followingCount}]
                            </Link>
                            <Link
                                to={`/user/${id}/followers`}
                                className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all italic ${type === 'followers' ? 'bg-kickr text-white shadow-[0_0_15px_rgba(93,139,255,0.3)]' : 'text-secondary hover:text-main'}`}
                            >
                                Followers [{profileUser.followersCount}]
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* Users Grid */}
                <div>
                    {networkUsers && networkUsers.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {networkUsers.map((user: any, index: number) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <UserCard user={user} isMe={user.id === currentUser?.id} />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {!isNetworkLoading && pageData && pageData.totalPages > 1 && (
                                <div className="mt-16 flex items-center justify-center gap-2 md:gap-8 border-t border-white/[0.03] pt-12">
                                    <button
                                        onClick={() => {
                                            setCurrentPage(prev => Math.max(0, prev - 1));
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        disabled={pageData.first}
                                        className="group flex items-center gap-2 px-6 py-2.5 bg-kickr-bg-secondary border border-white/5 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-secondary hover:text-kickr hover:border-kickr/40 disabled:opacity-5 transition-all italic active:scale-95"
                                    >
                                        <span className="text-sm group-hover:-translate-x-1 transition-transform leading-none mb-0.5">←</span>
                                        PREV
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] md:text-[11px] font-black text-muted uppercase tracking-widest italic tabular-nums font-mono">
                                            Page <span className="text-main">{currentPage + 1}</span> / {pageData.totalPages}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setCurrentPage(prev => Math.min(pageData.totalPages - 1, prev + 1));
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        disabled={pageData.last}
                                        className="group flex items-center gap-2 px-6 py-2.5 bg-kickr text-white rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 disabled:opacity-5 transition-all italic shadow-[0_0_20px_rgba(93,139,255,0.2)] active:scale-95"
                                    >
                                        NEXT
                                        <span className="text-sm group-hover:translate-x-1 transition-transform leading-none mb-0.5">→</span>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-20 text-center bg-black/[0.1] border border-dashed border-white/5 rounded-sm">
                            <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">
                                {type === 'followers' ? "No followers yet." : "Not following anyone yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

const UserCard = ({ user, isMe }: { user: any; isMe: boolean }) => {
    return (
        <Link
            to={`/user/${user.id}`}
            className="group relative bg-kickr-bg-secondary border border-white/5 rounded-sm overflow-hidden hover:border-kickr/40 transition-all flex flex-col poster-shadow"
        >
            <div className="p-6 flex flex-col">
                {isMe && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-kickr text-white text-[7px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded-sm shadow-sm italic">
                            You
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-sm bg-black/10 border border-white/5 flex items-center justify-center text-lg font-black text-main group-hover:text-kickr group-hover:border-kickr/20 transition-all overflow-hidden flex-shrink-0">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                            user.name[0].toUpperCase()
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-black text-main uppercase italic tracking-tighter group-hover:text-kickr transition-colors truncate">
                            {user.name}
                        </h3>
                        <p className="text-[8px] text-muted font-bold uppercase tracking-widest mt-1 italic">
                            Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-around pt-4 border-t border-white/[0.03] gap-2">
                    <div className="flex flex-col items-center">
                        <span className="text-base font-black text-main italic tracking-tighter leading-none tabular-nums">
                            {user.matchesCount || 0}
                        </span>
                        <span className="text-[7px] font-black text-muted uppercase tracking-[0.2em] leading-none mt-1 italic">Logs</span>
                    </div>
                    <div className="w-px h-6 bg-black/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-base font-black text-main italic tracking-tighter leading-none tabular-nums">
                            {user.followersCount || 0}
                        </span>
                        <span className="text-[7px] font-black text-muted uppercase tracking-[0.2em] leading-none mt-1 italic">Followers</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const LoadingState = () => (
    <div className="min-h-screen bg-kickr-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-kickr/20 border-t-kickr rounded-full animate-spin"></div>
            <p className="text-kickr font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Scanning Network</p>
        </div>
    </div>
);

const NotFoundState = () => (
    <div className="min-h-screen bg-kickr-bg-primary flex items-center justify-center text-center">
        <div>
            <h2 className="text-4xl font-black text-main mb-8 italic tracking-tighter uppercase">Signal Lost</h2>
            <Link to="/" className="text-white bg-kickr font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-sm hover:brightness-110 transition-all italic shadow-[0_0_20px_rgba(93,139,255,0.2)]">Restore Feed</Link>
        </div>
    </div>
);
