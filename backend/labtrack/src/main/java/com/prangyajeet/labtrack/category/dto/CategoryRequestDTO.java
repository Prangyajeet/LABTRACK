package com.prangyajeet.labtrack.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CategoryRequestDTO {

    @NotNull(message = "Department Id is required")
    private Long departmentId;

    @NotBlank(message = "Category name is required")
    @Size(max = 100)
    private String categoryName;

    @NotBlank(message = "Description is required")
    @Size(max = 255)
    private String description;

    public CategoryRequestDTO() {
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}