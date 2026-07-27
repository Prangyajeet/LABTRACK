package com.prangyajeet.labtrack.department.entity;

import com.prangyajeet.labtrack.common.entity.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "departments")
public class Department extends AuditableEntity {

    @Column(name = "department_name", nullable = false, unique = true, length = 100)
    private String departmentName;

    @Column(nullable = false, length = 255)
    private String description;

    public Department() {
    }

    public Department(String departmentName, String description) {
        this.departmentName = departmentName;
        this.description = description;
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
}