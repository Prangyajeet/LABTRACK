package com.prangyajeet.labtrack.dailyconsumable.serviceImpl;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableResponseDTO;
import com.prangyajeet.labtrack.dailyconsumable.service.DailyConsumableService;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;
import com.prangyajeet.labtrack.inventory.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DailyConsumableServiceImpl implements DailyConsumableService {

    private final InventoryRepository inventoryRepository;

    public DailyConsumableServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public List<DailyConsumableResponseDTO> getAllConsumables() {

        return inventoryRepository
                .findByIsConsumableTrueAndStatus(Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DailyConsumableResponseDTO getConsumableById(Long id) {

        InventoryItem item = inventoryRepository
                .findByIdAndIsConsumableTrueAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Daily Consumable not found"));

        return mapToResponse(item);
    }

    @Override
    public List<DailyConsumableResponseDTO> getLowStockConsumables() {

        return inventoryRepository
                .findByIsConsumableTrueAndStatus(Status.ACTIVE)
                .stream()
                .filter(item -> item.getQuantity() <= item.getMinimumQuantity())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DailyConsumableResponseDTO mapToResponse(InventoryItem item) {

        DailyConsumableResponseDTO dto = new DailyConsumableResponseDTO();

        dto.setId(item.getId());
        dto.setItemCode(item.getItemCode());
        dto.setItemName(item.getItemName());
        dto.setDescription(item.getDescription());

        dto.setCategoryName(item.getCategory().getCategoryName());
        dto.setSupplierName(item.getSupplier().getSupplierName());
        dto.setStorageLocationName(item.getStorageLocation().getLocationName());

        dto.setUnit(item.getUnit());

        dto.setQuantity(item.getQuantity());
        dto.setMinimumQuantity(item.getMinimumQuantity());
        dto.setReorderQuantity(item.getReorderQuantity());

        dto.setUnitPrice(item.getUnitPrice());

        dto.setBatchNumber(item.getBatchNumber());

        dto.setManufactureDate(item.getManufactureDate());
        dto.setExpiryDate(item.getExpiryDate());

        dto.setRemarks(item.getRemarks());

        return dto;
    }
}