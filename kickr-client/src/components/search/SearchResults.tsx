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
                return 'text-kickr border-kickr/20 bg-kickr/[0.02]';
            case 'team':
                return 'text-main/40 border-white/5 bg-black/[0.02]';
            case 'competition':
                return 'text-main/40 border-white/5 bg-black/[0.02]';
            default:
                return 'text-main/20 border-white/5 bg-white/[0.01]';
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
        <div className="w-full sm:w-[500px] bg-kickr-bg-primary border border-white/10 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.7)] overflow-hidden max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
            {isLoading ? (
                <div className="p-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-4 h-4 border-2 border-kickr/20 border-t-kickr rounded-full animate-spin"></div>
                        <span className="text-[9px] font-black text-main/20 uppercase tracking-[0.3em] italic">Scanning...</span>
                    </div>
                </div>
            ) : results.length === 0 ? (
                <div className="p-6 text-center">
                    <p className="text-[9px] font-black text-main/20 uppercase tracking-[0.3em] italic">No Signal</p>
                </div>
            ) : (
                <div className="py-1">
                    <div className="px-4 py-2 mb-1 border-b border-white/5 bg-white/[0.01]">
                        <span className="text-[7px] font-black text-main/10 uppercase tracking-[0.4em] italic">Database Matches</span>
                    </div>
                    {results.map((result) => (
                        <Link
                            key={`${result.type}-${result.id}`}
                            to={getResultLink(result)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-all group/item relative border-b border-black/[0.02] last:border-none"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-kickr scale-y-0 group-hover/item:scale-y-100 transition-transform origin-center"></div>

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
                                <h4 className="text-main/40 font-black text-[10px] truncate uppercase tracking-tight italic group-hover/item:text-main transition-colors block leading-tight">
                                    {result.name}
                                </h4>
                                {result.subtitle && (
                                    <p className="text-main/10 text-[7px] uppercase font-black tracking-[0.2em] truncate mt-0.5 italic group-hover/item:text-main/30 transition-colors uppercase">{result.subtitle}</p>
                                )}
                            </div>

                            {/* Type Badge */}
                            <span
                                className={`px-1.5 py-0.5 rounded-sm text-[6px] font-black uppercase tracking-[0.1em] border flex-shrink-0 italic transition-all ${getTypeBadgeColor(
                                    result.type
                                )} opacity-30 group-hover/item:opacity-100 group-hover/item:border-kickr/40`}
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
