package com.prangyajeet.labtrack.breakage.controller;

import com.prangyajeet.labtrack.breakage.dto.BreakageRequestDTO;
import com.prangyajeet.labtrack.breakage.dto.BreakageResponseDTO;
import com.prangyajeet.labtrack.breakage.dto.BreakageSummaryDTO;
import com.prangyajeet.labtrack.breakage.entity.BreakagePersonType;
import com.prangyajeet.labtrack.breakage.entity.BreakageRecoveryStatus;
import com.prangyajeet.labtrack.breakage.service.BreakageService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/breakages")
public class BreakageController {

    private final BreakageService breakageService;

    public BreakageController(
            BreakageService breakageService) {

        this.breakageService = breakageService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<BreakageResponseDTO> createBreakage(
            @RequestBody BreakageRequestDTO requestDTO) {

        BreakageResponseDTO result =
                breakageService.createBreakage(requestDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(result);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<Page<BreakageResponseDTO>> getBreakages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false)
            BreakagePersonType personType,
            @RequestParam(required = false)
            BreakageRecoveryStatus recoveryStatus,
            @RequestParam(defaultValue = "breakageDateTime")
            String sortBy,
            @RequestParam(defaultValue = "desc")
            String sortDirection) {

        return ResponseEntity.ok(
                breakageService.getBreakages(
                        page,
                        size,
                        search,
                        personType,
                        recoveryStatus,
                        sortBy,
                        sortDirection));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<BreakageSummaryDTO> getSummary() {

        return ResponseEntity.ok(
                breakageService.getSummary());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<BreakageResponseDTO> getBreakageById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                breakageService.getBreakageById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<BreakageResponseDTO> updateBreakage(
            @PathVariable Long id,
            @RequestBody BreakageRequestDTO requestDTO) {

        BreakageResponseDTO result =
                breakageService.updateBreakage(
                        id,
                        requestDTO);

        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}/recovery-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<BreakageResponseDTO>
    updateRecoveryStatus(
            @PathVariable Long id,
            @RequestParam
            BreakageRecoveryStatus recoveryStatus) {

        return ResponseEntity.ok(
                breakageService.updateRecoveryStatus(
                        id,
                        recoveryStatus));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Void> deleteBreakage(
            @PathVariable Long id) {

        breakageService.deleteBreakage(id);

        return ResponseEntity.noContent().build();
    }
}