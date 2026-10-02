package com.prangyajeet.labtrack.report.service;

import com.prangyajeet.labtrack.report.entity.ReportType;

import java.time.LocalDate;

public interface ReportExportService {

    byte[] exportPdf(
            LocalDate fromDate,
            LocalDate toDate,
            Long departmentId,
            ReportType reportType
    );

    byte[] exportExcel(
            LocalDate fromDate,
            LocalDate toDate,
            Long departmentId,
            ReportType reportType
    );
}