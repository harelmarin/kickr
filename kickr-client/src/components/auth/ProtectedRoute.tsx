import { type FC, type ReactNode, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'USER' | 'ADMIN';
}

/**
 * Component to protect routes that require authentication and optional role-based access
 */
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, user, checkAuth } = useAuth();
    const hasShownToast = useRef(false);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (!isAuthenticated) {
        if (!hasShownToast.current) {
            hasShownToast.current = true;
            toast.error('You need to be logged in to access this feature', {
                duration: 2000,
                position: 'top-center',
            });
        }
        return <Navigate to="/register" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        if (!hasShownToast.current) {
            hasShownToast.current = true;
            toast.error('You do not have permission to access this page', {
                duration: 2000,
                position: 'top-center',
            });
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
