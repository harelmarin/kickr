import { type FC } from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    icon?: string;
}

/**
 * Success modal to display important confirmations
 */
export const SuccessModal: FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    icon = '✓'
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-kickr-bg-primary/80 flex items-center justify-center z-50 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className="bg-kickr-bg-secondary p-8 md:p-12 rounded-md shadow-2xl w-[90%] max-w-sm relative border border-white/5 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Success Icon */}
                <div className="w-20 h-20 bg-rating/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rating/20">
                    <span className="text-4xl text-rating">{icon}</span>
                </div>

                {/* Titre */}
                <h2 className="text-2xl font-bold text-center mb-3 text-main uppercase tracking-tight">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-secondary text-center mb-8 leading-relaxed font-medium">
                    {message}
                </p>

                {/* Bouton de fermeture */}
                <button
                    onClick={onClose}
                    className="w-full bg-kickr hover:brightness-110 text-white font-bold py-4 px-6 rounded-md transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(93,139,255,0.2)]"
                >
                    Continuer
                </button>

                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-muted hover:text-main transition-colors"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
