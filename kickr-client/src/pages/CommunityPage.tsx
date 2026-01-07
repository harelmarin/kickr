import { useUsers } from '../hooks/useUser';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const CommunityPage = () => {
    const { data: users, isLoading } = useUsers();
    const { user: currentUser } = useAuth();

    if (isLoading) return <LoadingState />;

    return (
        <main className="min-h-screen bg-[#0a0b0d] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <header className="mb-16">
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4">
                        The Global <span className="text-kickr">Tactician</span> Network
                    </h1>
                    <p className="text-[#64748b] text-[11px] font-bold uppercase tracking-[0.3em]">
                        Discover {users?.length || 0} tactical minds currently tracking the pitch
                    </p>
                </header>

                {/* Users Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {users?.map((user) => (
                        <UserCard key={user.id} user={user} isMe={user.id === currentUser?.id} />
                    ))}
                </div>
            </div>
        </main>
    );
};

const UserCard = ({ user, isMe }: { user: any; isMe: boolean }) => {
    return (
        <Link
            to={`/user/${user.id}`}
            className="group bg-[#1b2228]/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-kickr/40 hover:bg-[#1b2228]/80 transition-all duration-500 relative flex flex-col items-center text-center shadow-2xl"
        >
            {/* Me Badge */}
            {isMe && (
                <span className="absolute top-4 right-4 bg-kickr/10 text-kickr text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border border-kickr/20">
                    Me
                </span>
            )}

            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-kickr/20 to-kickr/5 border border-white/10 flex items-center justify-center text-3xl font-black text-kickr uppercase mb-6 group-hover:scale-110 group-hover:border-kickr/50 transition-all duration-500 shadow-xl shadow-kickr/5">
                {user.name[0]}
            </div>

            {/* Info */}
            <h3 className="text-xl font-black text-white italic group-hover:text-kickr transition-colors tracking-tight mb-2">
                {user.name}
            </h3>

            <p className="text-[10px] text-[#445566] font-bold uppercase tracking-[0.2em] mb-8">
                Tactician since {new Date(user.createdAt).getFullYear()}
            </p>

            {/* Stats Cluster */}
            <div className="flex items-center gap-8 w-full justify-center pt-6 border-t border-white/5">
                <div className="flex flex-col">
                    <span className="text-lg font-black text-white leading-none mb-1">{user.matchesCount}</span>
                    <span className="text-[8px] font-bold text-[#445566] uppercase tracking-widest leading-none">Matchs</span>
                </div>
                <div className="w-px h-6 bg-white/5"></div>
                <div className="flex flex-col">
                    <span className="text-lg font-black text-white leading-none mb-1">{user.followersCount || 0}</span>
                    <span className="text-[8px] font-bold text-[#445566] uppercase tracking-widest leading-none">Fans</span>
                </div>
            </div>

            {/* Action CTA Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                <span className="text-[10px] font-black text-kickr uppercase tracking-[0.3em]">View Full Report →</span>
            </div>
        </Link>
    );
};

const LoadingState = () => (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-kickr/20 border-t-kickr rounded-full animate-spin"></div>
            <p className="text-kickr font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Network...</p>
        </div>
    </div>
);
