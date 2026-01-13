import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { TacticalCard } from './tacticalcard';
import type { UserMatch } from '../../types/usermatch';
import toast from 'react-hot-toast';

interface ShareReviewButtonProps {
    review: UserMatch;
    variant?: 'icon' | 'full';
    showXShare?: boolean;
}

export const ShareReviewButton = ({ review, variant = 'icon', showXShare = false }: ShareReviewButtonProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!cardRef.current) return;

        setIsGenerating(true);
        const loadingToast = toast.loading('Generating Tactical Card...');

        try {
            // Wait longer for fonts and images to be ready
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Force image reload by checking if all images are loaded
            const images = cardRef.current.querySelectorAll('img');
            await Promise.allSettled(
                Array.from(images).map(img => {
                    if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
                    return new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => reject(new Error(`Timeout loading ${img.src}`)), 8000);
                        img.onload = () => {
                            clearTimeout(timeout);
                            resolve(null);
                        };
                        img.onerror = () => {
                            clearTimeout(timeout);
                            console.warn('Failed to load image for card:', img.src);
                            resolve(null); // Resolve anyway to allow generate even if one image fails
                        };
                        // Force reload if not loaded
                        if (!img.complete || img.naturalHeight === 0) {
                            const src = img.src;
                            img.src = '';
                            img.src = src;
                        }
                    });
                })
            );

            // Extra wait to ensure rendering is complete
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(cardRef.current, {
                quality: 1.0,
                pixelRatio: 2, // High DPI
                cacheBust: true,
                skipFonts: false,
                style: {
                    visibility: 'visible'
                }
            });

            const link = document.createElement('a');
            link.download = `kickr-${review.match.homeTeam.toLowerCase().replace(/\s+/g, '-')}-vs-${review.match.awayTeam.toLowerCase().replace(/\s+/g, '-')}.png`;
            link.href = dataUrl;
            link.click();

            toast.success('Card downloaded!', { id: loadingToast });
        } catch (error) {
            console.error('Failed to generate image:', error);
            toast.error('Failed to generate image. Please try again.', { id: loadingToast });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShareTwitter = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const rating = '★'.repeat(Math.round(review.note));
        const text = `Just logged my review of ${review.match.homeTeam} vs ${review.match.awayTeam} on @KickrApp! ⚽\n\nRating: ${rating}\n`;
        const url = `${window.location.origin}/reviews/${review.id}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    return (
        <>
            {/* Hidden off-screen container for image generation */}
            <div
                className="fixed pointer-events-none overflow-hidden"
                style={{
                    left: '-2000px',
                    top: '-2000px',
                    width: '1080px'
                }}
            >
                <div style={{ visibility: isGenerating ? 'visible' : 'hidden' }}>
                    <TacticalCard review={review} cardRef={cardRef} />
                </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 rounded-xl transition-all duration-300 group overflow-hidden cursor-pointer ${variant === 'full'
                        ? 'px-5 py-3 bg-[#4466ff] text-white font-black uppercase text-xs hover:brightness-110 active:scale-95'
                        : 'px-2.5 py-1.5 bg-white/5 text-[#445566] hover:text-[#4466ff] hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest border border-white/5'
                        }`}
                    title="Download PNG Card"
                >
                    {isGenerating ? (
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`${variant === 'full' ? 'w-4 h-4' : 'w-3 h-3'} group-hover:translate-y-[-1px] transition-transform`}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    )}
                    {variant === 'full' && (
                        <span className="truncate hidden sm:block">
                            Generate Tactical Card
                        </span>
                    )}
                </button>

                {showXShare && (
                    <button
                        onClick={handleShareTwitter}
                        className={`flex items-center justify-center rounded-lg bg-white/5 text-[#445566] hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all duration-300 cursor-pointer border border-white/5 ${variant === 'full' ? 'w-10 h-10' : 'w-7 h-7'
                            }`}
                        title="Share to X (Twitter)"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className={variant === 'full' ? 'w-4 h-4' : 'w-3 h-3'}>
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </button>
                )}
            </div>
        </>
    );
};
