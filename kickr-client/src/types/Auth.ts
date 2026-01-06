import type { User } from './User';

export interface LoginRequest {
    username: string;
    password: string;
}


export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
