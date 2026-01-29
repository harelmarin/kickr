import { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { SearchResults } from './SearchResults';
import { useLocation } from 'react-router-dom';

export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { results, isLoading } = useSearch(query);
    const location = useLocation();

    // Close search when route changes
    useEffect(() => {
        setIsOpen(false);
        setQuery('');
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside, true);
        return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
    };


    return (
        <div className="relative h-full flex items-center" ref={containerRef}>
            <div className={`bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-sm flex items-center transition-all duration-300 h-7 md:h-9 pr-2 overflow-hidden shadow-2xl ${isOpen ? 'border-kickr/40 bg-white/[0.08]' : ''}`}>
                <div className="pl-2.5 pr-1 md:pr-2">
                    <svg
                        className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-colors ${isOpen ? 'text-kickr' : 'text-main/20 group-hover:text-main/40'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search matches/teams..."
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    aria-label="Search matches, leagues, or teams"
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 ring-0 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-main placeholder-secondary/30 py-0 w-12 focus:w-28 sm:w-40 sm:focus:w-72 transition-all duration-500"
                />
            </div>

            {isOpen && query.trim() && (
                <div className="fixed md:absolute top-[56px] md:top-[calc(100%+8px)] left-4 right-4 md:left-auto md:right-0 z-[100] md:z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <SearchResults
                        results={results}
                        isLoading={isLoading}
                        query={query}
                    />
                </div>
            )}
        </div>
    );
};
