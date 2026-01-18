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
            className="fixed inset-0 bg-kickr-bg-primary/60 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-primary p-8 rounded-sm shadow-2xl w-96 relative border border-green-500/30 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Success Icon */}
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                    <span className="text-3xl text-green-500">{icon}</span>
                </div>

                {/* Titre */}
                <h2 className="text-2xl font-bold text-center mb-3 text-main">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-gray-300 text-center mb-6 leading-relaxed">
                    {message}
                </p>

                {/* Bouton de fermeture */}
                <button
                    onClick={onClose}
                    className="w-full bg-green-500 hover:bg-green-600 text-main font-medium py-3 px-4 rounded-sm transition-colors"
                >
                    Compris !
                </button>

                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-main transition-colors"
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
