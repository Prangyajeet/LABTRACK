package com.prangyajeet.labtrack.inventory.repository;

import com.prangyajeet.labtrack.category.entity.Category;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    Optional<InventoryItem> findByIdAndStatus(Long id, Status status);

    Optional<InventoryItem> findByItemCode(String itemCode);

    boolean existsByItemCode(String itemCode);

    List<InventoryItem> findAllByStatus(Status status);

    Page<InventoryItem> findAllByStatus(Status status, Pageable pageable);

    List<InventoryItem> findByCategoryIdAndStatus(Long categoryId, Status status);

    List<InventoryItem> findBySupplierIdAndStatus(Long supplierId, Status status);

    List<InventoryItem> findByStorageLocationIdAndStatus(
            Long storageLocationId,
            Status status
    );

    @Query("""
            SELECT i
            FROM InventoryItem i
            WHERE i.status = :status
            AND (
                    LOWER(i.itemName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                 OR LOWER(i.itemCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
                 OR LOWER(i.batchNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    List<InventoryItem> searchInventory(
            String keyword,
            Status status
    );

    List<InventoryItem> findByQuantityLessThanEqualAndStatus(
            Integer quantity,
            Status status
    );

    List<InventoryItem> findByExpiryDateBeforeAndStatus(
            LocalDate date,
            Status status
    );

    List<InventoryItem> findByExpiryDateBetweenAndStatus(
            LocalDate startDate,
            LocalDate endDate,
            Status status
    );

    List<InventoryItem> findByItemNameContainingIgnoreCaseAndStatus(
        String keyword,
        Status status
);
}