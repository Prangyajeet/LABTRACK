package com.prangyajeet.labtrack.inventory.serviceImpl;

import com.prangyajeet.labtrack.category.entity.Category;
import com.prangyajeet.labtrack.category.repository.CategoryRepository;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.inventory.dto.InventoryRequestDTO;
import com.prangyajeet.labtrack.inventory.dto.InventoryResponseDTO;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;
import com.prangyajeet.labtrack.inventory.repository.InventoryRepository;
import com.prangyajeet.labtrack.inventory.service.InventoryService;
import com.prangyajeet.labtrack.storage.entity.StorageLocation;
import com.prangyajeet.labtrack.storage.repository.StorageLocationRepository;
import com.prangyajeet.labtrack.supplier.entity.Supplier;
import com.prangyajeet.labtrack.supplier.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final StorageLocationRepository storageLocationRepository;

    public InventoryServiceImpl(
            InventoryRepository inventoryRepository,
            CategoryRepository categoryRepository,
            SupplierRepository supplierRepository,
            StorageLocationRepository storageLocationRepository) {

        this.inventoryRepository = inventoryRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.storageLocationRepository = storageLocationRepository;
    }

    @Override
    public InventoryResponseDTO createInventoryItem(InventoryRequestDTO requestDTO) {

        Category category = categoryRepository
                .findByIdAndStatus(requestDTO.getCategoryId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        Supplier supplier = supplierRepository
                .findByIdAndStatus(requestDTO.getSupplierId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found"));

        StorageLocation location = storageLocationRepository
                .findByIdAndStatus(requestDTO.getStorageLocationId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Storage Location not found"));

        InventoryItem item = new InventoryItem();

        item.setItemCode(generateItemCode());
        item.setItemName(requestDTO.getItemName());
        item.setDescription(requestDTO.getDescription());
        item.setCategory(category);
        item.setSupplier(supplier);
        item.setStorageLocation(location);
        item.setUnit(requestDTO.getUnit());
        item.setQuantity(requestDTO.getQuantity());
        item.setMinimumQuantity(requestDTO.getMinimumQuantity());
        item.setMaximumQuantity(requestDTO.getMaximumQuantity());
        item.setUnitPrice(requestDTO.getUnitPrice());
        item.setBatchNumber(requestDTO.getBatchNumber());
        item.setManufactureDate(requestDTO.getManufactureDate());
        item.setExpiryDate(requestDTO.getExpiryDate());
        item.setRemarks(requestDTO.getRemarks());
        item.setStatus(Status.ACTIVE);

        InventoryItem savedItem = inventoryRepository.save(item);

        return mapToResponse(savedItem);
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryResponseDTO getInventoryItemById(Long id) {

        InventoryItem item = inventoryRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Inventory Item not found"));

        return mapToResponse(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO> getAllInventoryItems() {

        return inventoryRepository
                .findAllByStatus(Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private String generateItemCode() {

        long count = inventoryRepository.count() + 1;

        return String.format("LAB%06d", count);
    }

    private InventoryResponseDTO mapToResponse(InventoryItem item) {

        InventoryResponseDTO dto = new InventoryResponseDTO();

        dto.setId(item.getId());
        dto.setItemCode(item.getItemCode());
        dto.setItemName(item.getItemName());
        dto.setDescription(item.getDescription());

        dto.setCategoryId(item.getCategory().getId());
        dto.setCategoryName(item.getCategory().getCategoryName());

        dto.setSupplierId(item.getSupplier().getId());
        dto.setSupplierName(item.getSupplier().getSupplierName());

        dto.setStorageLocationId(item.getStorageLocation().getId());
        dto.setStorageLocationName(item.getStorageLocation().getLocationName());

        dto.setUnit(item.getUnit());
        dto.setQuantity(item.getQuantity());
        dto.setMinimumQuantity(item.getMinimumQuantity());
        dto.setMaximumQuantity(item.getMaximumQuantity());
        dto.setUnitPrice(item.getUnitPrice());

        dto.setBatchNumber(item.getBatchNumber());
        dto.setManufactureDate(item.getManufactureDate());
        dto.setExpiryDate(item.getExpiryDate());

        dto.setRemarks(item.getRemarks());

        dto.setStatus(item.getStatus().name());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());

        return dto;
    }    @Override
    public InventoryResponseDTO updateInventoryItem(
            Long id,
            InventoryRequestDTO requestDTO) {

        InventoryItem item = inventoryRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Inventory Item not found"));

        Category category = categoryRepository
                .findByIdAndStatus(requestDTO.getCategoryId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        Supplier supplier = supplierRepository
                .findByIdAndStatus(requestDTO.getSupplierId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found"));

        StorageLocation location = storageLocationRepository
                .findByIdAndStatus(requestDTO.getStorageLocationId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Storage Location not found"));

        item.setItemName(requestDTO.getItemName());
        item.setDescription(requestDTO.getDescription());
        item.setCategory(category);
        item.setSupplier(supplier);
        item.setStorageLocation(location);
        item.setUnit(requestDTO.getUnit());
        item.setQuantity(requestDTO.getQuantity());
        item.setMinimumQuantity(requestDTO.getMinimumQuantity());
        item.setMaximumQuantity(requestDTO.getMaximumQuantity());
        item.setUnitPrice(requestDTO.getUnitPrice());
        item.setBatchNumber(requestDTO.getBatchNumber());
        item.setManufactureDate(requestDTO.getManufactureDate());
        item.setExpiryDate(requestDTO.getExpiryDate());
        item.setRemarks(requestDTO.getRemarks());

        InventoryItem updatedItem = inventoryRepository.save(item);

        return mapToResponse(updatedItem);
    }

    @Override
    public void deleteInventoryItem(Long id) {

        InventoryItem item = inventoryRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Inventory Item not found"));

        item.setStatus(Status.INACTIVE);

        inventoryRepository.save(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO> searchInventoryItems(String keyword) {

        return inventoryRepository
                .findByItemNameContainingIgnoreCaseAndStatus(
                        keyword,
                        Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO> getInventoryByCategory(Long categoryId) {

        return inventoryRepository
                .findByCategoryIdAndStatus(categoryId, Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO> getInventoryBySupplier(Long supplierId) {

        return inventoryRepository
                .findBySupplierIdAndStatus(supplierId, Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO> getInventoryByStorageLocation(Long storageLocationId) {

        return inventoryRepository
                .findByStorageLocationIdAndStatus(
                        storageLocationId,
                        Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO> getLowStockItems() {

        return inventoryRepository
                .findAllByStatus(Status.ACTIVE)
                .stream()
                .filter(item ->
                        item.getQuantity() <= item.getMinimumQuantity())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO> getExpiredItems() {

        return inventoryRepository
                .findByExpiryDateBeforeAndStatus(
                        java.time.LocalDate.now(),
                        Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponseDTO> getExpiringSoonItems(int days) {

        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate endDate = today.plusDays(days);

        return inventoryRepository
                .findByExpiryDateBetweenAndStatus(
                        today,
                        endDate,
                        Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}