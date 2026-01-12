package com.kickr_server.admin.dashboard;

import com.kickr_server.admin.report.ReportRepository;
import com.kickr_server.admin.report.ReportStatus;
import com.kickr_server.dto.admin.DashboardStatsDto;
import com.kickr_server.user.UserRepository;
import com.kickr_server.usermatch.UserMatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminDashboardService {

        private final UserRepository userRepository;
        private final UserMatchRepository userMatchRepository;
        private final ReportRepository reportRepository;

        public DashboardStatsDto getDashboardStats() {
                try {
                        long totalUsers = userRepository.count();
                        long totalReviews = userMatchRepository.count();

                        // Defensive count for reports in case table is missing
                        long totalReports = 0;
                        long pendingReports = 0;
                        try {
                                totalReports = reportRepository.count();
                                pendingReports = reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.PENDING)
                                                .size();
                        } catch (Exception e) {
                                log.warn("Reporting system might not be fully initialized: {}", e.getMessage());
                        }

                        LocalDateTime thirtyDaysAgo = LocalDate.now().minusDays(30).atStartOfDay();

                        List<DashboardStatsDto.DailyStatDto> userGrowth = mapDailyStats(
                                        userRepository.countUsersByDay(thirtyDaysAgo));
                        List<DashboardStatsDto.DailyStatDto> reviewVolume = mapDailyStats(
                                        userMatchRepository.countReviewsByDay(thirtyDaysAgo));

                        return DashboardStatsDto.builder()
                                        .totalUsers(totalUsers)
                                        .totalReviews(totalReviews)
                                        .totalReports(totalReports)
                                        .pendingReports(pendingReports)
                                        .userGrowth(userGrowth)
                                        .reviewVolume(reviewVolume)
                                        .build();
                } catch (Exception e) {
                        log.error("Fatal error during dashboard stats generation: ", e);
                        throw e;
                }
        }

        private List<DashboardStatsDto.DailyStatDto> mapDailyStats(List<Object[]> results) {
                return results.stream()
                                .map(obj -> new DashboardStatsDto.DailyStatDto(
                                                convertToLocalDate(obj[0]),
                                                ((Number) obj[1]).longValue()))
                                .collect(Collectors.toList());
        }

        private LocalDate convertToLocalDate(Object obj) {
                if (obj == null)
                        return null;
                if (obj instanceof LocalDate)
                        return (LocalDate) obj;
                if (obj instanceof java.sql.Date)
                        return ((java.sql.Date) obj).toLocalDate();
                if (obj instanceof java.sql.Timestamp)
                        return ((java.sql.Timestamp) obj).toLocalDateTime().toLocalDate();
                if (obj instanceof java.util.Date) {
                        return ((java.util.Date) obj).toInstant().atZone(java.time.ZoneId.systemDefault())
                                        .toLocalDate();
                }
                try {
                        return LocalDate.parse(obj.toString());
                } catch (Exception e) {
                        log.warn("Failed to parse date object: {}", obj);
                        return null;
                }
        }
}
