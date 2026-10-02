package com.prangyajeet.labtrack.equipment.service;

import com.prangyajeet.labtrack.equipment.dto.EquipmentRequestDTO;
import com.prangyajeet.labtrack.equipment.dto.EquipmentResponseDTO;
import com.prangyajeet.labtrack.equipment.dto.MaintenanceLogRequestDTO;
import com.prangyajeet.labtrack.equipment.dto.MaintenanceLogResponseDTO;
import com.prangyajeet.labtrack.equipment.entity.EquipmentCategory;

import java.util.List;

public interface EquipmentService {

    EquipmentResponseDTO createEquipment(
            EquipmentRequestDTO requestDTO
    );

    EquipmentResponseDTO getEquipmentById(
            Long id
    );

    List<EquipmentResponseDTO> getAllEquipment();

    List<EquipmentResponseDTO> getEquipmentByCategory(
            EquipmentCategory category
    );

    List<EquipmentResponseDTO> searchEquipment(
            String search
    );

    EquipmentResponseDTO updateEquipment(
            Long id,
            EquipmentRequestDTO requestDTO
    );

    void deleteEquipment(
            Long id
    );

    void restoreEquipment(
            Long id
    );

    List<EquipmentResponseDTO> getAmcExpiringSoon();

    List<EquipmentResponseDTO> getAmcExpired();

    List<EquipmentResponseDTO> getMaintenanceDue();

    MaintenanceLogResponseDTO createMaintenanceLog(
            MaintenanceLogRequestDTO requestDTO
    );

    List<MaintenanceLogResponseDTO> getMaintenanceLogs(
            Long equipmentId
    );

    List<MaintenanceLogResponseDTO> getAllMaintenanceLogs();
}