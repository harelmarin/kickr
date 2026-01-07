import { useState, useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { SearchResults } from './SearchResults';

export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { results, isLoading } = useSearch(query);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative group" ref={containerRef}>
            <div className="bg-[#2c3440] hover:bg-[#38424e] rounded-full flex items-center transition-all duration-300">
                <div className="pl-4 pr-2">
                    <svg
                        className="w-3.5 h-3.5 text-[#667788] group-focus-within:text-white transition-colors"
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
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 ring-0 text-[11px] font-bold uppercase tracking-widest text-white placeholder-[#667788] py-2 w-24 focus:w-48 transition-all duration-300"
                />
            </div>

            {isOpen && (
                <SearchResults
                    results={results}
                    isLoading={isLoading}
                    query={query}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};
