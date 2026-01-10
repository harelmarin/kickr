/**
 * Decode JWT token to inspect its payload
 */
export function decodeJWT(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

/**
 * Check if user has admin role from JWT
 */
export function isAdminFromToken(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    const payload = decodeJWT(token);

    // Check for role in different possible formats
    const hasAdminRole =
        payload?.role === 'ADMIN' ||
        payload?.authorities?.includes('ROLE_ADMIN') ||
        payload?.roles?.includes('ADMIN');

    return hasAdminRole;
}
