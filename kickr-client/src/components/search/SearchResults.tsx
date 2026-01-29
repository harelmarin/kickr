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
                return 'MEMBER';
            case 'team':
                return 'CLUB';
            case 'competition':
                return 'LEAGUE';
            default:
                return type.toUpperCase();
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'user':
                return 'text-kickr border-kickr/20 bg-kickr/10';
            case 'team':
                return 'text-secondary border-white/10 bg-white/[0.02]';
            case 'competition':
                return 'text-rating border-rating/20 bg-rating/10';
            default:
                return 'text-muted border-white/5 bg-white/[0.01]';
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
        <div className="w-full sm:w-[500px] bg-kickr-bg-secondary border border-white/10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {isLoading ? (
                <div className="p-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-4 h-4 border-2 border-kickr/20 border-t-kickr rounded-full animate-spin"></div>
                        <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.3em]">Scanning Database...</span>
                    </div>
                </div>
            ) : results.length === 0 ? (
                <div className="p-6 text-center">
                    <p className="text-[9px] font-black text-main/20 uppercase tracking-[0.3em] italic">No Signal</p>
                </div>
            ) : (
                <div className="py-1">
                    <div className="px-4 py-3 mb-1 border-b border-white/5 bg-white/[0.02]">
                        <span className="text-[8px] font-bold text-kickr uppercase tracking-[0.3em]">Search Results</span>
                    </div>
                    {results.map((result) => (
                        <Link
                            key={`${result.type}-${result.id}`}
                            to={getResultLink(result)}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.05] transition-all group/item relative border-b border-white/[0.02] last:border-none"
                        >
                            <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-kickr scale-y-0 group-hover/item:scale-y-100 transition-transform origin-center"></div>

                            {/* Image or Icon */}
                            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative">
                                <div className="absolute inset-0 bg-black/5 rounded-sm p-[1px]">
                                    <div className="w-full h-full bg-kickr-bg-primary rounded-sm overflow-hidden flex items-center justify-center">
                                        {result.imageUrl ? (
                                            <img
                                                src={result.imageUrl}
                                                alt={result.name}
                                                className={`w-full h-full ${result.type === 'user' ? 'object-cover' : 'object-contain p-1'}`}
                                            />
                                        ) : (
                                            <span className="text-[10px] opacity-20">
                                                {result.type === 'user' ? '👤' : result.type === 'team' ? '⚽' : '🏆'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-main/90 font-bold text-[11px] md:text-xs truncate uppercase tracking-tight group-hover/item:text-main transition-colors block leading-tight">
                                    {result.name}
                                </h4>
                                {result.subtitle && (
                                    <p className="text-secondary/60 text-[8px] uppercase font-bold tracking-[0.1em] truncate mt-0.5 group-hover/item:text-secondary transition-colors">{result.subtitle}</p>
                                )}
                            </div>

                            {/* Type Badge */}
                            <span
                                className={`px-2 py-0.5 rounded-sm text-[7px] font-bold uppercase tracking-wider border flex-shrink-0 transition-all ${getTypeBadgeColor(
                                    result.type
                                )} opacity-60 group-hover/item:opacity-100 group-hover/item:border-kickr/40`}
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
