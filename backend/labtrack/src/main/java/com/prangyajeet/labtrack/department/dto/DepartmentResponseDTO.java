package com.prangyajeet.labtrack.department.dto;

import java.time.LocalDateTime;

public class DepartmentResponseDTO {

    private Long id;
    private String departmentName;
    private String description;
    private LocalDateTime createdAt;

    public DepartmentResponseDTO() {
    }

    public DepartmentResponseDTO(Long id,
                                 String departmentName,
                                 String description,
                                 LocalDateTime createdAt) {
        this.id = id;
        this.departmentName = departmentName;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}