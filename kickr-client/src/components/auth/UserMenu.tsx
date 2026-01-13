import { type FC, useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

export const UserMenu: FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside, true);
        return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }, []);

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Minimalist Profile Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 sm:gap-3 py-1 transition-opacity hover:opacity-75 cursor-pointer"
            >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-kickr uppercase overflow-hidden shadow-sm">
                    {user.avatarUrl ? (
                        <img key={user.avatarUrl} src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{user.name.charAt(0)}</span>
                    )}
                </div>
                <span className="hidden sm:block text-[10px] font-black text-white uppercase tracking-[0.2em]">{user.name}</span>
                <span className={`text-[8px] text-[#5c6470] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Premium Dropdown */}
            <div className={`absolute top-[calc(100%+0.75rem)] right-0 sm:left-0 w-44 bg-[#1b2228] border border-white/10 rounded shadow-2xl transition-all duration-200 z-[100] ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}>
                <div className="px-4 py-3 border-b border-white/5 bg-black/10">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{user.name}</p>
                    <p className="text-[8px] text-[#5c6470] uppercase font-bold tracking-tight truncate mt-0.5">{user.email}</p>
                </div>

                <div className="py-1">
                    <MenuLink to={`/user/${user.id}`} label="Profile" />
                    {user.role === 'ADMIN' && (
                        <MenuLink to="/admin" label="Admin Panel" />
                    )}
                </div>

                <div className="border-t border-white/5 py-1">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#ff4b4b] hover:bg-white/5 transition-colors cursor-pointer"
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
        className="block px-4 py-3 sm:py-2 text-[10px] sm:text-[9px] font-black uppercase tracking-widest text-[#99aabb] hover:text-white hover:bg-white/5 transition-colors"
    >
        {label}
    </Link>
);
