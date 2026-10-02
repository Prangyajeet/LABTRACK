package com.prangyajeet.labtrack.equipment.controller;

import com.prangyajeet.labtrack.equipment.dto.EquipmentRequestDTO;
import com.prangyajeet.labtrack.equipment.dto.EquipmentResponseDTO;
import com.prangyajeet.labtrack.equipment.dto.MaintenanceLogRequestDTO;
import com.prangyajeet.labtrack.equipment.dto.MaintenanceLogResponseDTO;
import com.prangyajeet.labtrack.equipment.entity.EquipmentCategory;
import com.prangyajeet.labtrack.equipment.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;

    public EquipmentController(
            EquipmentService equipmentService) {

        this.equipmentService = equipmentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<EquipmentResponseDTO> createEquipment(
            @Valid @RequestBody EquipmentRequestDTO requestDTO) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        equipmentService.createEquipment(
                                requestDTO));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<EquipmentResponseDTO>>
    getAllEquipment() {

        return ResponseEntity.ok(
                equipmentService.getAllEquipment());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<EquipmentResponseDTO>
    getEquipmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                equipmentService.getEquipmentById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<EquipmentResponseDTO>>
    searchEquipment(
            @RequestParam String query) {

        return ResponseEntity.ok(
                equipmentService.searchEquipment(query));
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<EquipmentResponseDTO>>
    getEquipmentByCategory(
            @PathVariable EquipmentCategory category) {

        return ResponseEntity.ok(
                equipmentService.getEquipmentByCategory(
                        category));
    }

    @GetMapping("/amc/expiring")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<EquipmentResponseDTO>>
    getAmcExpiringSoon() {

        return ResponseEntity.ok(
                equipmentService.getAmcExpiringSoon());
    }

    @GetMapping("/amc/expired")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<EquipmentResponseDTO>>
    getAmcExpired() {

        return ResponseEntity.ok(
                equipmentService.getAmcExpired());
    }

    @GetMapping("/maintenance/due")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<EquipmentResponseDTO>>
    getMaintenanceDue() {

        return ResponseEntity.ok(
                equipmentService.getMaintenanceDue());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<EquipmentResponseDTO>
    updateEquipment(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentRequestDTO requestDTO) {

        return ResponseEntity.ok(
                equipmentService.updateEquipment(
                        id,
                        requestDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Void> deleteEquipment(
            @PathVariable Long id) {

        equipmentService.deleteEquipment(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Void> restoreEquipment(
            @PathVariable Long id) {

        equipmentService.restoreEquipment(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<MaintenanceLogResponseDTO>
    createMaintenanceLog(
            @Valid @RequestBody
            MaintenanceLogRequestDTO requestDTO) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        equipmentService
                                .createMaintenanceLog(
                                        requestDTO));
    }

    @GetMapping("/{equipmentId}/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<MaintenanceLogResponseDTO>>
    getMaintenanceLogs(
            @PathVariable Long equipmentId) {

        return ResponseEntity.ok(
                equipmentService.getMaintenanceLogs(
                        equipmentId));
    }

    @GetMapping("/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<MaintenanceLogResponseDTO>>
    getAllMaintenanceLogs() {

        return ResponseEntity.ok(
                equipmentService.getAllMaintenanceLogs());
    }
}