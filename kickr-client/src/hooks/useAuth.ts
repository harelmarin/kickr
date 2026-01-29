import { create } from 'zustand';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import type { User } from '../types/user';
import type { LoginRequest, RegisterRequest } from '../types/auth';

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
    updateUser: (user: User) => void;
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
            const user = await authService.login(credentials);
            set({
                user: user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });

            toast.success(`Welcome back, ${user.name}!`, {
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

            // Automatic login after registration
            const user = await authService.login({
                username: data.name,
                password: data.password
            });

            set({
                user: user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });

            toast.success(`Welcome to the field, ${user.name}!`, {
                id: toastId,
                duration: 4000,
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
            // Even in case of error, disconnect the user on the client side
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

    updateUser: (user: User) => {
        authService.setUser(user);
        set({ user: { ...user } });
    },

    clearError: () => {
        set({ error: null });
    }
}));
