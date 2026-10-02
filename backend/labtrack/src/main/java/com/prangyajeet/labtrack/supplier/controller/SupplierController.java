package com.prangyajeet.labtrack.supplier.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.supplier.dto.SupplierRequestDTO;
import com.prangyajeet.labtrack.supplier.dto.SupplierResponseDTO;
import com.prangyajeet.labtrack.supplier.service.SupplierExportService;
import com.prangyajeet.labtrack.supplier.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;
    private final SupplierExportService supplierExportService;

    public SupplierController(
            SupplierService supplierService,
            SupplierExportService supplierExportService) {

        this.supplierService = supplierService;
        this.supplierExportService = supplierExportService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SupplierResponseDTO>> createSupplier(
            @Valid @RequestBody SupplierRequestDTO supplierRequestDTO) {

        SupplierResponseDTO supplier =
                supplierService.createSupplier(supplierRequestDTO);

        ApiResponse<SupplierResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Supplier created successfully.",
                        supplier
                );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /*
     * IMPORTANT:
     * Keep the export endpoint BEFORE the {supplierId} endpoint.
     *
     * This prevents:
     * /api/suppliers/export
     *
     * from being interpreted as:
     * /api/suppliers/{supplierId}
     */

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<byte[]> exportSuppliers() {

        byte[] excelFile =
                supplierExportService.exportSuppliers();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Suppliers.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelFile);
    }

    @GetMapping("/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<SupplierResponseDTO>> getSupplierById(
            @PathVariable Long supplierId) {

        SupplierResponseDTO supplier =
                supplierService.getSupplierById(supplierId);

        ApiResponse<SupplierResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Supplier fetched successfully.",
                        supplier
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<SupplierResponseDTO>>> getAllSuppliers() {

        List<SupplierResponseDTO> suppliers =
                supplierService.getAllSuppliers();

        ApiResponse<List<SupplierResponseDTO>> response =
                new ApiResponse<>(
                        true,
                        "Suppliers fetched successfully.",
                        suppliers
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{supplierId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SupplierResponseDTO>> updateSupplier(
            @PathVariable Long supplierId,
            @Valid @RequestBody SupplierRequestDTO supplierRequestDTO) {

        SupplierResponseDTO supplier =
                supplierService.updateSupplier(
                        supplierId,
                        supplierRequestDTO
                );

        ApiResponse<SupplierResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Supplier updated successfully.",
                        supplier
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{supplierId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteSupplier(
            @PathVariable Long supplierId) {

        supplierService.deleteSupplier(supplierId);

        ApiResponse<String> response =
                new ApiResponse<>(
                        true,
                        "Supplier deleted successfully.",
                        null
                );

        return ResponseEntity.ok(response);
    }
}