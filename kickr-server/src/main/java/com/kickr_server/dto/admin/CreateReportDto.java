package com.kickr_server.dto.admin;

import com.kickr_server.admin.report.ReportReason;
import com.kickr_server.admin.report.ReportType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateReportDto {
    @NotNull
    private ReportType targetType;
    @NotNull
    private UUID targetId;
    @NotNull
    private ReportReason reason;
    private String description;
}
