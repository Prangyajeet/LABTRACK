package com.prangyajeet.labtrack.item.serviceImpl;

import com.prangyajeet.labtrack.category.entity.Category;
import com.prangyajeet.labtrack.category.repository.CategoryRepository;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.common.response.PageResponse;
import com.prangyajeet.labtrack.exception.custom.BadRequestException;
import com.prangyajeet.labtrack.exception.custom.DuplicateResourceException;
import com.prangyajeet.labtrack.exception.custom.ResourceNotFoundException;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;
import com.prangyajeet.labtrack.inventory.repository.InventoryRepository;
import com.prangyajeet.labtrack.item.dto.ItemRequestDTO;
import com.prangyajeet.labtrack.item.dto.ItemResponseDTO;
import com.prangyajeet.labtrack.item.entity.Item;
import com.prangyajeet.labtrack.item.export.ItemExcelExporter;
import com.prangyajeet.labtrack.item.repository.ItemRepository;
import com.prangyajeet.labtrack.item.service.ItemService;
import com.prangyajeet.labtrack.storage.entity.StorageLocation;
import com.prangyajeet.labtrack.storage.repository.StorageLocationRepository;
import com.prangyajeet.labtrack.supplier.entity.Supplier;
import com.prangyajeet.labtrack.supplier.repository.SupplierRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    private final CategoryRepository categoryRepository;

    private final InventoryRepository inventoryRepository;

    private final SupplierRepository supplierRepository;

    private final StorageLocationRepository storageLocationRepository;


    public ItemServiceImpl(
            ItemRepository itemRepository,
            CategoryRepository categoryRepository,
            InventoryRepository inventoryRepository,
            SupplierRepository supplierRepository,
            StorageLocationRepository storageLocationRepository
    ) {

        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.inventoryRepository = inventoryRepository;
        this.supplierRepository = supplierRepository;
        this.storageLocationRepository = storageLocationRepository;

    }


    // =========================================================
    // GET ALL ITEMS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ItemResponseDTO> getAllItems(
            int page,
            int size,
            String sortBy,
            String sortDirection,
            String search
    ) {

        Sort sort =
                sortDirection.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        sort
                );

        Page<Item> itemPage =
                itemRepository
                        .findByStatusAndItemNameContainingIgnoreCase(
                                Status.ACTIVE,
                                search,
                                pageable
                        );

        List<ItemResponseDTO> dtoList =
                itemPage
                        .getContent()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        return new PageResponse<>(
                dtoList,
                itemPage.getNumber(),
                itemPage.getSize(),
                itemPage.getTotalElements(),
                itemPage.getTotalPages(),
                itemPage.isFirst(),
                itemPage.isLast()
        );
    }


    // =========================================================
    // CREATE ITEM
    // =========================================================

    @Override
    public ItemResponseDTO createItem(
            ItemRequestDTO requestDTO
    ) {

        Category category =
                categoryRepository
                        .findByIdAndStatus(
                                requestDTO.getCategoryId(),
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found."
                                )
                        );


        if (
                itemRepository
                        .existsByCategoryIdAndItemNameAndStatus(
                                requestDTO.getCategoryId(),
                                requestDTO.getItemName(),
                                Status.ACTIVE
                        )
        ) {

            throw new DuplicateResourceException(
                    "Item already exists in this category."
            );
        }


        Item item = new Item();

        item.setItemName(
                requestDTO.getItemName()
        );

        item.setItemCode(
                generateItemCode()
        );

        item.setCategory(
                category
        );

        item.setItemType(
                requestDTO.getItemType()
        );


        item.setUnit(
                requestDTO.getUnit()
        );

        item.setOpeningStock(
                requestDTO.getOpeningStock()
        );

        item.setCurrentStock(
                requestDTO.getCurrentStock()
        );

        item.setMinimumStock(
                requestDTO.getMinimumStock()
        );

        item.setMaximumStock(
                requestDTO.getMaximumStock()
        );


        item.setSupplierName(
                requestDTO.getSupplierName()
        );

        item.setManufacturerName(
                requestDTO.getManufacturerName()
        );

        item.setBrandName(
                requestDTO.getBrandName()
        );

        item.setPurchaseDate(
                requestDTO.getPurchaseDate()
        );

        item.setPurchasePrice(
                requestDTO.getPurchasePrice()
        );

        item.setInvoiceNumber(
                requestDTO.getInvoiceNumber()
        );

        item.setPurchaseOrderNumber(
                requestDTO.getPurchaseOrderNumber()
        );

        item.setBatchNumber(
                requestDTO.getBatchNumber()
        );

        item.setSerialNumber(
                requestDTO.getSerialNumber()
        );

        item.setManufacturingDate(
                requestDTO.getManufacturingDate()
        );

        item.setReceivingDate(
                requestDTO.getReceivingDate()
        );

        item.setWarrantyExpiry(
                requestDTO.getWarrantyExpiry()
        );


        item.setStorageLocation(
                requestDTO.getStorageLocation()
        );

        item.setRackNumber(
                requestDTO.getRackNumber()
        );

        item.setShelfNumber(
                requestDTO.getShelfNumber()
        );

        item.setCabinetNumber(
                requestDTO.getCabinetNumber()
        );

        item.setExpiryDate(
                requestDTO.getExpiryDate()
        );


        item.setReorderQuantity(
                requestDTO.getReorderQuantity()
        );

        item.setHazardLevel(
                requestDTO.getHazardLevel()
        );

        item.setStorageCondition(
                requestDTO.getStorageCondition()
        );

        item.setDescription(
                requestDTO.getDescription()
        );

        item.setRemarks(
                requestDTO.getRemarks()
        );

        item.setStatus(
                Status.ACTIVE
        );


        item =
                itemRepository.save(item);


        createInventoryItemFromMasterItem(
                item
        );


        return mapToResponse(
                item
        );
    }


    // =========================================================
    // GET ITEM BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ItemResponseDTO getItemById(
            Long id
    ) {

        Item item =
                itemRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Item not found."
                                )
                        );

        return mapToResponse(item);
    }


    // =========================================================
    // UPDATE ITEM
    // =========================================================

    @Override
    public ItemResponseDTO updateItem(
            Long id,
            ItemRequestDTO requestDTO
    ) {

        Item item =
                itemRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Item not found."
                                )
                        );


        Category category =
                categoryRepository
                        .findByIdAndStatus(
                                requestDTO.getCategoryId(),
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found."
                                )
                        );


        if (
                (
                        !item.getItemName()
                                .equalsIgnoreCase(
                                        requestDTO.getItemName()
                                )
                        ||
                        !item.getCategory()
                                .getId()
                                .equals(
                                        requestDTO.getCategoryId()
                                )
                )
                &&
                itemRepository
                        .existsByCategoryIdAndItemNameAndStatus(
                                requestDTO.getCategoryId(),
                                requestDTO.getItemName(),
                                Status.ACTIVE
                        )
        ) {

            throw new DuplicateResourceException(
                    "Item already exists in this category."
            );
        }


        // =====================================================
        // UPDATE MASTER ITEM
        // =====================================================

        item.setItemName(
                requestDTO.getItemName()
        );

        item.setCategory(
                category
        );

        item.setItemType(
                requestDTO.getItemType()
        );


        item.setUnit(
                requestDTO.getUnit()
        );

        item.setOpeningStock(
                requestDTO.getOpeningStock()
        );

        item.setCurrentStock(
                requestDTO.getCurrentStock()
        );

        item.setMinimumStock(
                requestDTO.getMinimumStock()
        );

        item.setMaximumStock(
                requestDTO.getMaximumStock()
        );


        item.setSupplierName(
                requestDTO.getSupplierName()
        );

        item.setManufacturerName(
                requestDTO.getManufacturerName()
        );

        item.setBrandName(
                requestDTO.getBrandName()
        );

        item.setPurchaseDate(
                requestDTO.getPurchaseDate()
        );

        item.setPurchasePrice(
                requestDTO.getPurchasePrice()
        );

        item.setInvoiceNumber(
                requestDTO.getInvoiceNumber()
        );

        item.setPurchaseOrderNumber(
                requestDTO.getPurchaseOrderNumber()
        );

        item.setBatchNumber(
                requestDTO.getBatchNumber()
        );

        item.setSerialNumber(
                requestDTO.getSerialNumber()
        );

        item.setManufacturingDate(
                requestDTO.getManufacturingDate()
        );

        item.setReceivingDate(
                requestDTO.getReceivingDate()
        );

        item.setWarrantyExpiry(
                requestDTO.getWarrantyExpiry()
        );


        item.setStorageLocation(
                requestDTO.getStorageLocation()
        );

        item.setRackNumber(
                requestDTO.getRackNumber()
        );

        item.setShelfNumber(
                requestDTO.getShelfNumber()
        );

        item.setCabinetNumber(
                requestDTO.getCabinetNumber()
        );

        item.setExpiryDate(
                requestDTO.getExpiryDate()
        );


        item.setReorderQuantity(
                requestDTO.getReorderQuantity()
        );

        item.setHazardLevel(
                requestDTO.getHazardLevel()
        );

        item.setStorageCondition(
                requestDTO.getStorageCondition()
        );

        item.setDescription(
                requestDTO.getDescription()
        );

        item.setRemarks(
                requestDTO.getRemarks()
        );


        item =
                itemRepository.save(item);


        // =====================================================
        // SYNCHRONIZE INVENTORY ITEM
        // =====================================================

        synchronizeInventoryItem(
                item
        );


        return mapToResponse(item);
    }


    // =========================================================
    // RESTORE ITEM
    // =========================================================

    @Override
    public ItemResponseDTO restoreItem(
            Long id
    ) {

        Item item =
                itemRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Item not found."
                                )
                        );


        if (
                item.getStatus() == Status.ACTIVE
        ) {

            throw new BadRequestException(
                    "Item is already active."
            );
        }


        item.setStatus(
                Status.ACTIVE
        );

        item =
                itemRepository.save(item);


        createInventoryItemFromMasterItem(
                item
        );


        return mapToResponse(item);
    }


    // =========================================================
    // DELETE ITEM
    // =========================================================

    @Override
    public void deleteItem(
            Long id
    ) {

        Item item =
                itemRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Item not found."
                                )
                        );


        item.setStatus(
                Status.INACTIVE
        );

        itemRepository.save(item);


        inventoryRepository
                .findAllByStatus(Status.ACTIVE)
                .stream()
                .filter(inventoryItem ->
                        item.getItemCode()
                                .equals(
                                        inventoryItem.getItemCode()
                                )
                )
                .forEach(inventoryItem -> {

                    inventoryItem.setStatus(
                            Status.INACTIVE
                    );

                    inventoryRepository.save(
                            inventoryItem
                    );

                });
    }


    // =========================================================
    // EXPORT ITEMS
    // =========================================================

    @Override
    public byte[] exportItems() {

        try {

            List<Item> items =
                    itemRepository.findAllByStatus(
                            Status.ACTIVE
                    );

            return ItemExcelExporter.export(
                    items
            );

        } catch (IOException exception) {

            throw new BadRequestException(
                    "Failed to export items."
            );
        }
    }


    // =========================================================
    // CREATE INVENTORY ITEM FROM MASTER ITEM
    // =========================================================

    private void createInventoryItemFromMasterItem(
            Item item
    ) {

        InventoryItem existing =
                inventoryRepository
                        .findAllByStatus(Status.ACTIVE)
                        .stream()
                        .filter(inventoryItem ->
                                item.getItemCode()
                                        .equals(
                                                inventoryItem.getItemCode()
                                        )
                        )
                        .findFirst()
                        .orElse(null);


        if (existing != null) {

            synchronizeInventoryItem(
                    item
            );

            return;
        }


        // =====================================================
        // SUPPLIER
        // =====================================================

        Supplier supplier =
                findActiveSupplierByName(
                        item.getSupplierName()
                );


        // =====================================================
        // STORAGE LOCATION
        // =====================================================

        StorageLocation storageLocation =
                findOrCreateStorageLocation(
                        item.getStorageLocation()
                );


        // =====================================================
        // CREATE INVENTORY RECORD
        // =====================================================

        InventoryItem inventoryItem =
                new InventoryItem();


        inventoryItem.setItemCode(
                item.getItemCode()
        );

        inventoryItem.setItemName(
                item.getItemName()
        );

        inventoryItem.setDescription(
                item.getDescription()
        );

        inventoryItem.setCategory(
                item.getCategory()
        );

        inventoryItem.setSupplier(
                supplier
        );

        inventoryItem.setStorageLocation(
                storageLocation
        );

        inventoryItem.setUnit(
                item.getUnit()
        );

        inventoryItem.setQuantity(
                item.getCurrentStock() == null
                        ? 0
                        : item.getCurrentStock()
        );

        inventoryItem.setMinimumQuantity(
                item.getMinimumStock() == null
                        ? 0
                        : item.getMinimumStock()
        );

        inventoryItem.setMaximumQuantity(
                item.getMaximumStock() == null
                        ? 0
                        : item.getMaximumStock()
        );

        inventoryItem.setUnitPrice(
                item.getPurchasePrice() == null
                        ? java.math.BigDecimal.ZERO
                        : item.getPurchasePrice()
        );

        inventoryItem.setBatchNumber(
                item.getBatchNumber()
        );

        inventoryItem.setManufactureDate(
                item.getManufacturingDate()
        );

        inventoryItem.setExpiryDate(
                item.getExpiryDate()
        );

        inventoryItem.setRemarks(
                item.getRemarks()
        );

        inventoryItem.setIsConsumable(
                item.getItemType() != null
                        &&
                        item.getItemType()
                                .name()
                                .equals("CONSUMABLE")
        );

        inventoryItem.setReorderQuantity(
                item.getReorderQuantity() == null
                        ? 0
                        : item.getReorderQuantity()
        );

        inventoryItem.setStatus(
                Status.ACTIVE
        );


        inventoryRepository.save(
                inventoryItem
        );
    }


    // =========================================================
    // SYNCHRONIZE EXISTING INVENTORY ITEM
    // =========================================================

    private void synchronizeInventoryItem(
            Item item
    ) {

        InventoryItem inventoryItem =
                inventoryRepository
                        .findAllByStatus(Status.ACTIVE)
                        .stream()
                        .filter(existingItem ->
                                item.getItemCode()
                                        .equals(
                                                existingItem.getItemCode()
                                        )
                        )
                        .findFirst()
                        .orElse(null);


        if (inventoryItem == null) {

            createInventoryItemFromMasterItem(
                    item
            );

            return;
        }


        // =====================================================
        // SUPPLIER
        // =====================================================

        Supplier supplier =
                findActiveSupplierByName(
                        item.getSupplierName()
                );


        // =====================================================
        // STORAGE LOCATION
        // =====================================================

        StorageLocation storageLocation =
                findOrCreateStorageLocation(
                        item.getStorageLocation()
                );


        inventoryItem.setItemName(
                item.getItemName()
        );

        inventoryItem.setDescription(
                item.getDescription()
        );

        inventoryItem.setCategory(
                item.getCategory()
        );

        inventoryItem.setSupplier(
                supplier
        );

        inventoryItem.setStorageLocation(
                storageLocation
        );

        inventoryItem.setUnit(
                item.getUnit()
        );

        inventoryItem.setQuantity(
                item.getCurrentStock() == null
                        ? 0
                        : item.getCurrentStock()
        );

        inventoryItem.setMinimumQuantity(
                item.getMinimumStock() == null
                        ? 0
                        : item.getMinimumStock()
        );

        inventoryItem.setMaximumQuantity(
                item.getMaximumStock() == null
                        ? 0
                        : item.getMaximumStock()
        );

        inventoryItem.setUnitPrice(
                item.getPurchasePrice() == null
                        ? java.math.BigDecimal.ZERO
                        : item.getPurchasePrice()
        );

        inventoryItem.setBatchNumber(
                item.getBatchNumber()
        );

        inventoryItem.setManufactureDate(
                item.getManufacturingDate()
        );

        inventoryItem.setExpiryDate(
                item.getExpiryDate()
        );

        inventoryItem.setRemarks(
                item.getRemarks()
        );

        inventoryItem.setIsConsumable(
                item.getItemType() != null
                        &&
                        item.getItemType()
                                .name()
                                .equals("CONSUMABLE")
        );

        inventoryItem.setReorderQuantity(
                item.getReorderQuantity() == null
                        ? 0
                        : item.getReorderQuantity()
        );


        inventoryRepository.save(
                inventoryItem
        );
    }


    // =========================================================
    // FIND ACTIVE SUPPLIER BY NAME
    // =========================================================

    private Supplier findActiveSupplierByName(
            String supplierName
    ) {

        if (
                supplierName == null
                        || supplierName.trim().isEmpty()
        ) {

            throw new ResourceNotFoundException(
                    "Supplier name is required."
            );
        }


        String searchName =
                supplierName.trim();


        return supplierRepository
                .findAllByStatus(Status.ACTIVE)
                .stream()
                .filter(supplier ->
                        supplier.getSupplierName() != null
                                &&
                                supplier.getSupplierName()
                                        .trim()
                                        .equalsIgnoreCase(
                                                searchName
                                        )
                )
                .findFirst()
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Supplier not found: "
                                        + supplierName
                        )
                );
    }


    // =========================================================
    // FIND ACTIVE STORAGE LOCATION BY NAME
    // =========================================================

    private StorageLocation findOrCreateStorageLocation(
            String locationName
    ) {

        if (
                locationName == null
                        || locationName.trim().isEmpty()
        ) {

            throw new ResourceNotFoundException(
                    "Storage location name is required."
            );
        }


        String searchName =
                locationName.trim();


        return storageLocationRepository
                .findAllByStatus(Status.ACTIVE)
                .stream()
                .filter(location ->
                        location.getLocationName() != null
                                &&
                                location.getLocationName()
                                        .trim()
                                        .equalsIgnoreCase(
                                                searchName
                                        )
                )
                .findFirst()
                .orElseGet(() -> {

                    StorageLocation newLocation =
                            new StorageLocation();

                    newLocation.setLocationName(
                            searchName
                    );

                    newLocation.setLocationCode(
                            generateStorageLocationCode()
                    );

                    newLocation.setStatus(
                            Status.ACTIVE
                    );

                    return storageLocationRepository.save(
                            newLocation
                    );
                });
    }


    // =========================================================
    // GENERATE STORAGE LOCATION CODE
    // =========================================================

    private String generateStorageLocationCode() {

        return "LOC-"
                + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }


    // =========================================================
    // RESPONSE MAPPING
    // =========================================================

    private ItemResponseDTO mapToResponse(
            Item item
    ) {

        return new ItemResponseDTO(

                item.getId(),

                item.getItemName(),

                item.getItemCode(),

                item.getCategory().getId(),

                item.getCategory().getCategoryName(),

                item.getItemType(),

                item.getUnit(),

                item.getOpeningStock(),

                item.getCurrentStock(),

                item.getMinimumStock(),

                item.getMaximumStock(),

                item.getSupplierName(),

                item.getManufacturerName(),

                item.getBrandName(),

                item.getPurchaseDate(),

                item.getPurchasePrice(),

                item.getInvoiceNumber(),

                item.getPurchaseOrderNumber(),

                item.getBatchNumber(),

                item.getSerialNumber(),

                item.getManufacturingDate(),

                item.getReceivingDate(),

                item.getWarrantyExpiry(),

                item.getStorageLocation(),

                item.getRackNumber(),

                item.getShelfNumber(),

                item.getCabinetNumber(),

                item.getExpiryDate(),

                item.getReorderQuantity(),

                item.getHazardLevel(),

                item.getStorageCondition(),

                item.getDescription(),

                item.getRemarks(),

                item.getCreatedAt(),

                item.getUpdatedAt(),

                item.getStatus()
        );
    }


    // =========================================================
    // ITEM CODE
    // =========================================================

    private String generateItemCode() {

        Long count =
                itemRepository.count() + 1;

        String itemCode;

        do {

            itemCode =
                    String.format(
                            "ITM%05d",
                            count
                    );

            count++;

        } while (
                itemRepository.existsByItemCode(
                        itemCode
                )
        );

        return itemCode;
    }
}