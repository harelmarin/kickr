import { useState, useRef, useEffect } from 'react';
import { LoginDropdown, RegisterDropdown } from '../auth/authForm.tsx';
import { Link } from 'react-router-dom';

export const Header = () => {
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
    <header className="bg-primary text-white shadow-sm border-b border-gray-700 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-3xl md:text-4xl font-bold header-title cursor-pointer"
        >
          Kickr
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex gap-4 items-center">
            <h2 className="hover-secondary cursor-pointer transition-colors">
              Teams
            </h2>
            <h2 className="hover-secondary cursor-pointer transition-colors">
              Matches
            </h2>
            <h2 className="hover-secondary cursor-pointer transition-colors">
              Members
            </h2>
          </nav>

          <div className="w-px h-8 bg-gray-700 mx-2 md:mx-2"></div>

          <div className="relative flex gap-4 items-center" ref={containerRef}>
            <button
              className="hover-secondary cursor-pointer bold transition-colors"
              onClick={() => toggleDropdown('login')}
            >
              Login
            </button>
            <button
              className="px-4 py-1 rounded-md text-white header-title transition bg-secondary hover:opacity-90 cursor-pointer text-lg"
              onClick={() => toggleDropdown('register')}
            >
              Register
            </button>

            {openDropdown && (
              <div className="absolute top-full left-0 mt-1 z-20 w-48 sm:w-56 md:w-48 -translate-x-12">
                {openDropdown === 'login' && <LoginDropdown />}
                {openDropdown === 'register' && <RegisterDropdown />}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
