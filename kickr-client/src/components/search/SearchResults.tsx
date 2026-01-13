import type { SearchResult } from '../../types/search';
import { Link } from 'react-router-dom';

interface SearchResultsProps {
    results: SearchResult[];
    isLoading: boolean;
    query: string;
}

export const SearchResults = ({ results, isLoading, query }: SearchResultsProps) => {
    if (!query.trim()) {
        return null;
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'user':
                return 'User';
            case 'team':
                return 'Team';
            case 'competition':
                return 'League';
            default:
                return type;
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'user':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'team':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'competition':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const getResultLink = (result: SearchResult) => {
        switch (result.type) {
            case 'user':
                return `/user/${result.id}`;
            case 'team':
                return `/teams/${result.id}`;
            case 'competition':
                return `/competitions/${result.id}`;
            default:
                return '#';
        }
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-[240px] sm:w-full bg-[#1b2228] border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 max-h-[350px] overflow-y-auto">
            {isLoading ? (
                <div className="p-4 text-center text-[#667788]">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span className="text-xs uppercase tracking-wider">Searching...</span>
                    </div>
                </div>
            ) : results.length === 0 ? (
                <div className="p-4 text-center text-[#667788]">
                    <p className="text-xs uppercase tracking-wider">No results for "{query}"</p>
                </div>
            ) : (
                <div className="py-2">
                    {results.map((result) => (
                        <Link
                            key={`${result.type}-${result.id}`}
                            to={getResultLink(result)}
                            className="flex items-center gap-3 px-3 py-3 sm:py-2.5 hover:bg-white/5 transition-colors group"
                        >
                            {/* Image or Icon */}
                            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                                {result.imageUrl ? (
                                    <img
                                        src={result.imageUrl}
                                        alt={result.name}
                                        className={`w-full h-full ${result.type === 'user' ? 'object-cover rounded-full bg-[#2c3440]' : 'object-contain'}`}
                                    />
                                ) : (
                                    <div className={`w-full h-full rounded-full bg-[#2c3440] flex items-center justify-center`}>
                                        <span className="text-sm">
                                            {result.type === 'user' ? '👤' : result.type === 'team' ? '⚽' : '🏆'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-[11px] truncate group-hover:text-white transition-colors block leading-tight">
                                    {result.name}
                                </h4>
                                {result.subtitle && (
                                    <p className="text-[#667788] text-[8px] uppercase font-black tracking-wider truncate mt-0.5 opacity-80">{result.subtitle}</p>
                                )}
                            </div>

                            {/* Type Badge - Smaller */}
                            <span
                                className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border flex-shrink-0 ${getTypeBadgeColor(
                                    result.type
                                )}`}
                            >
                                {getTypeLabel(result.type)}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
