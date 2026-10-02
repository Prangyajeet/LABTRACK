package com.prangyajeet.labtrack.department.service;

import com.prangyajeet.labtrack.department.dto.DepartmentRequestDTO;
import com.prangyajeet.labtrack.department.dto.DepartmentResponseDTO;

import java.util.List;

public interface DepartmentService {

    List<DepartmentResponseDTO> getAllDepartments();

    DepartmentResponseDTO getDepartmentById(Long id);

    DepartmentResponseDTO createDepartment(
            DepartmentRequestDTO requestDTO
    );

    DepartmentResponseDTO updateDepartment(
            Long id,
            DepartmentRequestDTO requestDTO
    );

    void deleteDepartment(Long id);

    void restoreDepartment(Long id);
}