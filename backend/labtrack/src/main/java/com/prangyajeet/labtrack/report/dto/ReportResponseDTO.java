package com.prangyajeet.labtrack.report.dto;

import com.prangyajeet.labtrack.report.entity.ReportType;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ReportResponseDTO {

    private boolean success = true;
    private String message;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Long departmentId;
    private ReportType reportType;

    private List<ReportMetricDTO> metrics = new ArrayList<>();
    private List<ReportChartPointDTO> consumableUsage = new ArrayList<>();
    private List<ReportChartPointDTO> breakages = new ArrayList<>();
    private List<ReportRowDTO> rows = new ArrayList<>();

    public ReportResponseDTO() {
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public ReportType getReportType() {
        return reportType;
    }

    public void setReportType(ReportType reportType) {
        this.reportType = reportType;
    }

    public List<ReportMetricDTO> getMetrics() {
        return metrics;
    }

    public void setMetrics(List<ReportMetricDTO> metrics) {
        this.metrics = metrics;
    }

    public List<ReportChartPointDTO> getConsumableUsage() {
        return consumableUsage;
    }

    public void setConsumableUsage(List<ReportChartPointDTO> consumableUsage) {
        this.consumableUsage = consumableUsage;
    }

    public List<ReportChartPointDTO> getBreakages() {
        return breakages;
    }

    public void setBreakages(List<ReportChartPointDTO> breakages) {
        this.breakages = breakages;
    }

    public List<ReportRowDTO> getRows() {
        return rows;
    }

    public void setRows(List<ReportRowDTO> rows) {
        this.rows = rows;
    }
}
