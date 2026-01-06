import { type FC } from 'react';
import { useAuth } from '../../hooks/useAuth';

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
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
            </button>

            <div className="absolute top-full right-0 mt-2 w-48 bg-primary border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-700">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition text-red-400 hover:text-red-300"
                >
                    Log out
                </button>
            </div>
        </div>
    );
};
