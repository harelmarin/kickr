import { type FC, type ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'USER' | 'ADMIN';
}

/**
 * Component to protect routes that require authentication and optional role-based access
 */
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, user, checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
