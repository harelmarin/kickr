package com.kickr_server.admin.report;

import com.kickr_server.dto.admin.CreateReportDto;
import com.kickr_server.dto.admin.ReportDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportDto> createReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateReportDto dto) {
        return ResponseEntity.ok(reportService.createReport(userDetails.getUsername(), dto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportDto>> getAllReports(
            @RequestParam(required = false) ReportStatus status) {
        if (status != null) {
            return ResponseEntity.ok(reportService.getReportsByStatus(status));
        }
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportDto> updateStatus(
            @PathVariable UUID id,
            @RequestParam ReportStatus status) {
        return ResponseEntity.ok(reportService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReport(@PathVariable UUID id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
