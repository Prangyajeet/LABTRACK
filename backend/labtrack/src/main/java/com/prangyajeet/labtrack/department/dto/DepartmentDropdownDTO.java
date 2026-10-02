package com.prangyajeet.labtrack.department.dto;

public class DepartmentDropdownDTO {

    private Long id;

    private String departmentName;

    public DepartmentDropdownDTO() {
    }

    public DepartmentDropdownDTO(
            Long id,
            String departmentName) {

        this.id = id;
        this.departmentName = departmentName;
    }

    public Long getId() {
        return id;
    }

    public String getDepartmentName() {
        return departmentName;
    }

}