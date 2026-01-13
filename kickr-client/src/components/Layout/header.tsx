import { LoginDropdown } from '../auth/authForm.tsx';
import { UserMenu } from '../auth/UserMenu';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../hooks/useUIStore';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SearchBar } from '../search/SearchBar';
import { NotificationBell } from './notificationBell';
import { useEffect, useRef } from 'react';

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const { authModalMode, openAuthModal, closeAuthModal } = useUIStore();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close modal on route change
  useEffect(() => {
    closeAuthModal();
  }, [location.pathname, closeAuthModal]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authModalMode === 'login' && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeAuthModal();
      }
    };

    if (authModalMode === 'login') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [authModalMode, closeAuthModal]);

  return (
    <header className="bg-[#14181c] border-b border-white/5 sticky top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto flex items-center h-full px-6">
        <Link to="/" className="flex items-center group mr-2 md:mr-10 transition-transform hover:scale-[1.02] active:scale-95">
          <span className="text-2xl font-black italic tracking-tighter uppercase leading-none bg-gradient-to-r from-white via-white to-white group-hover:from-kickr group-hover:to-kickr/50 bg-clip-text text-transparent transition-all duration-500 pr-2">
            KICKR
          </span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center gap-6">
          <NavSlot to="/matches" label="Matches" />
          <NavSlot to="/feed" label="Feed" />
          <NavSlot to="/competitions" label="Leagues" />
          <NavSlot to="/teams" label="Teams" />
          <NavSlot to="/community" label="Community" />
        </nav>

        <div className="flex items-center gap-2 md:gap-5">
          <SearchBar />

          {isAuthenticated ? (
            <div className="flex items-center gap-6 border-l border-white/10 pl-5">
              <NotificationBell />
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center gap-5 border-l border-white/10 pl-5 relative" ref={dropdownRef}>
              <button
                className="text-[#99aabb] hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors"
                onClick={() => openAuthModal(authModalMode === 'login' ? undefined : 'login')}
              >
                Sign In
              </button>
              <Link
                to="/register"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 sm:px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
              >
                Sign Up
              </Link>

              {authModalMode === 'login' && (
                <div className="absolute top-full right-0 mt-3 z-50 w-80 animate-fade-in shadow-2xl bg-[#1b2228] border border-white/10 rounded-xl overflow-hidden">
                  <LoginDropdown onSuccess={() => closeAuthModal()} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const NavSlot = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `uppercase tracking-[0.25em] text-[10px] font-bold transition-colors ${isActive ? 'text-white' : 'text-[#667788] hover:text-[#99aabb]'
      }`
    }
  >
    {label}
  </NavLink>
);
