import axiosInstance from './axios';

export interface DailyStat {
    date: string;
    count: number;
}

export interface DashboardStats {
    totalUsers: number;
    totalReviews: number;
    totalReports: number;
    pendingReports: number;
    userGrowthTrend: string;
    reviewVolumeTrend: string;
    userGrowth: DailyStat[];
    reviewVolume: DailyStat[];
}

export const adminDashboardService = {
    getStats: async () => {
        const response = await axiosInstance.get<DashboardStats>('/admin/dashboard/stats');
        return response.data;
    }
};
