package com.prangyajeet.labtrack.report.service;

import com.prangyajeet.labtrack.report.dto.ReportResponseDTO;
import com.prangyajeet.labtrack.report.entity.ReportType;

import java.time.LocalDate;

public interface ReportService {

    ReportResponseDTO generateReport(
            LocalDate fromDate,
            LocalDate toDate,
            Long departmentId,
            ReportType reportType
    );
}
