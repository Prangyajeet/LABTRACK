package com.prangyajeet.labtrack.inventorytransaction.serviceImpl;

import com.prangyajeet.labtrack.auth.entity.User;
import com.prangyajeet.labtrack.auth.repository.UserRepository;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.common.enums.TransactionType;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;
import com.prangyajeet.labtrack.inventory.repository.InventoryRepository;
import com.prangyajeet.labtrack.inventorytransaction.dto.InventoryTransactionRequestDTO;
import com.prangyajeet.labtrack.inventorytransaction.dto.InventoryTransactionResponseDTO;
import com.prangyajeet.labtrack.inventorytransaction.entity.InventoryTransaction;
import com.prangyajeet.labtrack.inventorytransaction.repository.InventoryTransactionRepository;
import com.prangyajeet.labtrack.inventorytransaction.service.InventoryTransactionService;
import com.prangyajeet.labtrack.item.entity.Item;
import com.prangyajeet.labtrack.item.repository.ItemRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryTransactionServiceImpl
        implements InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;
    private final InventoryRepository inventoryRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public InventoryTransactionServiceImpl(
            InventoryTransactionRepository transactionRepository,
            InventoryRepository inventoryRepository,
            ItemRepository itemRepository,
            UserRepository userRepository) {

        this.transactionRepository = transactionRepository;
        this.inventoryRepository = inventoryRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET LOGGED-IN USER
    // =========================================================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(
                        authentication.getPrincipal())) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        String email = authentication.getName();

        return userRepository
                .findByEmailAndStatus(
                        email,
                        Status.ACTIVE
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found."
                        )
                );
    }

    // =========================================================
    // FIND CURRENT ITEM USING INVENTORY ITEM
    // =========================================================
    //
    // inventoryItemId belongs to inventory_items.
    //
    // Item belongs to items.
    //
    // We connect them using itemCode.
    //
    // =========================================================

    private Item findItemFromInventoryItem(
            InventoryItem inventoryItem) {

        if (inventoryItem == null) {

            throw new RuntimeException(
                    "Inventory item not found."
            );
        }

        String itemCode =
                inventoryItem.getItemCode();

        if (itemCode == null
                || itemCode.trim().isEmpty()) {

            throw new RuntimeException(
                    "Inventory item does not have an item code."
            );
        }

        Item item =
                itemRepository
                        .findByItemCode(itemCode)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Item not found for item code: "
                                                + itemCode
                                )
                        );

        if (item.getStatus() != Status.ACTIVE) {

            throw new RuntimeException(
                    "Item is inactive."
            );
        }

        return item;
    }

    // =========================================================
    // GENERATE TRANSACTION NUMBER
    // =========================================================

    private String generateTransactionNumber() {

        long count =
                transactionRepository.count() + 1;

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

    // =========================================================
    // CREATE TRANSACTION
    // =========================================================

    @Override
    public InventoryTransactionResponseDTO createTransaction(
            InventoryTransactionRequestDTO requestDTO) {

        // =====================================================
        // VALIDATION
        // =====================================================

        if (requestDTO == null) {

            throw new RuntimeException(
                    "Transaction request cannot be null."
            );
        }

        if (requestDTO.getInventoryItemId() == null) {

            throw new RuntimeException(
                    "Inventory item ID is required."
            );
        }

        if (requestDTO.getTransactionType() == null) {

            throw new RuntimeException(
                    "Transaction type is required."
            );
        }

        if (requestDTO.getQuantity() == null) {

            throw new RuntimeException(
                    "Quantity is required."
            );
        }

        if (requestDTO.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero."
            );
        }

        // =====================================================
        // STEP 1
        // FIND INVENTORY ITEM
        // =====================================================

        InventoryItem inventoryItem =
                inventoryRepository
                        .findByIdAndStatus(
                                requestDTO.getInventoryItemId(),
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory item not found."
                                )
                        );

        // =====================================================
        // STEP 2
        // FIND ACTUAL ITEM
        // =====================================================

        Item item =
                findItemFromInventoryItem(
                        inventoryItem
                );

        // =====================================================
        // STEP 3
        // GET LOGGED-IN USER
        // =====================================================

        User performedBy =
                getLoggedInUser();

        // =====================================================
        // STEP 4
        // TRANSACTION DATA
        // =====================================================

        Integer quantity =
                requestDTO.getQuantity();

        TransactionType transactionType =
                requestDTO.getTransactionType();

        Integer currentStock =
                item.getCurrentStock() == null
                        ? 0
                        : item.getCurrentStock();

        Integer newStock;

        // =====================================================
        // STEP 5
        // CALCULATE NEW STOCK
        // =====================================================

        switch (transactionType) {

            // -------------------------------------------------
            // STOCK IN
            // -------------------------------------------------

            case STOCK_IN:

                newStock =
                        currentStock + quantity;

                break;

            // -------------------------------------------------
            // STOCK OUT
            // -------------------------------------------------

            case STOCK_OUT:

                if (quantity > currentStock) {

                    throw new RuntimeException(
                            "Insufficient stock. "
                                    + "Available: "
                                    + currentStock
                                    + ", Requested: "
                                    + quantity
                    );
                }

                newStock =
                        currentStock - quantity;

                break;

            // -------------------------------------------------
            // RETURN
            // -------------------------------------------------

            case RETURN:

                newStock =
                        currentStock + quantity;

                break;

            // -------------------------------------------------
            // DAMAGED
            // -------------------------------------------------

            case DAMAGED:

                if (quantity > currentStock) {

                    throw new RuntimeException(
                            "Insufficient stock. "
                                    + "Available: "
                                    + currentStock
                                    + ", Damaged: "
                                    + quantity
                    );
                }

                newStock =
                        currentStock - quantity;

                break;

            // -------------------------------------------------
            // EXPIRED
            // -------------------------------------------------

            case EXPIRED:

                if (quantity > currentStock) {

                    throw new RuntimeException(
                            "Insufficient stock. "
                                    + "Available: "
                                    + currentStock
                                    + ", Expired: "
                                    + quantity
                    );
                }

                newStock =
                        currentStock - quantity;

                break;

            // -------------------------------------------------
            // ADJUSTMENT
            // -------------------------------------------------

            case ADJUSTMENT:

                newStock =
                        quantity;

                break;

            // -------------------------------------------------
            // UNSUPPORTED
            // -------------------------------------------------

            default:

                throw new RuntimeException(
                        "Unsupported transaction type: "
                                + transactionType
                );
        }

        // =====================================================
        // STOCK SAFETY
        // =====================================================

        if (newStock < 0) {

            throw new RuntimeException(
                    "Stock cannot be negative."
            );
        }

        // =====================================================
        // STEP 6
        // UPDATE ITEMS TABLE
        // =====================================================

        item.setCurrentStock(
                newStock
        );

        itemRepository.save(item);

        // =====================================================
        // STEP 7
        // UPDATE INVENTORY_ITEMS TABLE
        // =====================================================

        inventoryItem.setQuantity(
                newStock
        );

        inventoryRepository.save(
                inventoryItem
        );

        // =====================================================
        // STEP 8
        // CREATE TRANSACTION
        // =====================================================

        InventoryTransaction transaction =
                new InventoryTransaction();

        transaction.setTransactionNumber(
                generateTransactionNumber()
        );

        transaction.setInventoryItem(
                inventoryItem
        );

        transaction.setTransactionType(
                transactionType
        );

        transaction.setQuantity(
                quantity
        );

        transaction.setRemarks(
                requestDTO.getRemarks()
        );

        transaction.setTransactionDate(
                LocalDateTime.now()
        );

        transaction.setPerformedBy(
                performedBy
        );

        transaction.setStatus(
                Status.ACTIVE
        );

        // =====================================================
        // STEP 9
        // SAVE TRANSACTION
        // =====================================================

        InventoryTransaction savedTransaction =
                transactionRepository.save(
                        transaction
                );

        // =====================================================
        // STEP 10
        // RETURN RESPONSE
        // =====================================================

        return mapToResponse(
                savedTransaction,
                item
        );
    }

    // =========================================================
    // GET ALL TRANSACTIONS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDTO>
    getAllTransactions() {

        return transactionRepository
                .findAll()
                .stream()
                .filter(transaction ->
                        transaction.getStatus()
                                == Status.ACTIVE
                )
                .map(transaction -> {

                    InventoryItem inventoryItem =
                            transaction.getInventoryItem();

                    Item item =
                            findItemFromInventoryItem(
                                    inventoryItem
                            );

                    return mapToResponse(
                            transaction,
                            item
                    );

                })
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET TRANSACTION BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public InventoryTransactionResponseDTO
    getTransactionById(Long id) {

        InventoryTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transaction not found."
                                )
                        );

        if (transaction.getStatus()
                != Status.ACTIVE) {

            throw new RuntimeException(
                    "Transaction not found."
            );
        }

        Item item =
                findItemFromInventoryItem(
                        transaction.getInventoryItem()
                );

        return mapToResponse(
                transaction,
                item
        );
    }

    // =========================================================
    // GET BY INVENTORY ITEM
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDTO>
    getTransactionsByInventoryItem(
            Long inventoryItemId) {

        InventoryItem inventoryItem =
                inventoryRepository
                        .findByIdAndStatus(
                                inventoryItemId,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory item not found."
                                )
                        );

        Item item =
                findItemFromInventoryItem(
                        inventoryItem
                );

        return transactionRepository
                .findByInventoryItemOrderByTransactionDateDesc(
                        inventoryItem
                )
                .stream()
                .filter(transaction ->
                        transaction.getStatus()
                                == Status.ACTIVE
                )
                .map(transaction ->
                        mapToResponse(
                                transaction,
                                item
                        )
                )
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET BY TYPE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDTO>
    getTransactionsByType(
            TransactionType transactionType) {

        if (transactionType == null) {

            throw new RuntimeException(
                    "Transaction type is required."
            );
        }

        return transactionRepository
                .findByTransactionType(
                        transactionType
                )
                .stream()
                .filter(transaction ->
                        transaction.getStatus()
                                == Status.ACTIVE
                )
                .map(transaction -> {

                    Item item =
                            findItemFromInventoryItem(
                                    transaction
                                            .getInventoryItem()
                            );

                    return mapToResponse(
                            transaction,
                            item
                    );

                })
                .collect(Collectors.toList());
    }

    // =========================================================
    // COMPATIBILITY METHOD
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDTO>
    getTransactionsByType1(
            TransactionType transactionType) {

        return getTransactionsByType(
                transactionType
        );
    }

    // =========================================================
    // GET BY DATE RANGE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDTO>
    getTransactionsByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate) {

        if (startDate == null
                || endDate == null) {

            throw new RuntimeException(
                    "Start date and end date are required."
            );
        }

        if (startDate.isAfter(endDate)) {

            throw new RuntimeException(
                    "Start date cannot be after end date."
            );
        }

        return transactionRepository
                .findByTransactionDateBetween(
                        startDate,
                        endDate
                )
                .stream()
                .filter(transaction ->
                        transaction.getStatus()
                                == Status.ACTIVE
                )
                .map(transaction -> {

                    Item item =
                            findItemFromInventoryItem(
                                    transaction
                                            .getInventoryItem()
                            );

                    return mapToResponse(
                            transaction,
                            item
                    );

                })
                .collect(Collectors.toList());
    }

    // =========================================================
    // DELETE TRANSACTION
    // =========================================================
    //
    // Soft delete only.
    //
    // We deliberately do NOT modify stock here.
    // Any stock correction should happen through
    // an ADJUSTMENT transaction.
    //
    // =========================================================

    @Override
    public void deleteTransaction(Long id) {

        InventoryTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transaction not found."
                                )
                        );

        if (transaction.getStatus()
                != Status.ACTIVE) {

            throw new RuntimeException(
                    "Transaction is already inactive."
            );
        }

        transaction.setStatus(
                Status.INACTIVE
        );

        transactionRepository.save(
                transaction
        );
    }

    // =========================================================
    // MAP RESPONSE
    // =========================================================

    private InventoryTransactionResponseDTO
    mapToResponse(
            InventoryTransaction transaction,
            Item item) {

        InventoryTransactionResponseDTO response =
                new InventoryTransactionResponseDTO();

        response.setId(
                transaction.getId()
        );

        response.setTransactionNumber(
                transaction.getTransactionNumber()
        );

        response.setInventoryItemId(
                transaction
                        .getInventoryItem()
                        .getId()
        );

        response.setItemCode(
                item.getItemCode()
        );

        response.setItemName(
                item.getItemName()
        );

        response.setTransactionType(
                transaction.getTransactionType()
        );

        response.setQuantity(
                transaction.getQuantity()
        );

        response.setRemainingQuantity(
                item.getCurrentStock()
        );

        response.setRemarks(
                transaction.getRemarks()
        );

        response.setTransactionDate(
                transaction.getTransactionDate()
        );

        if (transaction.getPerformedBy()
                != null) {

            response.setPerformedById(
                    transaction
                            .getPerformedBy()
                            .getId()
            );

            response.setPerformedByName(
                    transaction
                            .getPerformedBy()
                            .getFullName()
            );
        }

        return response;
    }
}