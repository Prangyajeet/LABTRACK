package com.prangyajeet.labtrack.inventorytransaction.repository;

import com.prangyajeet.labtrack.common.enums.TransactionType;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;
import com.prangyajeet.labtrack.inventorytransaction.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    Optional<InventoryTransaction> findByTransactionNumber(String transactionNumber);

    List<InventoryTransaction> findByInventoryItem(InventoryItem inventoryItem);

    List<InventoryTransaction> findByTransactionType(TransactionType transactionType);

    List<InventoryTransaction> findByTransactionDateBetween(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    List<InventoryTransaction> findByInventoryItemOrderByTransactionDateDesc(
            InventoryItem inventoryItem
    );

}