import { type FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export const UserMenu: FC = () => {
    const { user, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="relative group">
            {/* Minimalist Profile Trigger - No bulky background */}
            <button className="flex items-center gap-3 py-1 transition-opacity hover:opacity-75">
                <div className="w-6 h-6 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center font-black text-[9px] text-[var(--color-primary)] uppercase">
                    {user.name.charAt(0)}
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{user.name}</span>
            </button>

            {/* Premium Dropdown */}
            <div className="absolute top-[calc(100%+0.75rem)] right-0 w-44 bg-[#1b2228] border border-white/10 rounded shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                <div className="px-4 py-3 border-b border-white/5 bg-black/10">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{user.name}</p>
                    <p className="text-[8px] text-[#5c6470] uppercase font-bold tracking-tight truncate mt-0.5">{user.email}</p>
                </div>

                <div className="py-1">
                    <MenuLink to={`/user/${user.id}`} label="Profile" />
                    <MenuLink to="/settings" label="Settings" />
                </div>

                <div className="border-t border-white/5 py-1">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#ff4b4b] hover:bg-white/5 transition-colors"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
};

const MenuLink = ({ to, label }: { to: string; label: string }) => (
    <Link
        to={to}
        className="block px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#99aabb] hover:text-white hover:bg-white/5 transition-colors"
    >
        {label}
    </Link>
);
