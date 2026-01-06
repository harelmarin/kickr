import axiosInstance from './axios';
import type { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenResponse, ApiResponse } from '../types/Auth';
import type { User } from '../types/User';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

class AuthService {
    /**
     * Connexion de l'utilisateur
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
        const authData = response.data.data;

        this.setTokens(authData.token, authData.refreshToken);
        this.setUser(authData.user);

        return authData;
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    async register(data: RegisterRequest): Promise<User> {
        const response = await axiosInstance.post<ApiResponse<User>>('/auth/register', data);
        return response.data.data;
    }

    /**
     * Rafraîchir l'access token avec le refresh token
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
     * Déconnexion de l'utilisateur
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
     * Stocke les tokens dans le localStorage
     */
    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    /**
     * Récupère l'access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Récupère le refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    /**
     * Stocke les informations de l'utilisateur
     */
    setUser(user: User): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    /**
     * Récupère les informations de l'utilisateur
     */
    getUser(): User | null {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    /**
     * Vérifie si l'utilisateur est authentifié
     */
    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    /**
     * Nettoie toutes les données d'authentification
     */
    clearAuth(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}

export const authService = new AuthService();
