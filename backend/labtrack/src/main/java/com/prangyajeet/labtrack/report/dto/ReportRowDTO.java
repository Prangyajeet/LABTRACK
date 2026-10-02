package com.prangyajeet.labtrack.report.dto;

import java.util.LinkedHashMap;
import java.util.Map;

public class ReportRowDTO {

    private Map<String, Object> values = new LinkedHashMap<>();

    public ReportRowDTO() {
    }

    public ReportRowDTO(Map<String, Object> values) {
        this.values = values;
    }

    public Map<String, Object> getValues() {
        return values;
    }

    public void setValues(Map<String, Object> values) {
        this.values = values;
    }
}
