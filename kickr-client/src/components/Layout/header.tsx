import { useState, useRef, useEffect } from 'react';
import { LoginDropdown, RegisterDropdown } from '../auth/authForm.tsx';
import { UserMenu } from '../auth/UserMenu';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<'login' | 'register' | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (type: 'login' | 'register') => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-secondary/95 backdrop-blur-md border-b border-primary sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-green-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-2xl">⚽</span>
          </div>
          <span className="text-3xl font-display text-primary group-hover:text-green-bright transition-colors">
            KICKR
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-8 items-center">
            <Link
              to="/competitions"
              className="text-secondary hover:text-green-bright font-semibold transition-colors text-sm relative group"
            >
              Competitions
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-bright group-hover:w-full transition-all"></span>
            </Link>
            <Link
              to="/teams"
              className="text-secondary hover:text-green-bright font-semibold transition-colors text-sm relative group"
            >
              Teams
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-bright group-hover:w-full transition-all"></span>
            </Link>
            <Link
              to="/matches"
              className="text-secondary hover:text-green-bright font-semibold transition-colors text-sm relative group"
            >
              Matches
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-bright group-hover:w-full transition-all"></span>
            </Link>
            <Link
              to="/members"
              className="text-secondary hover:text-green-bright font-semibold transition-colors text-sm relative group"
            >
              Members
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-bright group-hover:w-full transition-all"></span>
            </Link>
          </nav>

          {/* Auth Buttons or User Menu */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-3" ref={containerRef}>
              <button
                className="text-secondary hover:text-green-bright font-semibold transition-colors text-sm hidden md:block"
                onClick={() => toggleDropdown('login')}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary text-sm px-6 py-2"
                onClick={() => toggleDropdown('register')}
              >
                Join Free
              </button>

              {/* Dropdown */}
              {openDropdown && (
                <div className="absolute top-full right-0 mt-3 z-20 w-72 animate-scale-in">
                  {openDropdown === 'login' && (
                    <LoginDropdown
                      onSuccess={() => setOpenDropdown(null)}
                    />
                  )}
                  {openDropdown === 'register' && (
                    <RegisterDropdown
                      onSuccess={() => setOpenDropdown(null)}
                      onSwitchToLogin={() => setOpenDropdown('login')}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
