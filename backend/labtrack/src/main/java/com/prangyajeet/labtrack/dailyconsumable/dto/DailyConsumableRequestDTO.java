package com.prangyajeet.labtrack.dailyconsumable.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class DailyConsumableRequestDTO {

    private Long itemId;

    private Integer quantityUsed;

    private String facultyStaffName;

    private String designation;

    private Long departmentId;

    private String purposeTest;

    private LocalDate usageDate;

    private LocalTime usageTime;

    private String remarks;

    public DailyConsumableRequestDTO() {
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Integer getQuantityUsed() {
        return quantityUsed;
    }

    public void setQuantityUsed(Integer quantityUsed) {
        this.quantityUsed = quantityUsed;
    }

    public String getFacultyStaffName() {
        return facultyStaffName;
    }

    public void setFacultyStaffName(String facultyStaffName) {
        this.facultyStaffName = facultyStaffName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getPurposeTest() {
        return purposeTest;
    }

    public void setPurposeTest(String purposeTest) {
        this.purposeTest = purposeTest;
    }

    public LocalDate getUsageDate() {
        return usageDate;
    }

    public void setUsageDate(LocalDate usageDate) {
        this.usageDate = usageDate;
    }

    public LocalTime getUsageTime() {
        return usageTime;
    }

    public void setUsageTime(LocalTime usageTime) {
        this.usageTime = usageTime;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}