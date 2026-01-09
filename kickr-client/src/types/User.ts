export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
    followersCount: number;
    followingCount: number;
    matchesCount: number;
    avatarUrl?: string;
}