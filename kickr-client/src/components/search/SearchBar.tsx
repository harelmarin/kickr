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
        <div className="relative group" ref={containerRef}>
            <div className="bg-[#2c3440] hover:bg-[#38424e] rounded-full flex items-center transition-all duration-300 h-7 sm:h-9">
                <div className="pl-2.5 sm:pl-4 pr-1 sm:pr-2">
                    <svg
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#667788] group-focus-within:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 ring-0 text-[10px] font-bold uppercase tracking-widest text-white placeholder-[#667788] py-0 w-20 focus:w-32 sm:w-24 sm:focus:w-48 transition-all duration-300"
                />
            </div>

            {isOpen && (
                <SearchResults
                    results={results}
                    isLoading={isLoading}
                    query={query}
                />
            )}
        </div>
    );
};
