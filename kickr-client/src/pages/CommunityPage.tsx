import { useUsers } from '../hooks/useUser';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const CommunityPage = () => {
    const { data: users, isLoading } = useUsers();
    const { user: currentUser } = useAuth();

    if (isLoading) return <LoadingState />;

    const totalMatches = users?.reduce((acc, u) => acc + (u.matchesCount || 0), 0) || 0;

    return (
        <main className="min-h-screen bg-[#0a0b0d] text-[#99aabb]">
            {/* Cinematic Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-kickr/5 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] mix-blend-screen opacity-20"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div className="max-w-2xl">
                                <span className="inline-block text-kickr text-[10px] font-black uppercase tracking-[0.4em] mb-4 py-1 px-3 bg-kickr/10 border border-kickr/20 rounded-full">
                                    Network Intelligence
                                </span>
                                <h1 className="display-font text-5xl md:text-7xl text-white uppercase italic tracking-tighter leading-none mb-6">
                                    The Global <span className="text-kickr">Tactician</span> Guild
                                </h1>
                                <p className="text-[#667788] text-sm md:text-base font-medium max-w-xl leading-relaxed">
                                    Connect with tactical minds across the globe. Analyzing performance,
                                    tracking the pitch, and building the ultimate football diary.
                                </p>
                            </div>

                            <div className="flex gap-8 border-l border-white/5 pl-8 h-fit">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black text-white italic tracking-tighter leading-none mb-2 tabular-nums">
                                        {users?.length || 0}
                                    </span>
                                    <span className="text-[9px] font-bold text-[#445566] uppercase tracking-widest">Active Minds</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black text-white italic tracking-tighter leading-none mb-2 tabular-nums">
                                        {totalMatches >= 1000 ? `${(totalMatches / 1000).toFixed(1)}k` : totalMatches}
                                    </span>
                                    <span className="text-[9px] font-bold text-[#445566] uppercase tracking-widest">Log Entries</span>
                                </div>
                            </div>
                        </div>

                        {/* Search/Filter Bar (Visual only for now) */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16"></div>
                    </div>
                </section>

                {/* Community Grid */}
                <section className="max-w-7xl mx-auto px-6 pb-32">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {users?.map((user) => (
                            <UserCard key={user.id} user={user} isMe={user.id === currentUser?.id} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

const UserCard = ({ user, isMe }: { user: any; isMe: boolean }) => {
    return (
        <Link
            to={`/user/${user.id}`}
            className="group relative bg-[#14181c]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-kickr/40 hover:bg-[#1b2228]/80 transition-all duration-500 shadow-2xl flex flex-col h-full"
        >
            {/* Glossy Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="p-8 relative z-10 flex flex-col h-full">
                {/* Me Badge */}
                {isMe && (
                    <div className="absolute top-4 right-4 animate-fade-in">
                        <span className="bg-kickr text-black text-[8px] font-black uppercase tracking-tight px-2 py-0.5 rounded-[3px] shadow-[0_0_15px_rgba(68,102,255,0.4)]">
                            You
                        </span>
                    </div>
                )}

                {/* Avatar Cluster */}
                <div className="relative mb-8 self-center">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1b2228] to-[#0a0b0d] border border-white/10 flex items-center justify-center text-4xl font-black text-white group-hover:text-kickr group-hover:scale-105 group-hover:border-kickr/30 transition-all duration-500 shadow-2xl relative z-10 overflow-hidden">
                        {user.name[0]}
                        {/* Subtle Glow inside avatar */}
                        <div className="absolute inset-0 bg-kickr/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    {/* Floating Glow behind avatar */}
                    <div className="absolute inset-x-[-10px] inset-y-[-10px] bg-kickr/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>

                {/* Profile Identity */}
                <div className="text-center mb-8 flex-1">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-kickr transition-colors duration-300 mb-1">
                        {user.name}
                    </h3>
                    <p className="text-[9px] text-[#445566] font-extrabold uppercase tracking-[0.2em]">
                        Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </p>
                </div>

                {/* Metrics Cluster */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 bg-black/10 -mx-8 px-8 mt-auto group-hover:bg-kickr/[0.03] transition-colors">
                    <div className="flex flex-col items-center py-4">
                        <span className="text-lg font-black text-white italic tracking-tighter leading-none mb-1">
                            {user.matchesCount || 0}
                        </span>
                        <span className="text-[8px] font-bold text-[#445566] uppercase tracking-[0.2em] leading-none">Reports</span>
                    </div>
                    <div className="flex flex-col items-center py-4 border-l border-white/5">
                        <span className="text-lg font-black text-white italic tracking-tighter leading-none mb-1">
                            {user.followersCount || 0}
                        </span>
                        <span className="text-[8px] font-bold text-[#445566] uppercase tracking-[0.2em] leading-none">Network</span>
                    </div>
                </div>
            </div>

            {/* Hover Indicator Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-kickr w-0 group-hover:w-full transition-all duration-500"></div>
        </Link>
    );
};

const LoadingState = () => (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
            <div className="relative">
                <div className="w-16 h-16 border-2 border-kickr/5 border-t-kickr rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-2 border-kickr/5 border-b-kickr rounded-full animate-spin-slow"></div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-kickr font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Establishing Connection</p>
                <div className="w-32 h-[1px] bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-kickr/40 translate-x-[-100%] animate-loading-bar"></div>
                </div>
            </div>
        </div>
    </div>
);
