package com.prangyajeet.labtrack.inventorytransaction.controller;

import com.prangyajeet.labtrack.common.enums.TransactionType;
import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.inventorytransaction.dto.InventoryTransactionRequestDTO;
import com.prangyajeet.labtrack.inventorytransaction.dto.InventoryTransactionResponseDTO;
import com.prangyajeet.labtrack.inventorytransaction.service.InventoryTransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory-transactions")
public class InventoryTransactionController {

    private final InventoryTransactionService inventoryTransactionService;

    public InventoryTransactionController(
            InventoryTransactionService inventoryTransactionService) {
        this.inventoryTransactionService = inventoryTransactionService;
    }

    /**
     * Create Inventory Transaction
     */
    @PostMapping
    public ResponseEntity<ApiResponse<InventoryTransactionResponseDTO>> createTransaction(
            @Valid @RequestBody InventoryTransactionRequestDTO requestDTO) {

        InventoryTransactionResponseDTO response =
                inventoryTransactionService.createTransaction(requestDTO);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory transaction created successfully",
                        response
                )
        );
    }

    /**
     * Get All Transactions
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryTransactionResponseDTO>>> getAllTransactions() {

        List<InventoryTransactionResponseDTO> response =
                inventoryTransactionService.getAllTransactions();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory transactions fetched successfully",
                        response
                )
        );
    }

    /**
     * Get Transaction By ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryTransactionResponseDTO>> getTransactionById(
            @PathVariable Long id) {

        InventoryTransactionResponseDTO response =
                inventoryTransactionService.getTransactionById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory transaction fetched successfully",
                        response
                )
        );
    }

    /**
     * Get Transactions By Inventory Item
     */
    @GetMapping("/inventory/{inventoryItemId}")
    public ResponseEntity<ApiResponse<List<InventoryTransactionResponseDTO>>> getTransactionsByInventoryItem(
            @PathVariable Long inventoryItemId) {

        List<InventoryTransactionResponseDTO> response =
                inventoryTransactionService
                        .getTransactionsByInventoryItem(inventoryItemId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory transactions fetched successfully",
                        response
                )
        );
    }

    /**
     * Get Transactions By Type
     */
    @GetMapping("/type/{transactionType}")
    public ResponseEntity<ApiResponse<List<InventoryTransactionResponseDTO>>> getTransactionsByType(
            @PathVariable TransactionType transactionType) {

        List<InventoryTransactionResponseDTO> response =
                inventoryTransactionService
                        .getTransactionsByType(transactionType);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory transactions fetched successfully",
                        response
                )
        );
    }

    /**
     * Get Transactions Between Dates
     */
    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<InventoryTransactionResponseDTO>>> getTransactionsByDateRange(

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate) {

        List<InventoryTransactionResponseDTO> response =
                inventoryTransactionService
                        .getTransactionsByDateRange(startDate, endDate);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory transactions fetched successfully",
                        response
                )
        );
    }

    /**
     * Delete Transaction (Soft Delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @PathVariable Long id) {

        inventoryTransactionService.deleteTransaction(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inventory transaction deleted successfully",
                        null
                )
        );
    }

}