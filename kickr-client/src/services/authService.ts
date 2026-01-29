import axiosInstance from './axios';
import type { LoginRequest, RegisterRequest, ApiResponse } from '../types/auth';
import type { User } from '../types/user';

const USER_KEY = 'user';

class AuthService {
    /**
     * User login
     */
    async login(credentials: LoginRequest): Promise<User> {
        const response = await axiosInstance.post<ApiResponse<User>>('/auth/login', credentials);
        const user = response.data.data;
        this.setUser(user);
        return user;
    }

    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<User> {
        const response = await axiosInstance.post<ApiResponse<User>>('/auth/register', data);
        return response.data.data;
    }

    /**
     * Refresh the access token with the refresh token
     */
    async refreshToken(): Promise<void> {
        await axiosInstance.post<ApiResponse<void>>('/auth/refresh');
        // Cookies are automatically updated by the response
    }

    /**
     * User logout
     */
    async logout(): Promise<void> {
        try {
            await axiosInstance.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.clearAuth();
    }

    /**
     * Store tokens in localStorage
     */


    /**
     * Store user information
     */
    setUser(user: User): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    /**
     * Get user information
     */
    getUser(): User | null {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        // Since we don't have access to the cookie, checking for the user object is a proxy
        // A better approach would be to have a dedicated /me endpoint check on load
        return !!this.getUser();
    }

    /**
     * Clear all authentication data
     */
    clearAuth(): void {
        localStorage.removeItem(USER_KEY);
    }
}

export const authService = new AuthService();
