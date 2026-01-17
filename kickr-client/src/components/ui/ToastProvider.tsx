import { type FC, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
    children: ReactNode;
}

/**
 * Provider pour les notifications toast
 * Place at the root level of the application
 */
export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
    return (
        <>
            {children}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'rgba(12, 12, 12, 0.95)',
                        backdropFilter: 'blur(12px)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontSize: '13px',
                        fontWeight: '600',
                        letterSpacing: '-0.01em',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#4B7BEC',
                            secondary: '#fff',
                        },
                        style: {
                            border: '1px solid rgba(75, 123, 236, 0.2)',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                        style: {
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                        },
                    },
                }}
            />
        </>
    );
};
