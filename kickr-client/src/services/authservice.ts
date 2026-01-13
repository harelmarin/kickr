import axiosInstance from './axios';
import type { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenResponse, ApiResponse } from '../types/auth';
import type { User } from '../types/user';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

class AuthService {
    /**
     * User login
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        const authData = response.data.data;

        this.setTokens(authData.token, authData.refreshToken);
        this.setUser(authData.user);

        return authData;
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
    async refreshToken(): Promise<RefreshTokenResponse> {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh', {
            refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        this.setTokens(accessToken, newRefreshToken);

        return response.data;
    }

    /**
     * User logout
     */
    async logout(): Promise<void> {
        const refreshToken = this.getRefreshToken();

        if (refreshToken) {
            try {
                await axiosInstance.post('/auth/logout', { refreshToken });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        this.clearAuth();
    }

    /**
     * Store tokens in localStorage
     */
    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    /**
     * Get the access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Get the refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

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
        return !!this.getAccessToken();
    }

    /**
     * Clear all authentication data
     */
    clearAuth(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}

export const authService = new AuthService();
