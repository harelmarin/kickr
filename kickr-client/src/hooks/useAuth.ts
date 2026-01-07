import { create } from 'zustand';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import type { User } from '../types/User';
import type { LoginRequest, RegisterRequest } from '../types/Auth';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => void;
    clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    user: authService.getUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null,

    login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        const toastId = toast.loading('Logging in...');

        try {
            const response = await authService.login(credentials);
            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });

            toast.success(`Welcome back, ${response.user.name}!`, {
                id: toastId,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false,
                user: null
            });

            toast.error(errorMessage, {
                id: toastId,
            });

            throw error;
        }
    },

    register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        const toastId = toast.loading('Creating account...');

        try {
            await authService.register(data);
            set({ isLoading: false, error: null });

            toast.success('Account created successfully!\nYou can now log in.', {
                id: toastId,
                duration: 5000,
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            set({ error: errorMessage, isLoading: false });

            toast.error(errorMessage, {
                id: toastId,
            });

            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        const toastId = toast.loading('Logging out...');

        try {
            await authService.logout();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });

            toast.success('See you soon!', {
                id: toastId,
            });
        } catch (error) {
            // Même en cas d'erreur, on déconnecte l'utilisateur côté client
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });

            toast.success('Logged out successfully', {
                id: toastId,
            });
        }
    },

    checkAuth: () => {
        const user = authService.getUser();
        const isAuthenticated = authService.isAuthenticated();
        set({ user, isAuthenticated });
    },

    clearError: () => {
        set({ error: null });
    }
}));
