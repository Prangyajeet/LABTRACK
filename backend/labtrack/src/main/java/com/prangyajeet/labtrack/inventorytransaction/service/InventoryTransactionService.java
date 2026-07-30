package com.prangyajeet.labtrack.inventorytransaction.service;

import com.prangyajeet.labtrack.common.enums.TransactionType;
import com.prangyajeet.labtrack.inventorytransaction.dto.InventoryTransactionRequestDTO;
import com.prangyajeet.labtrack.inventorytransaction.dto.InventoryTransactionResponseDTO;
import java.time.LocalDateTime;
import java.util.List;

public interface InventoryTransactionService {

   InventoryTransactionResponseDTO createTransaction(
        InventoryTransactionRequestDTO requestDTO
);

    List<InventoryTransactionResponseDTO> getAllTransactions();

    InventoryTransactionResponseDTO getTransactionById(Long id);

    List<InventoryTransactionResponseDTO> getTransactionsByInventoryItem(Long inventoryItemId);

   

    List<InventoryTransactionResponseDTO> getTransactionsByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    void deleteTransaction(Long id);

    public List<InventoryTransactionResponseDTO> getTransactionsByType(
        TransactionType transactionType);

    List<InventoryTransactionResponseDTO> getTransactionsByType1(TransactionType transactionType);

}