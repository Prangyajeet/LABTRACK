package com.prangyajeet.labtrack.department.service;

import com.prangyajeet.labtrack.department.dto.DepartmentRequestDTO;
import com.prangyajeet.labtrack.department.dto.DepartmentResponseDTO;

import java.util.List;

public interface DepartmentService {

    List<DepartmentResponseDTO> getAllDepartments();

    DepartmentResponseDTO getDepartmentById(Long id);

    DepartmentResponseDTO createDepartment(DepartmentRequestDTO dto);

    DepartmentResponseDTO updateDepartment(Long id,
                                           DepartmentRequestDTO dto);

    void deleteDepartment(Long id);
}