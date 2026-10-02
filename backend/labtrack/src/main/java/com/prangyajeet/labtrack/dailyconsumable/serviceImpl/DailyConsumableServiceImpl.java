package com.prangyajeet.labtrack.dailyconsumable.serviceImpl;

import com.prangyajeet.labtrack.auth.entity.User;
import com.prangyajeet.labtrack.auth.repository.UserRepository;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.common.enums.TransactionType;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableRequestDTO;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableResponseDTO;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableSummaryDTO;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableUsageResponseDTO;
import com.prangyajeet.labtrack.dailyconsumable.service.DailyConsumableService;
import com.prangyajeet.labtrack.department.entity.Department;
import com.prangyajeet.labtrack.department.repository.DepartmentRepository;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;
import com.prangyajeet.labtrack.inventory.repository.InventoryRepository;
import com.prangyajeet.labtrack.inventorytransaction.entity.InventoryTransaction;
import com.prangyajeet.labtrack.inventorytransaction.repository.InventoryTransactionRepository;
import com.prangyajeet.labtrack.item.entity.Item;
import com.prangyajeet.labtrack.item.repository.ItemRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.prangyajeet.labtrack.storage.service.SupabaseStorageService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@Transactional
public class DailyConsumableServiceImpl
        implements DailyConsumableService {

    private static final long MAX_PHOTO_SIZE =
            5 * 1024 * 1024;

    private final InventoryRepository inventoryRepository;

    private final InventoryTransactionRepository
            transactionRepository;

    private final ItemRepository itemRepository;

    private final DepartmentRepository departmentRepository;

    private final UserRepository userRepository;

    private final SupabaseStorageService supabaseStorageService;

    private final String consumablePhotoBucket;

    public DailyConsumableServiceImpl(
            InventoryRepository inventoryRepository,
            InventoryTransactionRepository transactionRepository,
            ItemRepository itemRepository,
            DepartmentRepository departmentRepository,
            UserRepository userRepository,
            SupabaseStorageService supabaseStorageService,
            @Value("${supabase.storage.consumable-photo-bucket:consumable-photos}")
            String consumablePhotoBucket) {

        this.inventoryRepository =
                inventoryRepository;

        this.transactionRepository =
                transactionRepository;

        this.itemRepository =
                itemRepository;

        this.departmentRepository =
                departmentRepository;

        this.userRepository =
                userRepository;

        this.supabaseStorageService =
                supabaseStorageService;

        this.consumablePhotoBucket =
                consumablePhotoBucket;
    }

    /*
     * =========================================================
     * EXISTING DAILY CONSUMABLE METHODS
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public List<DailyConsumableResponseDTO>
    getAllConsumables() {

        return inventoryRepository
                .findByIsConsumableTrueAndStatus(
                        Status.ACTIVE
                )
                .stream()
                .map(this::mapToConsumableResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DailyConsumableResponseDTO
    getConsumableById(Long id) {

        if (id == null) {
            throw new RuntimeException(
                    "Consumable ID is required"
            );
        }

        InventoryItem item =
                inventoryRepository
                        .findByIdAndIsConsumableTrueAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Daily Consumable not found"
                                )
                        );

        return mapToConsumableResponse(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DailyConsumableResponseDTO>
    getLowStockConsumables() {

        return inventoryRepository
                .findByIsConsumableTrueAndStatus(
                        Status.ACTIVE
                )
                .stream()
                .filter(item ->
                        item.getQuantity() != null
                                && item.getMinimumQuantity() != null
                                && item.getQuantity()
                                <= item.getMinimumQuantity()
                )
                .map(this::mapToConsumableResponse)
                .collect(Collectors.toList());
    }

    /*
     * =========================================================
     * LOG USAGE
     * =========================================================
     *
     * Flow:
     *
     * Validate request
     *      ↓
     * Find InventoryItem
     *      ↓
     * Verify consumable
     *      ↓
     * Verify Department
     *      ↓
     * Verify stock
     *      ↓
     * Deduct InventoryItem
     *      ↓
     * Synchronize Item.currentStock
     *      ↓
     * Create STOCK_OUT transaction
     *      ↓
     * Save usage details
     *
     * Everything runs inside one transaction.
     */

    @Override
    public DailyConsumableUsageResponseDTO
    logUsage(
            DailyConsumableRequestDTO requestDTO) {

        validateUsageRequest(requestDTO);

        InventoryItem inventoryItem =
                inventoryRepository
                        .findByIdAndIsConsumableTrueAndStatus(
                                requestDTO.getItemId(),
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Consumable item not found or inactive"
                                )
                        );

        Department department =
                departmentRepository
                        .findByIdAndStatus(
                                requestDTO.getDepartmentId(),
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found or inactive"
                                )
                        );

        Integer availableStock =
                inventoryItem.getQuantity() == null
                        ? 0
                        : inventoryItem.getQuantity();

        Integer quantityUsed =
                requestDTO.getQuantityUsed();

        if (quantityUsed > availableStock) {

            throw new RuntimeException(
                    "Insufficient stock. Available: "
                            + availableStock
                            + ", Requested: "
                            + quantityUsed
            );
        }

        /*
         * Resolve the master Item using item code.
         *
         * Existing project maintains current stock in Item
         * and InventoryItem, so both are synchronized.
         */

        Item item =
                findItemFromInventoryItem(
                        inventoryItem
                );

        User loggedBy =
                getLoggedInUser();

        /*
         * =====================================================
         * NEW STOCK
         * =====================================================
         */

        Integer newStock =
                availableStock - quantityUsed;

        if (newStock < 0) {
            throw new RuntimeException(
                    "Stock cannot be negative"
            );
        }

        /*
         * =====================================================
         * UPDATE INVENTORY ITEM
         * =====================================================
         */

        inventoryItem.setQuantity(
                newStock
        );

        inventoryRepository.save(
                inventoryItem
        );

        /*
         * =====================================================
         * UPDATE MASTER ITEM
         * =====================================================
         */

        item.setCurrentStock(
                newStock
        );

        itemRepository.save(
                item
        );

        /*
         * =====================================================
         * CREATE STOCK OUT TRANSACTION
         * =====================================================
         */

        InventoryTransaction transaction =
                new InventoryTransaction();

        transaction.setTransactionNumber(
                generateTransactionNumber()
        );

        transaction.setInventoryItem(
                inventoryItem
        );

        transaction.setTransactionType(
                TransactionType.STOCK_OUT
        );

        transaction.setQuantity(
                quantityUsed
        );

        transaction.setRemarks(
                requestDTO.getRemarks()
        );

        transaction.setTransactionDate(
                LocalDateTime.now()
        );

        transaction.setPerformedBy(
                loggedBy
        );

        /*
         * =====================================================
         * DAILY USAGE DETAILS
         * =====================================================
         */

        transaction.setFacultyStaffName(
                requestDTO.getFacultyStaffName()
        );

        transaction.setDesignation(
                requestDTO.getDesignation()
        );

        transaction.setDepartment(
                department
        );

        transaction.setPurposeTest(
                requestDTO.getPurposeTest()
        );

        transaction.setUsageDate(
                requestDTO.getUsageDate()
        );

        transaction.setUsageTime(
                requestDTO.getUsageTime()
        );

        transaction.setStatus(
                Status.ACTIVE
        );

        InventoryTransaction savedTransaction =
                transactionRepository.save(
                        transaction
                );

        return mapToUsageResponse(
                savedTransaction
        );
    }

    /*
     * =========================================================
     * GET USAGE RECORDS
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public List<DailyConsumableUsageResponseDTO>
    getUsageRecords(
            LocalDate date,
            Long departmentId,
            String search) {

        String normalizedSearch =
                search == null
                        ? ""
                        : search.trim()
                                .toLowerCase(Locale.ROOT);

        return transactionRepository
                .findByTransactionType(
                        TransactionType.STOCK_OUT
                )
                .stream()
                .filter(transaction ->
                        transaction.getStatus()
                                == Status.ACTIVE
                )
                .filter(transaction ->
                        transaction.getUsageDate()
                                != null
                )
                .filter(transaction -> {

                    if (date == null) {
                        return true;
                    }

                    return date.equals(
                            transaction.getUsageDate()
                    );
                })
                .filter(transaction -> {

                    if (departmentId == null) {
                        return true;
                    }

                    return transaction.getDepartment()
                            != null
                            && departmentId.equals(
                            transaction
                                    .getDepartment()
                                    .getId()
                    );
                })
                .filter(transaction -> {

                    if (normalizedSearch.isEmpty()) {
                        return true;
                    }

                    String itemName =
                            transaction
                                    .getInventoryItem()
                                    .getItemName();

                    String itemCode =
                            transaction
                                    .getInventoryItem()
                                    .getItemCode();

                    String faculty =
                            transaction
                                    .getFacultyStaffName();

                    String purpose =
                            transaction
                                    .getPurposeTest();

                    return contains(
                            itemName,
                            normalizedSearch
                    )
                            || contains(
                            itemCode,
                            normalizedSearch
                    )
                            || contains(
                            faculty,
                            normalizedSearch
                    )
                            || contains(
                            purpose,
                            normalizedSearch
                    );
                })
                .sorted(
                        Comparator
                                .comparing(
                                        InventoryTransaction::getUsageDate,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                                .thenComparing(
                                        InventoryTransaction::getUsageTime,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                )
                .map(this::mapToUsageResponse)
                .collect(Collectors.toList());
    }

    /*
     * =========================================================
     * TODAY
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public List<DailyConsumableUsageResponseDTO>
    getTodayUsage() {

        return getUsageRecords(
                LocalDate.now(),
                null,
                null
        );
    }

    /*
     * =========================================================
     * SUMMARY
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public DailyConsumableSummaryDTO
    getUsageSummary(
            LocalDate date,
            Long departmentId,
            String search) {

        List<DailyConsumableUsageResponseDTO>
                records =
                getUsageRecords(
                        date,
                        departmentId,
                        search
                );

        int totalQuantity =
                records.stream()
                        .map(
                                DailyConsumableUsageResponseDTO
                                        ::getQuantityUsed
                        )
                        .filter(
                                value -> value != null
                        )
                        .mapToInt(
                                Integer::intValue
                        )
                        .sum();

        BigDecimal totalValue =
                records.stream()
                        .map(record -> {

                            if (
                                    record.getQuantityUsed()
                                            == null
                            ) {
                                return BigDecimal.ZERO;
                            }

                            InventoryItem item =
                                    inventoryRepository
                                            .findById(
                                                    record.getItemId()
                                            )
                                            .orElse(null);

                            if (
                                    item == null
                                            || item.getUnitPrice()
                                            == null
                            ) {
                                return BigDecimal.ZERO;
                            }

                            return item
                                    .getUnitPrice()
                                    .multiply(
                                            BigDecimal.valueOf(
                                                    record
                                                            .getQuantityUsed()
                                            )
                                    );
                        })
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        DailyConsumableSummaryDTO summary =
                new DailyConsumableSummaryDTO();

        summary.setTotalTransactions(
                records.size()
        );

        summary.setTotalQuantityUsed(
                totalQuantity
        );

        summary.setTotalUsageValue(
                totalValue
        );

        Map<Long,
                DailyConsumableSummaryDTO
                        .DepartmentUsageSummaryDTO>
                departmentMap =
                new LinkedHashMap<>();

        for (
                DailyConsumableUsageResponseDTO record
                : records
        ) {

            Long deptId =
                    record.getDepartmentId();

            if (deptId == null) {
                continue;
            }

            DailyConsumableSummaryDTO
                    .DepartmentUsageSummaryDTO
                    departmentSummary =
                    departmentMap.computeIfAbsent(
                            deptId,
                            id ->
                                    new DailyConsumableSummaryDTO
                                            .DepartmentUsageSummaryDTO(
                                                    id,
                                                    record.getDepartmentName(),
                                                    0,
                                                    0
                                            )
                    );

            departmentSummary.setTotalQuantityUsed(
                    departmentSummary
                            .getTotalQuantityUsed()
                            + (
                            record.getQuantityUsed()
                                    == null
                                    ? 0
                                    : record.getQuantityUsed()
                    )
            );

            departmentSummary.setTransactionCount(
                    departmentSummary
                            .getTransactionCount()
                            + 1
            );
        }

        summary.setDepartmentSummaries(
                new ArrayList<>(
                        departmentMap.values()
                )
        );

        return summary;
    }

    /*
     * =========================================================
     * GET USAGE BY ID
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public DailyConsumableUsageResponseDTO
    getUsageById(Long id) {

        if (id == null) {
            throw new RuntimeException(
                    "Usage ID is required"
            );
        }

        InventoryTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usage record not found"
                                )
                        );

        if (
                transaction.getStatus()
                        != Status.ACTIVE
                || transaction.getTransactionType()
                        != TransactionType.STOCK_OUT
                || transaction.getUsageDate() == null
        ) {

            throw new RuntimeException(
                    "Daily consumable usage record not found"
            );
        }

        return mapToUsageResponse(
                transaction
        );
    }

    /*
     * =========================================================
     * UPDATE USAGE
     * =========================================================
     *
     * Stock correction is calculated as:
     *
     * old quantity = 10
     * new quantity = 15
     *
     * difference = 5
     *
     * Therefore 5 additional units are deducted.
     *
     * If:
     *
     * old = 10
     * new = 5
     *
     * difference = -5
     *
     * Therefore 5 units are returned.
     */

    @Override
    public DailyConsumableUsageResponseDTO
    updateUsage(
            Long id,
            DailyConsumableRequestDTO requestDTO) {

        validateUsageRequest(requestDTO);

        InventoryTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usage record not found"
                                )
                        );

        if (
                transaction.getStatus()
                        != Status.ACTIVE
                || transaction.getTransactionType()
                        != TransactionType.STOCK_OUT
                || transaction.getUsageDate() == null
        ) {

            throw new RuntimeException(
                    "Daily consumable usage record not found"
            );
        }

        InventoryItem inventoryItem =
                transaction.getInventoryItem();

        if (inventoryItem == null) {
            throw new RuntimeException(
                    "Usage is not linked to an inventory item"
            );
        }

        Item item =
                findItemFromInventoryItem(
                        inventoryItem
                );

        Department department =
                departmentRepository
                        .findByIdAndStatus(
                                requestDTO.getDepartmentId(),
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found or inactive"
                                )
                        );

        int oldQuantity =
                transaction.getQuantity();

        int newQuantity =
                requestDTO.getQuantityUsed();

        int difference =
                newQuantity - oldQuantity;

        int currentStock =
                inventoryItem.getQuantity() == null
                        ? 0
                        : inventoryItem.getQuantity();

        /*
         * Positive difference means additional usage.
         */

        if (difference > 0) {

            if (difference > currentStock) {

                throw new RuntimeException(
                        "Insufficient stock for usage correction. "
                                + "Available: "
                                + currentStock
                                + ", Additional required: "
                                + difference
                );
            }

            currentStock =
                    currentStock - difference;
        }

        /*
         * Negative difference means some previously
         * consumed stock is being returned.
         */

        else if (difference < 0) {

            currentStock =
                    currentStock + Math.abs(
                            difference
                    );
        }

        if (currentStock < 0) {

            throw new RuntimeException(
                    "Stock cannot be negative"
            );
        }

        /*
         * Synchronize both stock sources.
         */

        inventoryItem.setQuantity(
                currentStock
        );

        inventoryRepository.save(
                inventoryItem
        );

        item.setCurrentStock(
                currentStock
        );

        itemRepository.save(
                item
        );

        /*
         * Update usage information.
         */

        transaction.setQuantity(
                newQuantity
        );

        transaction.setFacultyStaffName(
                requestDTO.getFacultyStaffName()
        );

        transaction.setDesignation(
                requestDTO.getDesignation()
        );

        transaction.setDepartment(
                department
        );

        transaction.setPurposeTest(
                requestDTO.getPurposeTest()
        );

        transaction.setUsageDate(
                requestDTO.getUsageDate()
        );

        transaction.setUsageTime(
                requestDTO.getUsageTime()
        );

        transaction.setRemarks(
                requestDTO.getRemarks()
        );

        InventoryTransaction updated =
                transactionRepository.save(
                        transaction
                );

        return mapToUsageResponse(
                updated
        );
    }

    /*
     * =========================================================
     * DELETE USAGE
     * =========================================================
     *
     * This is NOT a silent database deletion.
     *
     * The consumed quantity is returned to stock and
     * the transaction is marked INACTIVE.
     */

    @Override
    public void deleteUsage(Long id) {

        if (id == null) {
            throw new RuntimeException(
                    "Usage ID is required"
            );
        }

        InventoryTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usage record not found"
                                )
                        );

        if (
                transaction.getStatus()
                        != Status.ACTIVE
                || transaction.getTransactionType()
                        != TransactionType.STOCK_OUT
                || transaction.getUsageDate() == null
        ) {

            throw new RuntimeException(
                    "Daily consumable usage record not found"
            );
        }

        InventoryItem inventoryItem =
                transaction.getInventoryItem();

        if (inventoryItem == null) {

            throw new RuntimeException(
                    "Usage is not linked to an inventory item"
            );
        }

        Item item =
                findItemFromInventoryItem(
                        inventoryItem
                );

        int quantity =
                transaction.getQuantity() == null
                        ? 0
                        : transaction.getQuantity();

        int restoredStock =
                (
                        inventoryItem.getQuantity() == null
                                ? 0
                                : inventoryItem.getQuantity()
                ) + quantity;

        inventoryItem.setQuantity(
                restoredStock
        );

        inventoryRepository.save(
                inventoryItem
        );

        item.setCurrentStock(
                restoredStock
        );

        itemRepository.save(
                item
        );

        transaction.setStatus(
                Status.INACTIVE
        );

        deletePhotoFileIfExists(transaction);

        transaction.setPhotoOriginalFileName(null);
        transaction.setPhotoStoredFileName(null);
        transaction.setPhotoContentType(null);
        transaction.setPhotoFilePath(null);

        transactionRepository.save(
                transaction
        );
    }

    /*
     * =========================================================
     * DAILY CONSUMABLE USAGE PHOTO
     * =========================================================
     */

    @Override
    public String uploadUsagePhoto(
            Long id,
            MultipartFile photo) {

        if (id == null) {
            throw new RuntimeException(
                    "Usage ID is required"
            );
        }

        if (photo == null || photo.isEmpty()) {
            throw new RuntimeException(
                    "Photo is required"
            );
        }

        if (photo.getSize() > MAX_PHOTO_SIZE) {
            throw new RuntimeException(
                    "Photo size must not exceed 5 MB"
            );
        }

        String contentType =
                photo.getContentType();

        if (!isSupportedPhotoType(contentType)) {
            throw new RuntimeException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
            );
        }

        InventoryTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usage record not found"
                                )
                        );

        if (
                transaction.getStatus()
                        != Status.ACTIVE
                        || transaction.getTransactionType()
                        != TransactionType.STOCK_OUT
                        || transaction.getUsageDate() == null
        ) {
            throw new RuntimeException(
                    "Daily consumable usage record not found"
            );
        }

        String originalFileName =
                photo.getOriginalFilename();

        String extension =
                getFileExtension(
                        originalFileName,
                        contentType
                );

        String storedFileName =
                "usage_"
                        + id
                        + "_"
                        + UUID.randomUUID()
                        + extension;

        String objectPath =
                "daily-consumables/"
                        + id
                        + "/"
                        + storedFileName;

        String previousPhotoPath =
                transaction.getPhotoFilePath();

        try {
            supabaseStorageService.uploadFile(
                    consumablePhotoBucket,
                    objectPath,
                    photo.getBytes(),
                    contentType
            );

            transaction.setPhotoOriginalFileName(
                    originalFileName
            );

            transaction.setPhotoStoredFileName(
                    storedFileName
            );

            transaction.setPhotoContentType(
                    contentType
            );

            transaction.setPhotoFilePath(
                    objectPath
            );

            transactionRepository.save(
                    transaction
            );

            if (
                    previousPhotoPath != null
                            && !previousPhotoPath.trim().isEmpty()
                            && previousPhotoPath.startsWith(
                            "daily-consumables/"
                    )
            ) {
                try {
                    supabaseStorageService.deleteFile(
                            consumablePhotoBucket,
                            previousPhotoPath
                    );
                } catch (Exception exception) {
                    // The database already points to the new photo.
                    // An old object can be cleaned up separately.
                }
            }

            return originalFileName;

        } catch (Exception exception) {

            try {
                supabaseStorageService.deleteFile(
                        consumablePhotoBucket,
                        objectPath
                );
            } catch (Exception cleanupException) {
                exception.addSuppressed(cleanupException);
            }

            throw new RuntimeException(
                    "Unable to upload usage photo",
                    exception
            );
        }
    }


    @Override
    @Transactional(readOnly = true)
    public String getUsagePhotoPath(
            Long id) {

        if (id == null) {
            throw new RuntimeException(
                    "Usage ID is required"
            );
        }

        InventoryTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usage record not found"
                                )
                        );

        if (
                transaction.getStatus()
                        != Status.ACTIVE
                        || transaction.getTransactionType()
                        != TransactionType.STOCK_OUT
                        || transaction.getUsageDate() == null
        ) {
            throw new RuntimeException(
                    "Daily consumable usage record not found"
            );
        }

        if (
                transaction.getPhotoFilePath() == null
                        || transaction
                        .getPhotoFilePath()
                        .trim()
                        .isEmpty()
        ) {
            throw new RuntimeException(
                    "Usage photo not found"
            );
        }

        return transaction.getPhotoFilePath();
    }

    @Override
    public void deleteUsagePhoto(
            Long id) {

        if (id == null) {
            throw new RuntimeException(
                    "Usage ID is required"
            );
        }

        InventoryTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usage record not found"
                                )
                        );

        if (
                transaction.getStatus()
                        != Status.ACTIVE
                        || transaction.getTransactionType()
                        != TransactionType.STOCK_OUT
                        || transaction.getUsageDate() == null
        ) {
            throw new RuntimeException(
                    "Daily consumable usage record not found"
            );
        }

        deletePhotoFileIfExists(transaction);

        transaction.setPhotoOriginalFileName(null);
        transaction.setPhotoStoredFileName(null);
        transaction.setPhotoContentType(null);
        transaction.setPhotoFilePath(null);

        transactionRepository.save(
                transaction
        );
    }

    private void deletePhotoFileIfExists(
            InventoryTransaction transaction) {

        if (transaction == null
                || transaction.getPhotoFilePath() == null
                || transaction.getPhotoFilePath()
                .trim()
                .isEmpty()) {
            return;
        }

        String objectPath =
                transaction.getPhotoFilePath();

        if (!objectPath.startsWith(
                "daily-consumables/"
        )) {
            return;
        }

        try {
            supabaseStorageService.deleteFile(
                    consumablePhotoBucket,
                    objectPath
            );
        } catch (Exception exception) {
            throw new RuntimeException(
                    "Unable to remove existing usage photo",
                    exception
            );
        }
    }


    private boolean isSupportedPhotoType(
            String contentType) {

        return "image/jpeg".equalsIgnoreCase(contentType)
                || "image/jpg".equalsIgnoreCase(contentType)
                || "image/png".equalsIgnoreCase(contentType)
                || "image/webp".equalsIgnoreCase(contentType);
    }

    private String getFileExtension(
            String originalFileName,
            String contentType) {

        if (originalFileName != null
                && originalFileName.contains(".")) {

            String extension =
                    originalFileName.substring(
                            originalFileName.lastIndexOf(".")
                    ).toLowerCase(Locale.ROOT);

            if (
                    ".jpg".equals(extension)
                            || ".jpeg".equals(extension)
                            || ".png".equals(extension)
                            || ".webp".equals(extension)
            ) {
                return extension;
            }
        }

        if ("image/png".equalsIgnoreCase(contentType)) {
            return ".png";
        }

        if ("image/webp".equalsIgnoreCase(contentType)) {
            return ".webp";
        }

        return ".jpg";
    }

    /*
     * =========================================================
     * VALIDATION
     * =========================================================
     */

    private void validateUsageRequest(
            DailyConsumableRequestDTO requestDTO) {

        if (requestDTO == null) {

            throw new RuntimeException(
                    "Usage request cannot be null"
            );
        }

        if (requestDTO.getItemId() == null) {

            throw new RuntimeException(
                    "Item is required"
            );
        }

        if (requestDTO.getQuantityUsed() == null) {

            throw new RuntimeException(
                    "Quantity used is required"
            );
        }

        if (requestDTO.getQuantityUsed() <= 0) {

            throw new RuntimeException(
                    "Quantity used must be greater than zero"
            );
        }

        if (
                requestDTO.getFacultyStaffName() == null
                        || requestDTO
                        .getFacultyStaffName()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Faculty/Staff name is required"
            );
        }

        if (requestDTO.getDepartmentId() == null) {

            throw new RuntimeException(
                    "Department is required"
            );
        }

        if (requestDTO.getPurposeTest() == null
                || requestDTO
                .getPurposeTest()
                .trim()
                .isEmpty()) {

            throw new RuntimeException(
                    "Purpose/Test is required"
            );
        }

        if (requestDTO.getUsageDate() == null) {

            requestDTO.setUsageDate(
                    LocalDate.now()
            );
        }

        if (requestDTO.getUsageTime() == null) {

            requestDTO.setUsageTime(
                    LocalTime.now()
            );
        }
    }

    /*
     * =========================================================
     * FIND MASTER ITEM
     * =========================================================
     */

    private Item findItemFromInventoryItem(
            InventoryItem inventoryItem) {

        if (inventoryItem == null) {

            throw new RuntimeException(
                    "Inventory item not found"
            );
        }

        String itemCode =
                inventoryItem.getItemCode();

        if (
                itemCode == null
                        || itemCode.trim().isEmpty()
        ) {

            throw new RuntimeException(
                    "Inventory item does not have an item code"
            );
        }

        Item item =
                itemRepository
                        .findByItemCode(
                                itemCode
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Item not found for item code: "
                                                + itemCode
                                )
                        );

        if (
                item.getStatus()
                        != Status.ACTIVE
        ) {

            throw new RuntimeException(
                    "Item is inactive"
            );
        }

        return item;
    }

    /*
     * =========================================================
     * LOGGED-IN USER
     * =========================================================
     */

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (
                authentication == null
                        || !authentication.isAuthenticated()
                        || "anonymousUser".equals(
                        authentication.getPrincipal()
                )
        ) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email =
                authentication.getName();

        return userRepository
                .findByEmailAndStatus(
                        email,
                        Status.ACTIVE
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"
                        )
                );
    }

    /*
     * =========================================================
     * TRANSACTION NUMBER
     * =========================================================
     */

    private String generateTransactionNumber() {

        long count =
                transactionRepository.count()
                        + 1;

        String transactionNumber;

        do {

            transactionNumber =
                    String.format(
                            "TXN%06d",
                            count
                    );

            count++;

        } while (
                transactionRepository
                        .findByTransactionNumber(
                                transactionNumber
                        )
                        .isPresent()
        );

        return transactionNumber;
    }

    /*
     * =========================================================
     * MAP EXISTING CONSUMABLE
     * =========================================================
     */

    private DailyConsumableResponseDTO
    mapToConsumableResponse(
            InventoryItem item) {

        DailyConsumableResponseDTO dto =
                new DailyConsumableResponseDTO();

        dto.setId(
                item.getId()
        );

        dto.setItemCode(
                item.getItemCode()
        );

        dto.setItemName(
                item.getItemName()
        );

        dto.setDescription(
                item.getDescription()
        );

        if (item.getCategory() != null) {

            dto.setCategoryName(
                    item.getCategory()
                            .getCategoryName()
            );
        }

        if (item.getSupplier() != null) {

            dto.setSupplierName(
                    item.getSupplier()
                            .getSupplierName()
            );
        }

        if (item.getStorageLocation() != null) {

            dto.setStorageLocationName(
                    item.getStorageLocation()
                            .getLocationName()
            );
        }

        dto.setUnit(
                item.getUnit()
        );

        dto.setQuantity(
                item.getQuantity()
        );

        dto.setMinimumQuantity(
                item.getMinimumQuantity()
        );

        dto.setReorderQuantity(
                item.getReorderQuantity()
        );

        dto.setUnitPrice(
                item.getUnitPrice()
        );

        dto.setBatchNumber(
                item.getBatchNumber()
        );

        dto.setManufactureDate(
                item.getManufactureDate()
        );

        dto.setExpiryDate(
                item.getExpiryDate()
        );

        dto.setRemarks(
                item.getRemarks()
        );

        return dto;
    }

    /*
     * =========================================================
     * MAP USAGE RESPONSE
     * =========================================================
     */

    private DailyConsumableUsageResponseDTO
    mapToUsageResponse(
            InventoryTransaction transaction) {

        DailyConsumableUsageResponseDTO dto =
                new DailyConsumableUsageResponseDTO();

        dto.setId(
                transaction.getId()
        );

        InventoryItem inventoryItem =
                transaction.getInventoryItem();

        if (inventoryItem != null) {

            dto.setItemId(
                    inventoryItem.getId()
            );

            dto.setItemCode(
                    inventoryItem.getItemCode()
            );

            dto.setItemName(
                    inventoryItem.getItemName()
            );

            dto.setUnit(
                    inventoryItem.getUnit()
            );
        }

        dto.setQuantityUsed(
                transaction.getQuantity()
        );

        dto.setFacultyStaffName(
                transaction.getFacultyStaffName()
        );

        dto.setDesignation(
                transaction.getDesignation()
        );

        if (transaction.getDepartment() != null) {

            dto.setDepartmentId(
                    transaction
                            .getDepartment()
                            .getId()
            );

            dto.setDepartmentName(
                    transaction
                            .getDepartment()
                            .getDepartmentName()
            );
        }

        dto.setPurposeTest(
                transaction.getPurposeTest()
        );

        dto.setUsageDate(
                transaction.getUsageDate()
        );

        dto.setUsageTime(
                transaction.getUsageTime()
        );

        dto.setRemarks(
                transaction.getRemarks()
        );

        if (transaction.getPerformedBy() != null) {

            dto.setLoggedById(
                    transaction
                            .getPerformedBy()
                            .getId()
            );

            dto.setLoggedByName(
                    transaction
                            .getPerformedBy()
                            .getFullName()
            );
        }

        dto.setCreatedAt(
                transaction.getCreatedAt()
        );

        dto.setUpdatedAt(
                transaction.getUpdatedAt()
        );

        dto.setPhotoFileName(
                transaction.getPhotoOriginalFileName()
        );

        dto.setPhotoContentType(
                transaction.getPhotoContentType()
        );

        dto.setPhotoAvailable(
                transaction.getPhotoFilePath() != null
                        && !transaction.getPhotoFilePath()
                        .trim()
                        .isEmpty()
        );

        if (transaction.getId() != null
                && Boolean.TRUE.equals(
                dto.getPhotoAvailable()
        )) {
            dto.setPhotoUrl(
                    "/api/daily-consumables/usage/"
                            + transaction.getId()
                            + "/photo"
            );
        } else {
            dto.setPhotoUrl(null);
        }

        return dto;
    }

    /*
     * =========================================================
     * SEARCH HELPER
     * =========================================================
     */

    private boolean contains(
            String value,
            String search) {

        return value != null
                && value
                .toLowerCase(Locale.ROOT)
                .contains(search);
    }
}