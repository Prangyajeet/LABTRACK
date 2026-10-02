package com.prangyajeet.labtrack.equipment.repository;

import com.prangyajeet.labtrack.equipment.entity.AmcDocument;
import com.prangyajeet.labtrack.equipment.entity.Equipment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AmcDocumentRepository
        extends JpaRepository<AmcDocument, Long> {

    /*
     * ============================================================
     * FIND DOCUMENTS OF EQUIPMENT
     * ============================================================
     */

    List<AmcDocument> findByEquipmentOrderByCreatedAtDesc(
            Equipment equipment
    );

    /*
     * ============================================================
     * FIND DOCUMENT BY ID + EQUIPMENT
     * ============================================================
     *
     * This prevents one equipment from accessing another
     * equipment's document.
     */

    Optional<AmcDocument> findByIdAndEquipment(
            Long id,
            Equipment equipment
    );
}