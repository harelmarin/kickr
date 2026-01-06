import { useState, useRef, useEffect } from 'react';
import { LoginDropdown, RegisterDropdown } from '../auth/authForm.tsx';
import { UserMenu } from '../auth/UserMenu';
import { useAuth } from '../../hooks/useAuth';
import { Link, NavLink } from 'react-router-dom';

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<'login' | 'register' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (type: 'login' | 'register') => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#14181c] border-b border-white/5 sticky top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto flex items-center h-full px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group mr-10">
          <span className="text-2xl">⚽</span>
          <span className="text-xl font-black font-display tracking-tighter text-white">KICKR</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex flex-1 items-center gap-6">
          <NavSlot to="/matches" label="Matches" />
          <NavSlot to="/competitions" label="Leagues" />
          <NavSlot to="/teams" label="Teams" />
          <NavSlot to="/members" label="Members" />
        </nav>

        {/* Right Section: Search & Profile */}
        <div className="flex items-center gap-5">
          {/* Letterboxd-style Search: Minimalist, grows focus */}
          <div className="relative group">
            <div className="bg-[#2c3440] hover:bg-[#38424e] rounded-full flex items-center transition-all duration-300">
              <div className="pl-4 pr-2">
                <svg className="w-3.5 h-3.5 text-[#667788] group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 ring-0 text-[11px] font-bold uppercase tracking-widest text-white placeholder-[#667788] py-2 w-24 focus:w-48 transition-all duration-300"
              />
            </div>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-5">
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center gap-5 border-l border-white/10 pl-5" ref={containerRef}>
              <button
                className="text-[#99aabb] hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors"
                onClick={() => toggleDropdown('login')}
              >
                Sign In
              </button>
              <button
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                onClick={() => toggleDropdown('register')}
              >
                Sign Up
              </button>

              {/* Dropdowns */}
              {openDropdown && (
                <div className="absolute top-full right-6 mt-3 z-50 w-80 animate-fade-in shadow-2xl bg-[#1b2228] border border-white/10 rounded-lg overflow-hidden">
                  {openDropdown === 'login' && <LoginDropdown onSuccess={() => setOpenDropdown(null)} />}
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
