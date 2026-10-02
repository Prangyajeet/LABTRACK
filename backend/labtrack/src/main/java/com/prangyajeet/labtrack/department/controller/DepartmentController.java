package com.prangyajeet.labtrack.department.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.department.dto.DepartmentDropdownDTO;
import com.prangyajeet.labtrack.department.dto.DepartmentRequestDTO;
import com.prangyajeet.labtrack.department.dto.DepartmentResponseDTO;
import com.prangyajeet.labtrack.department.export.DepartmentExcelExporter;
import com.prangyajeet.labtrack.department.service.DepartmentService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    private final DepartmentExcelExporter departmentExcelExporter;

    public DepartmentController(
            DepartmentService departmentService,
            DepartmentExcelExporter departmentExcelExporter) {

        this.departmentService =
                departmentService;

        this.departmentExcelExporter =
                departmentExcelExporter;
    }

    /*
     * ============================================================
     * GET ALL DEPARTMENTS
     * ADMIN + FACULTY + TECHNICIAN
     * ============================================================
     */

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<DepartmentResponseDTO>>>
    getAllDepartments() {

        List<DepartmentResponseDTO> departments =
                departmentService.getAllDepartments();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Departments fetched successfully.",
                        departments
                )
        );
    }

    /*
     * ============================================================
     * DEPARTMENT DROPDOWN
     * ADMIN + FACULTY + TECHNICIAN
     * ============================================================
     */

    @GetMapping("/dropdown")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<DepartmentDropdownDTO>>>
    getDepartmentDropdown() {

        List<DepartmentDropdownDTO> departments =
                departmentService.getAllDepartments()
                        .stream()
                        .map(department ->
                                new DepartmentDropdownDTO(
                                        department.getId(),
                                        department.getDepartmentName()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Departments dropdown fetched successfully.",
                        departments
                )
        );
    }

    /*
     * ============================================================
     * GET DEPARTMENT BY ID
     * ADMIN + FACULTY + TECHNICIAN
     * ============================================================
     */

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<DepartmentResponseDTO>>
    getDepartmentById(
            @PathVariable Long id) {

        DepartmentResponseDTO department =
                departmentService.getDepartmentById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Department fetched successfully.",
                        department
                )
        );
    }

    /*
     * ============================================================
     * CREATE DEPARTMENT
     * ADMIN ONLY
     * ============================================================
     */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponseDTO>>
    createDepartment(
            @RequestBody DepartmentRequestDTO requestDTO) {

        DepartmentResponseDTO department =
                departmentService.createDepartment(
                        requestDTO
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Department created successfully.",
                        department
                )
        );
    }

    /*
     * ============================================================
     * UPDATE DEPARTMENT
     * ADMIN ONLY
     * ============================================================
     */

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponseDTO>>
    updateDepartment(
            @PathVariable Long id,
            @RequestBody DepartmentRequestDTO requestDTO) {

        DepartmentResponseDTO department =
                departmentService.updateDepartment(
                        id,
                        requestDTO
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Department updated successfully.",
                        department
                )
        );
    }

    /*
     * ============================================================
     * SOFT DELETE DEPARTMENT
     * ADMIN ONLY
     * ============================================================
     */

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>>
    deleteDepartment(
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

    /*
     * ============================================================
     * RESTORE DEPARTMENT
     * ADMIN ONLY
     * ============================================================
     */

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>>
    restoreDepartment(
            @PathVariable Long id) {

        departmentService.restoreDepartment(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Department restored successfully.",
                        null
                )
        );
    }

    /*
     * ============================================================
     * EXPORT DEPARTMENTS TO EXCEL
     * ADMIN + FACULTY + TECHNICIAN
     * ============================================================
     */

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<byte[]>
    exportDepartments() {

        byte[] file =
                departmentExcelExporter.export(
                        departmentService.getAllDepartments()
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Departments.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(file);
    }
}