package com.prangyajeet.labtrack.department.dto;

import com.prangyajeet.labtrack.common.enums.Status;

import java.time.LocalDateTime;

public class DepartmentResponseDTO {

    private Long id;

    private String departmentName;

    private String description;

    private Status status;

    private LocalDateTime createdAt;

    public DepartmentResponseDTO() {
    }

    public DepartmentResponseDTO(
            Long id,
            String departmentName,
            String description,
            Status status,
            LocalDateTime createdAt) {

        this.id = id;
        this.departmentName = departmentName;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}