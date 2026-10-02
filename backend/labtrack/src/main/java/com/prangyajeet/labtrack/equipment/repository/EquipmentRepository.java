package com.prangyajeet.labtrack.equipment.repository;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.equipment.entity.Equipment;
import com.prangyajeet.labtrack.equipment.entity.EquipmentCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Optional<Equipment> findByIdAndStatus(
            Long id,
            Status status
    );

    Optional<Equipment> findByEquipmentCode(
            String equipmentCode
    );

    Optional<Equipment> findBySerialNumber(
            String serialNumber
    );

    List<Equipment> findByStatusOrderByEquipmentNameAsc(
            Status status
    );

    List<Equipment> findByCategoryAndStatus(
            EquipmentCategory category,
            Status status
    );

    List<Equipment> findByNextMaintenanceDateLessThanEqualAndStatus(
            LocalDate date,
            Status status
    );

    List<Equipment> findByAmcEndLessThanEqualAndStatus(
            LocalDate date,
            Status status
    );

    List<Equipment> findByEquipmentNameContainingIgnoreCaseAndStatus(
            String equipmentName,
            Status status
    );
}