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
    <header className="bg-[#14181c] border-b border-white/5 sticky top-0 z-50 h-[52px] md:h-16 transition-all">
      <div className="max-w-7xl mx-auto flex items-center h-full px-4 md:px-6 justify-between md:justify-start">
        <Link to="/" className="flex items-center gap-2 md:gap-3 mr-0 md:mr-10 flex-shrink-0">
          <div className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center">
            <img src="/favicon.png" alt="Kickr Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm md:text-lg font-black italic tracking-tighter uppercase leading-none text-white/90">
            KICKR
          </span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center gap-6">
          <NavSlot to="/matches" label="Matches" />
          <NavSlot to="/competitions" label="Leagues" />
          <NavSlot to="/teams" label="Teams" />
          <NavSlot to="/community" label="Community" />
        </nav>

        <div className="flex items-center gap-2 md:gap-5 flex-shrink-0 ml-auto">
          <SearchBar />

          {isAuthenticated ? (
            <div className="flex items-center gap-3 md:gap-6 border-l border-white/5 pl-3 md:pl-5">
              <div className="hidden md:block">
                <NavSlot to="/feed" label="Feed" />
              </div>
              <NotificationBell />
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-5 border-l border-white/5 pl-3 md:pl-5 relative" ref={dropdownRef}>
              <button
                className="text-white/40 hover:text-white/80 font-bold uppercase tracking-widest text-[9px] md:text-[10px] transition-colors"
                onClick={() => openAuthModal(authModalMode === 'login' ? undefined : 'login')}
              >
                Sign In
              </button>
              <Link
                to="/register"
                className="bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
              >
                Sign Up
              </Link>

              {authModalMode === 'login' && (
                <div className="absolute top-full right-0 mt-3 z-50 w-[280px] animate-fade-in shadow-2xl bg-[#1b2228] border border-white/10 rounded-xl overflow-hidden">
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
      `uppercase tracking-[0.25em] text-[10px] font-bold transition-colors ${isActive ? 'text-white' : 'text-white/40 hover:text-white/60'
      }`
    }
  >
    {label}
  </NavLink>
);
