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
    private final UserRepository userRepository;

    public InventoryTransactionServiceImpl(
            InventoryTransactionRepository transactionRepository,
            InventoryRepository inventoryRepository,
            UserRepository userRepository) {

        this.transactionRepository = transactionRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
    }

    /**
     * Returns currently logged-in user.
     */
    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository
                .findByEmailAndStatus(email, Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Logged in user not found"));
    }

    /**
     * Generates transaction number.
     * Example:
     * TXN000001
     * TXN000002
     */
    private String generateTransactionNumber() {

        long count = transactionRepository.count() + 1;

        return String.format("TXN%06d", count);
    }

    /**
     * Maps Entity -> Response DTO
     */
    private InventoryTransactionResponseDTO mapToResponse(
            InventoryTransaction transaction) {

        InventoryTransactionResponseDTO dto =
                new InventoryTransactionResponseDTO();

        dto.setId(transaction.getId());

        dto.setTransactionNumber(
                transaction.getTransactionNumber());

        dto.setInventoryItemId(
                transaction.getInventoryItem().getId());

        dto.setItemCode(
                transaction.getInventoryItem().getItemCode());

        dto.setItemName(
                transaction.getInventoryItem().getItemName());

        dto.setTransactionType(
                transaction.getTransactionType());

        dto.setQuantity(
                transaction.getQuantity());

        dto.setRemainingQuantity(
                transaction.getInventoryItem().getQuantity());

        dto.setRemarks(
                transaction.getRemarks());

        dto.setTransactionDate(
                transaction.getTransactionDate());

        dto.setPerformedById(
                transaction.getPerformedBy().getId());

        dto.setPerformedByName(
                transaction.getPerformedBy().getFullName());

        return dto;
    }    @Override
    public InventoryTransactionResponseDTO createTransaction(
            InventoryTransactionRequestDTO requestDTO) {

        InventoryItem inventoryItem = inventoryRepository
                .findByIdAndStatus(
                        requestDTO.getInventoryItemId(),
                        Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Inventory Item not found"));

        User performedBy = getLoggedInUser();

        TransactionType transactionType =
                requestDTO.getTransactionType();

        Integer quantity = requestDTO.getQuantity();

        if (quantity <= 0) {
            throw new RuntimeException(
                    "Transaction quantity must be greater than zero");
        }

        switch (transactionType) {

            case STOCK_IN:

                inventoryItem.setQuantity(
                        inventoryItem.getQuantity() + quantity);

                break;

            case RETURN:

                inventoryItem.setQuantity(
                        inventoryItem.getQuantity() + quantity);

                break;

            case STOCK_OUT:

                if (inventoryItem.getQuantity() < quantity) {
                    throw new RuntimeException(
                            "Insufficient stock available");
                }

                inventoryItem.setQuantity(
                        inventoryItem.getQuantity() - quantity);

                break;

            case DAMAGED:

                if (inventoryItem.getQuantity() < quantity) {
                    throw new RuntimeException(
                            "Insufficient stock available");
                }

                inventoryItem.setQuantity(
                        inventoryItem.getQuantity() - quantity);

                break;

            case EXPIRED:

                if (inventoryItem.getQuantity() < quantity) {
                    throw new RuntimeException(
                            "Insufficient stock available");
                }

                inventoryItem.setQuantity(
                        inventoryItem.getQuantity() - quantity);

                break;

            case ADJUSTMENT:

                inventoryItem.setQuantity(quantity);

                break;

            default:
                throw new RuntimeException(
                        "Invalid Transaction Type");
        }

       
        InventoryTransaction transaction =
                new InventoryTransaction();

        transaction.setTransactionNumber(
                generateTransactionNumber());

        transaction.setInventoryItem(inventoryItem);

        transaction.setTransactionType(transactionType);

        transaction.setQuantity(quantity);

        transaction.setRemarks(requestDTO.getRemarks());

        transaction.setTransactionDate(LocalDateTime.now());

        transaction.setPerformedBy(performedBy);

        transaction.setStatus(Status.ACTIVE);

        InventoryTransaction savedTransaction =
                transactionRepository.save(transaction);

        return mapToResponse(savedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDTO> getAllTransactions() {

        return transactionRepository
                .findAll()
                .stream()
                .filter(transaction ->
                        transaction.getStatus() == Status.ACTIVE)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryTransactionResponseDTO getTransactionById(Long id) {

        InventoryTransaction transaction =
                transactionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transaction not found"));

        if (transaction.getStatus() != Status.ACTIVE) {
            throw new RuntimeException(
                    "Transaction not found");
        }

        return mapToResponse(transaction);
    }    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDTO> getTransactionsByInventoryItem(
            Long inventoryItemId) {

        InventoryItem inventoryItem = inventoryRepository
                .findByIdAndStatus(
                        inventoryItemId,
                        Status.ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException("Inventory Item not found"));

        return transactionRepository
                .findByInventoryItemOrderByTransactionDateDesc(inventoryItem)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDTO> getTransactionsByType(
            TransactionType transactionType) {

        return transactionRepository
                .findByTransactionType(transactionType)
                .stream()
                .filter(transaction ->
                        transaction.getStatus() == Status.ACTIVE)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDTO> getTransactionsByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate) {

        return transactionRepository
                .findByTransactionDateBetween(startDate, endDate)
                .stream()
                .filter(transaction ->
                        transaction.getStatus() == Status.ACTIVE)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTransaction(Long id) {

        InventoryTransaction transaction = transactionRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found"));

        if (transaction.getStatus() != Status.ACTIVE) {
            throw new RuntimeException("Transaction already deleted");
        }

        transaction.setStatus(Status.INACTIVE);

        transactionRepository.save(transaction);
    }

    @Override
    public List<InventoryTransactionResponseDTO> getTransactionsByType1(TransactionType transactionType) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getTransactionsByType1'");
    }

    

   

}