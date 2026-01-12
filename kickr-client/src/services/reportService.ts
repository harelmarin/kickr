import axiosInstance from './axios';

export type ReportType = 'MATCH_REVIEW' | 'COMMENT';
export type ReportReason = 'SPAM' | 'INAPPROPRIATE_LANGUAGE' | 'HARASSMENT' | 'OTHER';
export type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

export interface CreateReportDto {
    targetType: ReportType;
    targetId: string;
    reason: ReportReason;
    description?: string;
}

export interface Report {
    id: string;
    reporter: any;
    targetType: ReportType;
    targetId: string;
    reason: ReportReason;
    description: string;
    status: ReportStatus;
    createdAt: string;
}

export const reportService = {
    createReport: async (dto: CreateReportDto) => {
        const response = await axiosInstance.post<Report>('/reports', dto);
        return response.data;
    },

    getAllReports: async (status?: ReportStatus) => {
        const response = await axiosInstance.get<Report[]>('/reports', {
            params: { status }
        });
        return response.data;
    },

    updateStatus: async (reportId: string, status: ReportStatus) => {
        const response = await axiosInstance.put<Report>(`/reports/${reportId}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    deleteReport: async (reportId: string) => {
        await axiosInstance.delete(`/reports/${reportId}`);
    }
};
