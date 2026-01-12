import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useFollowers, useFollowing } from '../hooks/useFollow';
import { motion } from 'framer-motion';

interface UserNetworkPageProps {
    type: 'followers' | 'following';
}

export const UserNetworkPage: React.FC<UserNetworkPageProps> = ({ type }) => {
    const { id } = useParams<{ id: string }>();
    const { data: profileUser, isLoading: isUserLoading } = useUser(id);
    const [currentPage, setCurrentPage] = useState(0);
    const { data: pageData, isLoading: isNetworkLoading } =
        type === 'followers' ? useFollowers(id, currentPage, 20) : useFollowing(id, currentPage, 20);

    const networkUsers = pageData?.content || [];


    if (isUserLoading || isNetworkLoading) return <LoadingState />;
    if (!profileUser) return <NotFoundState />;

    return (
        <main className="min-h-screen bg-[#0a0b0d] pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header Context */}
                <div className="flex items-start gap-6 mb-16 border-b border-white/5 pb-10">
                    <Link to={`/user/${profileUser.id}`} className="group relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-kickr/20 to-kickr/5 border border-kickr/20 flex items-center justify-center text-2xl font-black text-kickr overflow-hidden transition-transform group-hover:scale-105">
                            {profileUser.avatarUrl ? (
                                <img src={profileUser.avatarUrl} alt={profileUser.name} className="w-full h-full object-cover" />
                            ) : (
                                profileUser.name[0].toUpperCase()
                            )}
                        </div>
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase italic display-font mb-1">
                            {type === 'followers' ? 'Followers of' : 'Following by'} <span className="text-kickr break-all">{profileUser.name}</span>
                        </h1>
                        <nav className="flex items-center gap-4 mt-2">
                            <Link
                                to={`/user/${id}/following`}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${type === 'following' ? 'text-kickr' : 'text-[#445566] hover:text-white'}`}
                            >
                                Following ({profileUser.followingCount})
                            </Link>
                            <span className="text-white/10 text-[8px]">●</span>
                            <Link
                                to={`/user/${id}/followers`}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${type === 'followers' ? 'text-kickr' : 'text-[#445566] hover:text-white'}`}
                            >
                                Followers ({profileUser.followersCount})
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                    {networkUsers && networkUsers.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {networkUsers.map((user, index) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        to={`/user/${user.id}`}
                                        className="flex items-center justify-between p-4 bg-[#1b2228]/40 border border-white/5 rounded-xl hover:bg-[#1b2228] hover:border-kickr/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kickr/20 to-kickr/5 border border-white/10 flex items-center justify-center text-sm font-black text-kickr uppercase group-hover:scale-105 transition-transform overflow-hidden">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    user.name[0]
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-black italic tracking-tight group-hover:text-kickr transition-colors">
                                                    {user.name}
                                                </h3>
                                                <p className="text-[9px] text-[#445566] font-bold uppercase tracking-widest mt-0.5">
                                                    Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 pr-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-black text-white italic leading-none">{user.matchesCount}</span>
                                                <span className="text-[8px] font-bold text-[#445566] uppercase tracking-[0.2em] mt-1">Logs</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-black text-white italic leading-none">{user.followersCount}</span>
                                                <span className="text-[8px] font-bold text-[#445566] uppercase tracking-[0.2em] mt-1">Fans</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-black text-white italic leading-none">{user.followingCount}</span>
                                                <span className="text-[8px] font-bold text-[#445566] uppercase tracking-[0.2em] mt-1">Following</span>
                                            </div>
                                            <div className="ml-4 text-kickr opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                                                →
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                            <p className="text-[#445566] text-sm font-bold uppercase tracking-widest italic">
                                {type === 'followers' ? "No followers yet." : "Not following anyone yet."}
                            </p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {!isNetworkLoading && pageData && pageData.totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-4">
                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.max(0, prev - 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={pageData.first}
                                className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#667788] hover:text-white hover:border-kickr/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(pageData.totalPages)].map((_, i) => {
                                    if (pageData.totalPages > 5) {
                                        if (i < currentPage - 2 && i !== 0) return null;
                                        if (i > currentPage + 2 && i !== pageData.totalPages - 1) return null;
                                        if (i === currentPage - 2 && i !== 0) return <span key={i} className="text-[#334455]">...</span>;
                                        if (i === currentPage + 2 && i !== pageData.totalPages - 1) return <span key={i} className="text-[#334455]">...</span>;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setCurrentPage(i);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all cursor-pointer ${currentPage === i
                                                ? 'bg-kickr text-black'
                                                : 'bg-white/[0.02] border border-white/5 text-[#445566] hover:text-white hover:border-white/10'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.min(pageData.totalPages - 1, prev + 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={pageData.last}
                                className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#667788] hover:text-white hover:border-kickr/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

const LoadingState = () => (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-kickr/20 border-t-kickr rounded-full animate-spin"></div>
            <p className="text-kickr font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Scanning Network</p>
        </div>
    </div>
);

const NotFoundState = () => (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center text-center">
        <div>
            <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">User Not Found</h2>
            <Link to="/" className="text-kickr font-black uppercase tracking-widest text-xs border border-kickr/20 px-8 py-3 rounded hover:bg-kickr/5 transition-all">Go Home</Link>
        </div>
    </div>
);
