package com.prangyajeet.labtrack.equipment.repository;

import com.prangyajeet.labtrack.equipment.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceLogRepository
        extends JpaRepository<MaintenanceLog, Long> {

    List<MaintenanceLog>
    findByEquipmentIdOrderByMaintenanceDateDesc(
            Long equipmentId
    );

    List<MaintenanceLog>
    findAllByOrderByMaintenanceDateDesc();
}