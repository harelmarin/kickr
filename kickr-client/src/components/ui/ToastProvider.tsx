import { type FC, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
    children: ReactNode;
}

/**
 * Provider pour les notifications toast
 * À placer au niveau racine de l'application
 */
export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    // Style par défaut
                    duration: 4000,
                    style: {
                        background: '#1f2937',
                        color: '#fff',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                    },
                    // Success
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                        style: {
                            background: '#1f2937',
                            border: '1px solid #10b981',
                        },
                    },
                    // Error
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                        style: {
                            background: '#1f2937',
                            border: '1px solid #ef4444',
                        },
                    },
                    // Loading
                    loading: {
                        iconTheme: {
                            primary: '#3b82f6',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </>
    );
};
