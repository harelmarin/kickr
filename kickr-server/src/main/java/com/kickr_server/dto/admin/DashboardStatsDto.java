package com.kickr_server.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private long totalUsers;
    private long totalReviews;
    private long totalReports;
    private long pendingReports;
    private String userGrowthTrend;
    private String reviewVolumeTrend;
    private List<DailyStatDto> userGrowth;
    private List<DailyStatDto> reviewVolume;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyStatDto {
        private LocalDate date;
        private long count;
    }
}
