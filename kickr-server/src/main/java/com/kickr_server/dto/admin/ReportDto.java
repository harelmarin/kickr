package com.kickr_server.dto.admin;

import com.kickr_server.admin.report.Report;
import com.kickr_server.admin.report.ReportReason;
import com.kickr_server.admin.report.ReportStatus;
import com.kickr_server.admin.report.ReportType;
import com.kickr_server.dto.User.UserDto;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReportDto {
    private UUID id;
    private UserDto reporter;
    private ReportType targetType;
    private UUID targetId;
    private ReportReason reason;
    private String description;
    private ReportStatus status;
    private LocalDateTime createdAt;

    public static ReportDto fromEntity(Report report) {
        return ReportDto.builder()
                .id(report.getId())
                .reporter(UserDto.fromEntity(report.getReporter()))
                .targetType(report.getTargetType())
                .targetId(report.getTargetId())
                .reason(report.getReason())
                .description(report.getDescription())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
