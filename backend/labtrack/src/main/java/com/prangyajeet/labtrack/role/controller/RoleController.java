package com.prangyajeet.labtrack.role.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.role.dto.RoleRequestDTO;
import com.prangyajeet.labtrack.role.dto.RoleResponseDTO;
import com.prangyajeet.labtrack.role.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponseDTO>>> getAllRoles() {

        List<RoleResponseDTO> roles = roleService.getAllRoles();

        ApiResponse<List<RoleResponseDTO>> response =
                new ApiResponse<>(
                        true,
                        "Roles fetched successfully.",
                        roles
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> getRoleById(
            @PathVariable Long id) {

        RoleResponseDTO role = roleService.getRoleById(id);

        ApiResponse<RoleResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Role fetched successfully.",
                        role
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponseDTO>> createRole(
            @Valid @RequestBody RoleRequestDTO dto) {

        RoleResponseDTO role = roleService.createRole(dto);

        ApiResponse<RoleResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Role created successfully.",
                        role
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleRequestDTO dto) {

        RoleResponseDTO role = roleService.updateRole(id, dto);

        ApiResponse<RoleResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Role updated successfully.",
                        role
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRole(
            @PathVariable Long id) {

        roleService.deleteRole(id);

        ApiResponse<Void> response =
                new ApiResponse<>(
                        true,
                        "Role deleted successfully.",
                        null
                );

        return ResponseEntity.ok(response);
    }
}