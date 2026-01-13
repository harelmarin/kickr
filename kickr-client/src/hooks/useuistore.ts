import { create } from 'zustand';

interface UIState {
    authModalMode: 'login' | 'register' | null;
    openAuthModal: (mode?: 'login' | 'register') => void;
    closeAuthModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    authModalMode: null,
    openAuthModal: (mode = 'login') => set({ authModalMode: mode }),
    closeAuthModal: () => set({ authModalMode: null }),
}));
