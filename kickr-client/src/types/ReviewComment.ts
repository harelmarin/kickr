export interface ReviewComment {
    id: string;
    userMatchId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    isModerated: boolean;
}
