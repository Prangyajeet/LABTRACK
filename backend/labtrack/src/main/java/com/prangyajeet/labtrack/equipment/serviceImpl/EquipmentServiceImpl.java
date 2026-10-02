package com.prangyajeet.labtrack.equipment.serviceImpl;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.equipment.dto.EquipmentRequestDTO;
import com.prangyajeet.labtrack.equipment.dto.EquipmentResponseDTO;
import com.prangyajeet.labtrack.equipment.dto.MaintenanceLogRequestDTO;
import com.prangyajeet.labtrack.equipment.dto.MaintenanceLogResponseDTO;
import com.prangyajeet.labtrack.equipment.entity.Equipment;
import com.prangyajeet.labtrack.equipment.entity.EquipmentCategory;
import com.prangyajeet.labtrack.equipment.entity.MaintenanceLog;
import com.prangyajeet.labtrack.equipment.repository.EquipmentRepository;
import com.prangyajeet.labtrack.equipment.repository.MaintenanceLogRepository;
import com.prangyajeet.labtrack.equipment.service.EquipmentService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class EquipmentServiceImpl implements EquipmentService {

    private static final Status ACTIVE = Status.ACTIVE;
    private static final Status INACTIVE = Status.INACTIVE;

    private final EquipmentRepository equipmentRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;

    public EquipmentServiceImpl(
            EquipmentRepository equipmentRepository,
            MaintenanceLogRepository maintenanceLogRepository) {

        this.equipmentRepository = equipmentRepository;
        this.maintenanceLogRepository = maintenanceLogRepository;
    }

    @Override
    public EquipmentResponseDTO createEquipment(
            EquipmentRequestDTO requestDTO) {

        validateEquipment(requestDTO);

        if (equipmentRepository
                .findByEquipmentCode(requestDTO.getEquipmentCode())
                .isPresent()) {

            throw new RuntimeException(
                    "Equipment code already exists");
        }

        if (requestDTO.getSerialNumber() != null
                && !requestDTO.getSerialNumber().isBlank()
                && equipmentRepository
                .findBySerialNumber(requestDTO.getSerialNumber())
                .isPresent()) {

            throw new RuntimeException(
                    "Serial number already exists");
        }

        Equipment equipment = new Equipment();

        mapRequestToEntity(
                requestDTO,
                equipment);

        equipment.setStatus(ACTIVE);

        Equipment saved =
                equipmentRepository.save(equipment);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EquipmentResponseDTO getEquipmentById(
            Long id) {

        Equipment equipment =
                getActiveEquipment(id);

        return mapToResponse(equipment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> getAllEquipment() {

        return equipmentRepository
                .findByStatusOrderByEquipmentNameAsc(ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> getEquipmentByCategory(
            EquipmentCategory category) {

        return equipmentRepository
                .findByCategoryAndStatus(
                        category,
                        ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> searchEquipment(
            String search) {

        if (search == null
                || search.isBlank()) {

            return getAllEquipment();
        }

        return equipmentRepository
                .findByEquipmentNameContainingIgnoreCaseAndStatus(
                        search.trim(),
                        ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public EquipmentResponseDTO updateEquipment(
            Long id,
            EquipmentRequestDTO requestDTO) {

        validateEquipment(requestDTO);

        Equipment equipment =
                getActiveEquipment(id);

        equipmentRepository
                .findByEquipmentCode(
                        requestDTO.getEquipmentCode())
                .ifPresent(existing -> {

                    if (!existing.getId().equals(id)) {

                        throw new RuntimeException(
                                "Equipment code already exists");
                    }
                });

        if (requestDTO.getSerialNumber() != null
                && !requestDTO.getSerialNumber().isBlank()) {

            equipmentRepository
                    .findBySerialNumber(
                            requestDTO.getSerialNumber())
                    .ifPresent(existing -> {

                        if (!existing.getId().equals(id)) {

                            throw new RuntimeException(
                                    "Serial number already exists");
                        }
                    });
        }

        mapRequestToEntity(
                requestDTO,
                equipment);

        Equipment updated =
                equipmentRepository.save(equipment);

        return mapToResponse(updated);
    }

    @Override
    public void deleteEquipment(Long id) {

        Equipment equipment =
                getActiveEquipment(id);

        equipment.setStatus(INACTIVE);

        equipmentRepository.save(equipment);
    }

    @Override
    public void restoreEquipment(Long id) {

        Equipment equipment =
                equipmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Equipment not found"));

        equipment.setStatus(ACTIVE);

        equipmentRepository.save(equipment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> getAmcExpiringSoon() {

        LocalDate today =
                LocalDate.now();

        LocalDate limit =
                today.plusDays(30);

        return equipmentRepository
                .findByStatusOrderByEquipmentNameAsc(ACTIVE)
                .stream()
                .filter(equipment ->
                        equipment.getAmcEnd() != null
                                && !equipment.getAmcEnd()
                                .isBefore(today)
                                && !equipment.getAmcEnd()
                                .isAfter(limit))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> getAmcExpired() {

        LocalDate today =
                LocalDate.now();

        return equipmentRepository
                .findByStatusOrderByEquipmentNameAsc(ACTIVE)
                .stream()
                .filter(equipment ->
                        equipment.getAmcEnd() != null
                                && equipment.getAmcEnd()
                                .isBefore(today))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> getMaintenanceDue() {

        LocalDate today =
                LocalDate.now();

        LocalDate limit =
                today.plusDays(14);

        return equipmentRepository
                .findByStatusOrderByEquipmentNameAsc(ACTIVE)
                .stream()
                .filter(equipment ->
                        equipment.getNextMaintenanceDate() != null
                                && !equipment
                                .getNextMaintenanceDate()
                                .isAfter(limit))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public MaintenanceLogResponseDTO createMaintenanceLog(
            MaintenanceLogRequestDTO requestDTO) {

        Equipment equipment =
                getActiveEquipment(
                        requestDTO.getEquipmentId());

        MaintenanceLog log =
                new MaintenanceLog();

        log.setEquipment(equipment);

        log.setMaintenanceDate(
                requestDTO.getMaintenanceDate());

        log.setMaintenanceType(
                requestDTO.getMaintenanceType());

        log.setPerformedBy(
                requestDTO.getPerformedBy());

        log.setCost(
                requestDTO.getCost());

        log.setNotes(
                requestDTO.getNotes());

        log.setNextScheduledDate(
                requestDTO.getNextScheduledDate());

        MaintenanceLog saved =
                maintenanceLogRepository.save(log);

        equipment.setLastMaintenanceDate(
                requestDTO.getMaintenanceDate());

        equipment.setNextMaintenanceDate(
                requestDTO.getNextScheduledDate());

        equipmentRepository.save(equipment);

        return mapMaintenanceToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceLogResponseDTO>
    getMaintenanceLogs(Long equipmentId) {

        getActiveEquipment(equipmentId);

        return maintenanceLogRepository
                .findByEquipmentIdOrderByMaintenanceDateDesc(
                        equipmentId)
                .stream()
                .map(this::mapMaintenanceToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceLogResponseDTO>
    getAllMaintenanceLogs() {

        return maintenanceLogRepository
                .findAllByOrderByMaintenanceDateDesc()
                .stream()
                .map(this::mapMaintenanceToResponse)
                .toList();
    }

    private Equipment getActiveEquipment(Long id) {

        return equipmentRepository
                .findByIdAndStatus(
                        id,
                        ACTIVE)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Equipment not found"));
    }

    private void validateEquipment(
            EquipmentRequestDTO requestDTO) {

        if (requestDTO.getAmcStart() != null
                && requestDTO.getAmcEnd() != null
                && requestDTO.getAmcEnd()
                .isBefore(requestDTO.getAmcStart())) {

            throw new RuntimeException(
                    "AMC end date cannot be before AMC start date");
        }

        if (requestDTO.getWarrantyUntil() != null
                && requestDTO.getPurchaseDate() != null
                && requestDTO.getWarrantyUntil()
                .isBefore(requestDTO.getPurchaseDate())) {

            throw new RuntimeException(
                    "Warranty expiry cannot be before purchase date");
        }
    }

    private void mapRequestToEntity(
            EquipmentRequestDTO request,
            Equipment equipment) {

        equipment.setEquipmentName(
                request.getEquipmentName());

        equipment.setEquipmentCode(
                request.getEquipmentCode());

        equipment.setCategory(
                request.getCategory());

        equipment.setManufacturer(
                request.getManufacturer());

        equipment.setModel(
                request.getModel());

        equipment.setSerialNumber(
                request.getSerialNumber());

        equipment.setPurchaseDate(
                request.getPurchaseDate());

        equipment.setPurchaseCost(
                request.getPurchaseCost());

        equipment.setWarrantyUntil(
                request.getWarrantyUntil());

        equipment.setLocation(
                request.getLocation());

        equipment.setAmcProvider(
                request.getAmcProvider());

        equipment.setAmcContact(
                request.getAmcContact());

        equipment.setAmcStart(
                request.getAmcStart());

        equipment.setAmcEnd(
                request.getAmcEnd());

        equipment.setAmcCostPerYear(
                request.getAmcCostPerYear());

        equipment.setAmcType(
                request.getAmcType());

        equipment.setAmcCoverageNotes(
                request.getAmcCoverageNotes());

        equipment.setLastMaintenanceDate(
                request.getLastMaintenanceDate());

        equipment.setNextMaintenanceDate(
                request.getNextMaintenanceDate());
    }

    private EquipmentResponseDTO mapToResponse(
            Equipment equipment) {

        EquipmentResponseDTO dto =
                new EquipmentResponseDTO();

        dto.setId(
                equipment.getId());

        dto.setEquipmentName(
                equipment.getEquipmentName());

        dto.setEquipmentCode(
                equipment.getEquipmentCode());

        dto.setCategory(
                equipment.getCategory());

        dto.setManufacturer(
                equipment.getManufacturer());

        dto.setModel(
                equipment.getModel());

        dto.setSerialNumber(
                equipment.getSerialNumber());

        dto.setPurchaseDate(
                equipment.getPurchaseDate());

        dto.setPurchaseCost(
                equipment.getPurchaseCost());

        dto.setWarrantyUntil(
                equipment.getWarrantyUntil());

        dto.setLocation(
                equipment.getLocation());

        dto.setAmcProvider(
                equipment.getAmcProvider());

        dto.setAmcContact(
                equipment.getAmcContact());

        dto.setAmcStart(
                equipment.getAmcStart());

        dto.setAmcEnd(
                equipment.getAmcEnd());

        dto.setAmcCostPerYear(
                equipment.getAmcCostPerYear());

        dto.setAmcType(
                equipment.getAmcType());

        dto.setAmcCoverageNotes(
                equipment.getAmcCoverageNotes());

        dto.setLastMaintenanceDate(
                equipment.getLastMaintenanceDate());

        dto.setNextMaintenanceDate(
                equipment.getNextMaintenanceDate());

        dto.setAmcStatus(
                calculateAmcStatus(equipment));

        dto.setMaintenanceDue(
                calculateMaintenanceDue(equipment));

        dto.setStatus(
                equipment.getStatus() != null
                        ? equipment.getStatus().name()
                        : null);

        dto.setCreatedAt(
                equipment.getCreatedAt());

        dto.setUpdatedAt(
                equipment.getUpdatedAt());

        return dto;
    }

    private String calculateAmcStatus(
            Equipment equipment) {

        if (equipment.getAmcEnd() == null) {

            return "NO_AMC";
        }

        LocalDate today =
                LocalDate.now();

        if (equipment.getAmcEnd()
                .isBefore(today)) {

            return "EXPIRED";
        }

        if (equipment.getAmcStart() != null
                && equipment.getAmcStart()
                .isAfter(today)) {

            return "NOT_STARTED";
        }

        if (!equipment.getAmcEnd()
                .isAfter(today.plusDays(30))) {

            return "EXPIRING_SOON";
        }

        return "ACTIVE";
    }

    private boolean calculateMaintenanceDue(
            Equipment equipment) {

        if (equipment.getNextMaintenanceDate()
                == null) {

            return false;
        }

        LocalDate today =
                LocalDate.now();

        return !equipment
                .getNextMaintenanceDate()
                .isAfter(today.plusDays(14));
    }

    private MaintenanceLogResponseDTO
    mapMaintenanceToResponse(
            MaintenanceLog log) {

        MaintenanceLogResponseDTO dto =
                new MaintenanceLogResponseDTO();

        dto.setId(
                log.getId());

        dto.setEquipmentId(
                log.getEquipment().getId());

        dto.setEquipmentName(
                log.getEquipment()
                        .getEquipmentName());

        dto.setEquipmentCode(
                log.getEquipment()
                        .getEquipmentCode());

        dto.setMaintenanceDate(
                log.getMaintenanceDate());

        dto.setMaintenanceType(
                log.getMaintenanceType());

        dto.setPerformedBy(
                log.getPerformedBy());

        dto.setCost(
                log.getCost());

        dto.setNotes(
                log.getNotes());

        dto.setNextScheduledDate(
                log.getNextScheduledDate());

        dto.setCreatedAt(
                log.getCreatedAt());

        return dto;
    }
}