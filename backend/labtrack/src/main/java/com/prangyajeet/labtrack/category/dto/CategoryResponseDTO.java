package com.prangyajeet.labtrack.category.dto;

import java.time.LocalDateTime;

public class CategoryResponseDTO {

    private Long id;
    private Long departmentId;
    private String departmentName;
    private String categoryName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CategoryResponseDTO() {
    }

    public CategoryResponseDTO(Long id,
                               Long departmentId,
                               String departmentName,
                               String categoryName,
                               String description,
                               LocalDateTime createdAt,
                               LocalDateTime updatedAt) {
        this.id = id;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.categoryName = categoryName;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}