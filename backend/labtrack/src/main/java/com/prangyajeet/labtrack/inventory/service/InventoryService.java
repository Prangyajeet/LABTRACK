package com.prangyajeet.labtrack.inventory.service;

import com.prangyajeet.labtrack.inventory.dto.InventoryRequestDTO;
import com.prangyajeet.labtrack.inventory.dto.InventoryResponseDTO;

import java.util.List;

public interface InventoryService {

    InventoryResponseDTO createInventoryItem(InventoryRequestDTO requestDTO);

    InventoryResponseDTO getInventoryItemById(Long id);
    void updateInventoryQuantity(Long inventoryItemId, Integer quantity);

    List<InventoryResponseDTO> getAllInventoryItems();

    InventoryResponseDTO updateInventoryItem(
            Long id,
            InventoryRequestDTO requestDTO
    );

    void deleteInventoryItem(Long id);

    List<InventoryResponseDTO> searchInventoryItems(String keyword);

    List<InventoryResponseDTO> getInventoryByCategory(Long categoryId);

    List<InventoryResponseDTO> getInventoryBySupplier(Long supplierId);

    List<InventoryResponseDTO> getInventoryByStorageLocation(Long storageLocationId);

    List<InventoryResponseDTO> getLowStockItems();

    List<InventoryResponseDTO> getExpiredItems();

    List<InventoryResponseDTO> getExpiringSoonItems(int days);

}