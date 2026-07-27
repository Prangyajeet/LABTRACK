package com.prangyajeet.labtrack.category.entity;

import com.prangyajeet.labtrack.common.entity.AuditableEntity;
import com.prangyajeet.labtrack.department.entity.Department;
import jakarta.persistence.*;

@Entity
@Table(
        name = "categories",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"department_id", "category_name"})
        }
)
public class Category extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "category_name", nullable = false, length = 100)
    private String categoryName;

    @Column(nullable = false, length = 255)
    private String description;

    public Category() {
    }

    public Category(Department department,
                    String categoryName,
                    String description) {
        this.department = department;
        this.categoryName = categoryName;
        this.description = description;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
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