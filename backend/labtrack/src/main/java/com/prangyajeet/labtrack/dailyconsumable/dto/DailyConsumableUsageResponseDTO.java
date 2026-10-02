package com.prangyajeet.labtrack.dailyconsumable.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class DailyConsumableUsageResponseDTO {

    private Long id;

    private Long itemId;
    private String itemCode;
    private String itemName;

    private Integer quantityUsed;
    private String unit;

    private String facultyStaffName;
    private String designation;

    private Long departmentId;
    private String departmentName;

    private String purposeTest;

    private LocalDate usageDate;
    private LocalTime usageTime;

    private String remarks;

    private Long loggedById;
    private String loggedByName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /*
     * =========================================================
     * PHOTO
     * =========================================================
     */

    private String photoFileName;
    private String photoContentType;
    private String photoUrl;
    private Boolean photoAvailable;

    public DailyConsumableUsageResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Integer getQuantityUsed() {
        return quantityUsed;
    }

    public void setQuantityUsed(Integer quantityUsed) {
        this.quantityUsed = quantityUsed;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
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

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
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

    public Long getLoggedById() {
        return loggedById;
    }

    public void setLoggedById(Long loggedById) {
        this.loggedById = loggedById;
    }

    public String getLoggedByName() {
        return loggedByName;
    }

    public void setLoggedByName(String loggedByName) {
        this.loggedByName = loggedByName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /*
     * =========================================================
     * PHOTO GETTERS / SETTERS
     * =========================================================
     */

    public String getPhotoFileName() {
        return photoFileName;
    }

    public void setPhotoFileName(String photoFileName) {
        this.photoFileName = photoFileName;
    }

    public String getPhotoContentType() {
        return photoContentType;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Boolean getPhotoAvailable() {
        return photoAvailable;
    }

    public void setPhotoAvailable(Boolean photoAvailable) {
        this.photoAvailable = photoAvailable;
    }
}