package com.prangyajeet.labtrack.report.controller;

import com.prangyajeet.labtrack.report.dto.ReportResponseDTO;
import com.prangyajeet.labtrack.report.entity.ReportType;
import com.prangyajeet.labtrack.report.service.ReportExportService;
import com.prangyajeet.labtrack.report.service.ReportService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    private final ReportExportService reportExportService;

    public ReportController(
            ReportService reportService,
            ReportExportService reportExportService) {

        this.reportService = reportService;
        this.reportExportService = reportExportService;
    }

    /*
     * ============================================================
     * NORMAL REPORT
     * ============================================================
     */

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<ReportResponseDTO> generateReport(

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate,

            @RequestParam(required = false)
            Long departmentId,

            @RequestParam(defaultValue = "FULL_REPORT")
            ReportType reportType
    ) {

        LocalDate end =
                toDate == null
                        ? LocalDate.now()
                        : toDate;

        LocalDate start =
                fromDate == null
                        ? end.minusDays(29)
                        : fromDate;

        return ResponseEntity.ok(
                reportService.generateReport(
                        start,
                        end,
                        departmentId,
                        reportType
                )
        );
    }

    /*
     * ============================================================
     * PDF EXPORT
     * ============================================================
     */

    @GetMapping("/export/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<byte[]> exportPdf(

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate,

            @RequestParam(required = false)
            Long departmentId,

            @RequestParam(defaultValue = "FULL_REPORT")
            ReportType reportType
    ) {

        LocalDate end =
                toDate == null
                        ? LocalDate.now()
                        : toDate;

        LocalDate start =
                fromDate == null
                        ? end.minusDays(29)
                        : fromDate;

        byte[] pdfFile =
                reportExportService.exportPdf(
                        start,
                        end,
                        departmentId,
                        reportType
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=labtrack-report.pdf"
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(pdfFile);
    }

    /*
     * ============================================================
     * EXCEL EXPORT
     * ============================================================
     */

    @GetMapping("/export/excel")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<byte[]> exportExcel(

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate,

            @RequestParam(required = false)
            Long departmentId,

            @RequestParam(defaultValue = "FULL_REPORT")
            ReportType reportType
    ) {

        LocalDate end =
                toDate == null
                        ? LocalDate.now()
                        : toDate;

        LocalDate start =
                fromDate == null
                        ? end.minusDays(29)
                        : fromDate;

        byte[] excelFile =
                reportExportService.exportExcel(
                        start,
                        end,
                        departmentId,
                        reportType
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=labtrack-report.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelFile);
    }
}