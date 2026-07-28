package com.prangyajeet.labtrack.inventory.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.inventory.dto.InventoryRequestDTO;
import com.prangyajeet.labtrack.inventory.dto.InventoryResponseDTO;
import com.prangyajeet.labtrack.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public ResponseEntity<@Nullable Object> createInventoryItem(
            @Valid @RequestBody InventoryRequestDTO requestDTO) {

        InventoryResponseDTO response =
                inventoryService.createInventoryItem(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Inventory item created successfully",
                        response
                ));
    }

    @GetMapping("/{id}")
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

    @GetMapping
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

    @PutMapping("/{id}")
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