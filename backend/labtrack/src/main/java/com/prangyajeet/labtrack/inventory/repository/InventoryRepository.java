package com.prangyajeet.labtrack.inventory.repository;

import com.prangyajeet.labtrack.category.entity.Category;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    Optional<InventoryItem> findByIdAndStatus(
            Long id,
            Status status
    );

    Optional<InventoryItem> findByItemCode(String itemCode);

    boolean existsByItemCode(String itemCode);

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> findAllByStatus(Status status);

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    Page<InventoryItem> findAllByStatus(
            Status status,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> findByCategoryIdAndStatus(
            Long categoryId,
            Status status
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> findBySupplierIdAndStatus(
            Long supplierId,
            Status status
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
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
    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> searchInventory(
            String keyword,
            Status status
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> findByQuantityLessThanEqualAndStatus(
            Integer quantity,
            Status status
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> findByExpiryDateBeforeAndStatus(
            LocalDate date,
            Status status
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> findByExpiryDateBetweenAndStatus(
            LocalDate startDate,
            LocalDate endDate,
            Status status
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> findByItemNameContainingIgnoreCaseAndStatus(
            String keyword,
            Status status
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> findByIsConsumableTrueAndStatus(
            Status status
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    Optional<InventoryItem> findByIdAndIsConsumableTrueAndStatus(
            Long id,
            Status status
    );

    @EntityGraph(attributePaths = {
            "category",
            "supplier",
            "storageLocation"
    })
    List<InventoryItem> findByIsConsumableTrueAndQuantityLessThanEqualAndStatus(
            Integer quantity,
            Status status
    );
}