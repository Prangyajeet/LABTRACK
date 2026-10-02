package com.prangyajeet.labtrack.item.repository;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.item.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    Optional<Item> findByIdAndStatus(
            Long id,
            Status status
    );

    Page<Item> findByStatusAndItemNameContainingIgnoreCase(
            Status status,
            String search,
            Pageable pageable
    );

    List<Item> findAllByStatus(
            Status status
    );

    Optional<Item> findByItemCode(
            String itemCode
    );

    Optional<Item> findByCategoryIdAndItemName(
            Long categoryId,
            String itemName
    );

    boolean existsByCategoryIdAndItemNameAndStatus(
            Long categoryId,
            String itemName,
            Status status
    );

    boolean existsByItemCode(
            String itemCode
    );

}