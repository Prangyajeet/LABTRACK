package com.prangyajeet.labtrack.report.dto;

public class ReportMetricDTO {

    private String metric;
    private String value;
    private String change;

    public ReportMetricDTO() {
    }

    public ReportMetricDTO(String metric, String value, String change) {
        this.metric = metric;
        this.value = value;
        this.change = change;
    }

    public String getMetric() {
        return metric;
    }

    public void setMetric(String metric) {
        this.metric = metric;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getChange() {
        return change;
    }

    public void setChange(String change) {
        this.change = change;
    }
}
