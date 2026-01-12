package com.kickr_server.admin.report;

import com.kickr_server.dto.admin.CreateReportDto;
import com.kickr_server.dto.admin.ReportDto;
import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReportDto createReport(String email, CreateReportDto dto) {
        User reporter = userRepository.findByName(email)
                .or(() -> userRepository.findByEmail(email))
                .orElseThrow(() -> new RuntimeException("Reporter not found"));

        Report report = Report.builder()
                .reporter(reporter)
                .targetType(dto.getTargetType())
                .targetId(dto.getTargetId())
                .reason(dto.getReason())
                .description(dto.getDescription())
                .status(ReportStatus.PENDING)
                .build();

        return ReportDto.fromEntity(reportRepository.save(report));
    }

    public List<ReportDto> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ReportDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ReportDto> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(ReportDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportDto updateStatus(UUID reportId, ReportStatus status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(status);
        return ReportDto.fromEntity(reportRepository.save(report));
    }

    @Transactional
    public void deleteReport(UUID reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new RuntimeException("Report not found");
        }
        reportRepository.deleteById(reportId);
    }
}
