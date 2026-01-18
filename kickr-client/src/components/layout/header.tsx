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
    <header className="bg-kickr-bg-primary/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 h-[calc(3.5rem+env(safe-area-inset-top))] md:h-16 transition-all pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto flex items-center h-full px-4 md:px-6 justify-between md:justify-start">
        <Link to="/" className="flex items-center gap-2 mr-0 md:mr-10 flex-shrink-0">
          <div className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center">
            <img src="/favicon.png" alt="Kickr Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs md:text-lg font-black italic tracking-tighter uppercase leading-none text-main/90">
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
            <div className="flex items-center gap-1.5 md:gap-4 border-l border-white/5 pl-3 md:pl-5 relative" ref={dropdownRef}>
              <button
                className="text-main/50 hover:text-main/80 font-black uppercase tracking-[0.2em] text-[11px] transition-colors"
                onClick={() => openAuthModal(authModalMode === 'login' ? undefined : 'login')}
              >
                Sign In
              </button>
              <Link
                to="/register"
                className="bg-kickr hover:brightness-110 text-black px-3 py-1 md:py-1.5 rounded-sm text-[11px] font-black uppercase tracking-[0.1em] transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-kickr/20 italic"
              >
                Sign Up
              </Link>

              {authModalMode === 'login' && (
                <>
                  {/* Mobile Mobile Overlay */}
                  <div
                    className="fixed inset-x-0 top-[56px] h-[calc(100vh-56px)] bg-black/20 backdrop-blur-sm sm:hidden z-50"
                    onClick={() => closeAuthModal()}
                  >
                    <div
                      className="absolute top-0 right-0 w-full animate-fade-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <LoginDropdown onSuccess={() => closeAuthModal()} />
                    </div>
                  </div>

                  {/* Desktop Dropdown */}
                  <div
                    className="hidden sm:block absolute top-full right-0 mt-4 w-[350px] animate-fade-in z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LoginDropdown onSuccess={() => closeAuthModal()} />
                  </div>
                </>
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
      `uppercase tracking-[0.25em] text-[12px] font-bold transition-colors ${isActive ? 'text-main' : 'text-main/60 hover:text-main/80'
      }`
    }
  >
    {label}
  </NavLink>
);
