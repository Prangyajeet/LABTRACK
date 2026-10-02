package com.prangyajeet.labtrack.inventory.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.inventory.dto.InventoryRequestDTO;
import com.prangyajeet.labtrack.inventory.dto.InventoryResponseDTO;
import com.prangyajeet.labtrack.inventory.service.InventoryService;
import org.jspecify.annotations.Nullable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(
            InventoryService inventoryService) {

        this.inventoryService = inventoryService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> createInventoryItem(
            @Valid @RequestBody InventoryRequestDTO requestDTO) {

        InventoryResponseDTO response =
                inventoryService.createInventoryItem(requestDTO);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory item created successfully",
                        response
                )
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> getAllInventoryItems() {

        List<InventoryResponseDTO> response =
                inventoryService.getAllInventoryItems();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory items fetched successfully",
                        response
                )
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> getInventoryItemById(
            @PathVariable Long id) {

        InventoryResponseDTO response =
                inventoryService.getInventoryItemById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory item fetched successfully",
                        response
                )
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> updateInventoryItem(
            @PathVariable Long id,
            @Valid @RequestBody InventoryRequestDTO requestDTO) {

        InventoryResponseDTO response =
                inventoryService.updateInventoryItem(id, requestDTO);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory item updated successfully",
                        response
                )
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> deleteInventoryItem(
            @PathVariable Long id) {

        inventoryService.deleteInventoryItem(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory item deleted successfully",
                        "SUCCESS"
                )
        );
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> searchInventoryItems(
            @RequestParam String keyword) {

        List<InventoryResponseDTO> response =
                inventoryService.searchInventoryItems(keyword);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Search completed successfully",
                        response
                )
        );
    }

    @GetMapping("/category/{categoryId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> getByCategory(
            @PathVariable Long categoryId) {

        List<InventoryResponseDTO> response =
                inventoryService.getInventoryByCategory(categoryId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory items fetched successfully",
                        response
                )
        );
    }

    @GetMapping("/supplier/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> getBySupplier(
            @PathVariable Long supplierId) {

        List<InventoryResponseDTO> response =
                inventoryService.getInventoryBySupplier(supplierId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory items fetched successfully",
                        response
                )
        );
    }

    @GetMapping("/storage-location/{locationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> getByStorageLocation(
            @PathVariable Long locationId) {

        List<InventoryResponseDTO> response =
                inventoryService.getInventoryByStorageLocation(locationId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory items fetched successfully",
                        response
                )
        );
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> getLowStockItems() {

        List<InventoryResponseDTO> response =
                inventoryService.getLowStockItems();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Low stock items fetched successfully",
                        response
                )
        );
    }

    @GetMapping("/expired")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> getExpiredItems() {

        List<InventoryResponseDTO> response =
                inventoryService.getExpiredItems();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Expired items fetched successfully",
                        response
                )
        );
    }

    @GetMapping("/expiring-soon")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<@Nullable Object> getExpiringSoonItems(
            @RequestParam(defaultValue = "30") int days) {

        List<InventoryResponseDTO> response =
                inventoryService.getExpiringSoonItems(days);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Expiring soon items fetched successfully",
                        response
                )
        );
    }
}