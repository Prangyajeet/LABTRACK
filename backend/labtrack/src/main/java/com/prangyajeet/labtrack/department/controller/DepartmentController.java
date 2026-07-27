package com.prangyajeet.labtrack.department.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.department.dto.DepartmentRequestDTO;
import com.prangyajeet.labtrack.department.dto.DepartmentResponseDTO;
import com.prangyajeet.labtrack.department.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponseDTO>>> getAllDepartments() {

        List<DepartmentResponseDTO> departments = departmentService.getAllDepartments();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Departments fetched successfully.",
                        departments
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponseDTO>> getDepartmentById(
            @PathVariable Long id) {

        DepartmentResponseDTO department = departmentService.getDepartmentById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Department fetched successfully.",
                        department
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentResponseDTO>> createDepartment(
            @Valid @RequestBody DepartmentRequestDTO dto) {

        DepartmentResponseDTO department = departmentService.createDepartment(dto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Department created successfully.",
                        department
                ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponseDTO>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequestDTO dto) {

        DepartmentResponseDTO department = departmentService.updateDepartment(id, dto);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Department updated successfully.",
                        department
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(
            @PathVariable Long id) {

        departmentService.deleteDepartment(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Department deleted successfully.",
                        null
                )
        );
    }
}