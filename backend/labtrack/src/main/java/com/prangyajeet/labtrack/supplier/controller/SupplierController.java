package com.prangyajeet.labtrack.supplier.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.supplier.dto.SupplierRequestDTO;
import com.prangyajeet.labtrack.supplier.dto.SupplierResponseDTO;
import com.prangyajeet.labtrack.supplier.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
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

    @GetMapping("/{supplierId}")
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