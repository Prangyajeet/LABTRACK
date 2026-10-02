package com.prangyajeet.labtrack.breakage.serviceImpl;

import com.prangyajeet.labtrack.breakage.dto.BreakageRequestDTO;
import com.prangyajeet.labtrack.breakage.dto.BreakageResponseDTO;
import com.prangyajeet.labtrack.breakage.dto.BreakageSummaryDTO;
import com.prangyajeet.labtrack.breakage.entity.BreakagePersonType;
import com.prangyajeet.labtrack.breakage.entity.BreakageRecord;
import com.prangyajeet.labtrack.breakage.entity.BreakageRecoveryStatus;
import com.prangyajeet.labtrack.breakage.repository.BreakageRecordRepository;
import com.prangyajeet.labtrack.breakage.service.BreakageService;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.item.entity.Item;
import com.prangyajeet.labtrack.item.repository.ItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Transactional
public class BreakageServiceImpl implements BreakageService {

    private final BreakageRecordRepository breakageRecordRepository;

    private final ItemRepository itemRepository;

    public BreakageServiceImpl(
            BreakageRecordRepository breakageRecordRepository,
            ItemRepository itemRepository) {

        this.breakageRecordRepository =
                breakageRecordRepository;

        this.itemRepository =
                itemRepository;
    }

    @Override
    public BreakageResponseDTO createBreakage(
            BreakageRequestDTO requestDTO) {

        validateRequest(requestDTO);

        Item item =
                itemRepository
                        .findByIdAndStatus(
                                requestDTO.getInventoryItemId(),
                                Status.ACTIVE)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Item not found"));

        Integer currentStock =
                item.getCurrentStock();

        if (currentStock == null) {
            currentStock = 0;
        }

        if (currentStock < requestDTO.getQuantity()) {
            throw new RuntimeException(
                    "Insufficient stock available for breakage");
        }

        /*
         * Deduct broken quantity directly from
         * the actual Item Register stock.
         */
        item.setCurrentStock(
                currentStock - requestDTO.getQuantity()
        );

        itemRepository.save(item);

        BreakageRecord record =
                new BreakageRecord();

        record.setInventoryItem(item);

        record.setBreakageDateTime(
                requestDTO.getBreakageDateTime() != null
                        ? requestDTO.getBreakageDateTime()
                        : LocalDateTime.now()
        );

        record.setQuantity(
                requestDTO.getQuantity()
        );

        record.setResponsibleName(
                requestDTO.getResponsibleName().trim()
        );

        record.setPersonType(
                requestDTO.getPersonType()
        );

        record.setResponsibleId(
                normalize(
                        requestDTO.getResponsibleId()
                )
        );

        record.setDepartmentClassSection(
                normalize(
                        requestDTO.getDepartmentClassSection()
                )
        );

        record.setCause(
                requestDTO.getCause().trim()
        );

        record.setEstimatedCost(
                requestDTO.getEstimatedCost() == null
                        ? BigDecimal.ZERO
                        : requestDTO.getEstimatedCost()
        );

        record.setRecoveryStatus(
                requestDTO.getRecoveryStatus() == null
                        ? BreakageRecoveryStatus.PENDING
                        : requestDTO.getRecoveryStatus()
        );

        record.setRemarks(
                normalize(
                        requestDTO.getRemarks()
                )
        );

        record.setStatus(
                Status.ACTIVE
        );

        BreakageRecord savedRecord =
                breakageRecordRepository.save(record);

        return mapToResponse(savedRecord);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BreakageResponseDTO> getBreakages(
            int page,
            int size,
            String search,
            BreakagePersonType personType,
            BreakageRecoveryStatus recoveryStatus,
            String sortBy,
            String sortDirection) {

        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 10;
        }

        List<BreakageRecord> records =
                breakageRecordRepository
                        .findAllByStatus(
                                Status.ACTIVE
                        );

        String keyword =
                search == null
                        ? ""
                        : search.trim()
                                .toLowerCase(Locale.ROOT);

        records =
                records.stream()
                        .filter(record -> {

                            if (keyword.isBlank()) {
                                return true;
                            }

                            return contains(
                                    record.getResponsibleName(),
                                    keyword
                            )
                                    || contains(
                                    record.getResponsibleId(),
                                    keyword
                            )
                                    || contains(
                                    record.getDepartmentClassSection(),
                                    keyword
                            )
                                    || contains(
                                    record.getCause(),
                                    keyword
                            )
                                    || contains(
                                    record.getRemarks(),
                                    keyword
                            )
                                    || contains(
                                    record.getInventoryItem()
                                            .getItemName(),
                                    keyword
                            )
                                    || contains(
                                    record.getInventoryItem()
                                            .getItemCode(),
                                    keyword
                            );
                        })
                        .filter(record ->
                                personType == null
                                        || record.getPersonType()
                                        == personType
                        )
                        .filter(record ->
                                recoveryStatus == null
                                        || record.getRecoveryStatus()
                                        == recoveryStatus
                        )
                        .collect(Collectors.toList());

        Comparator<BreakageRecord> comparator;

        if ("quantity".equalsIgnoreCase(sortBy)) {

            comparator =
                    Comparator.comparing(
                            BreakageRecord::getQuantity,
                            Comparator.nullsLast(
                                    Comparator.naturalOrder()
                            )
                    );

        } else if (
                "estimatedCost".equalsIgnoreCase(sortBy)) {

            comparator =
                    Comparator.comparing(
                            BreakageRecord::getEstimatedCost,
                            Comparator.nullsLast(
                                    Comparator.naturalOrder()
                            )
                    );

        } else if (
                "responsibleName".equalsIgnoreCase(sortBy)) {

            comparator =
                    Comparator.comparing(
                            BreakageRecord::getResponsibleName,
                            Comparator.nullsLast(
                                    String.CASE_INSENSITIVE_ORDER
                            )
                    );

        } else {

            comparator =
                    Comparator.comparing(
                            BreakageRecord::getBreakageDateTime,
                            Comparator.nullsLast(
                                    Comparator.naturalOrder()
                            )
                    );
        }

        if ("asc".equalsIgnoreCase(sortDirection)) {

            records.sort(comparator);

        } else {

            records.sort(comparator.reversed());
        }

        int totalElements =
                records.size();

        int start =
                Math.min(
                        page * size,
                        totalElements
                );

        int end =
                Math.min(
                        start + size,
                        totalElements
                );

        List<BreakageResponseDTO> content =
                records.subList(start, end)
                        .stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );

        return new PageImpl<>(
                content,
                pageable,
                totalElements
        );
    }

    @Override
    @Transactional(readOnly = true)
    public BreakageResponseDTO getBreakageById(
            Long id) {

        BreakageRecord record =
                breakageRecordRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Breakage record not found"
                                )
                        );

        return mapToResponse(record);
    }

    @Override
    public BreakageResponseDTO updateBreakage(
            Long id,
            BreakageRequestDTO requestDTO) {

        validateRequest(requestDTO);

        BreakageRecord record =
                breakageRecordRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Breakage record not found"
                                )
                        );

        if (!record.getInventoryItem()
                .getId()
                .equals(
                        requestDTO.getInventoryItemId()
                )) {

            throw new RuntimeException(
                    "Inventory item cannot be changed after breakage is logged"
            );
        }

        Item item =
                record.getInventoryItem();

        int oldQuantity =
                record.getQuantity();

        int newQuantity =
                requestDTO.getQuantity();

        int quantityDifference =
                newQuantity - oldQuantity;

        /*
         * If new quantity is greater:
         * deduct additional stock.
         *
         * If new quantity is smaller:
         * restore the difference.
         */
        Integer currentStock =
                item.getCurrentStock();

        if (currentStock == null) {
            currentStock = 0;
        }

        if (quantityDifference > 0) {

            if (currentStock < quantityDifference) {

                throw new RuntimeException(
                        "Insufficient stock available for updated breakage"
                );
            }

            item.setCurrentStock(
                    currentStock - quantityDifference
            );

        } else if (quantityDifference < 0) {

            item.setCurrentStock(
                    currentStock
                            + Math.abs(quantityDifference)
            );
        }

        itemRepository.save(item);

        record.setBreakageDateTime(
                requestDTO.getBreakageDateTime() != null
                        ? requestDTO.getBreakageDateTime()
                        : record.getBreakageDateTime()
        );

        record.setQuantity(
                newQuantity
        );

        record.setResponsibleName(
                requestDTO.getResponsibleName().trim()
        );

        record.setPersonType(
                requestDTO.getPersonType()
        );

        record.setResponsibleId(
                normalize(
                        requestDTO.getResponsibleId()
                )
        );

        record.setDepartmentClassSection(
                normalize(
                        requestDTO.getDepartmentClassSection()
                )
        );

        record.setCause(
                requestDTO.getCause().trim()
        );

        record.setEstimatedCost(
                requestDTO.getEstimatedCost() == null
                        ? BigDecimal.ZERO
                        : requestDTO.getEstimatedCost()
        );

        if (requestDTO.getRecoveryStatus() != null) {

            record.setRecoveryStatus(
                    requestDTO.getRecoveryStatus()
            );
        }

        record.setRemarks(
                normalize(
                        requestDTO.getRemarks()
                )
        );

        return mapToResponse(
                breakageRecordRepository.save(record)
        );
    }

    @Override
    public BreakageResponseDTO updateRecoveryStatus(
            Long id,
            BreakageRecoveryStatus recoveryStatus) {

        if (recoveryStatus == null) {

            throw new RuntimeException(
                    "Recovery status is required"
            );
        }

        BreakageRecord record =
                breakageRecordRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Breakage record not found"
                                )
                        );

        record.setRecoveryStatus(
                recoveryStatus
        );

        return mapToResponse(
                breakageRecordRepository.save(record)
        );
    }

    @Override
    public void deleteBreakage(Long id) {

        BreakageRecord record =
                breakageRecordRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Breakage record not found"
                                )
                        );

        /*
         * Restore the stock when a breakage record
         * is deleted.
         */
        Item item =
                record.getInventoryItem();

        Integer currentStock =
                item.getCurrentStock();

        if (currentStock == null) {
            currentStock = 0;
        }

        item.setCurrentStock(
                currentStock + record.getQuantity()
        );

        itemRepository.save(item);

        record.setStatus(
                Status.INACTIVE
        );

        breakageRecordRepository.save(record);
    }

    @Override
    @Transactional(readOnly = true)
    public BreakageSummaryDTO getSummary() {

        List<BreakageRecord> records =
                breakageRecordRepository
                        .findAllByStatus(
                                Status.ACTIVE
                        );

        BreakageSummaryDTO summary =
                new BreakageSummaryDTO();

        summary.setTotalBreakages(
                records.size()
        );

        BigDecimal totalCost =
                records.stream()
                        .map(
                                BreakageRecord::getEstimatedCost
                        )
                        .filter(
                                cost -> cost != null
                        )
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        summary.setTotalCost(
                totalCost
        );

        summary.setPendingRecovery(
                records.stream()
                        .filter(record ->
                                record.getRecoveryStatus()
                                        == BreakageRecoveryStatus.PENDING
                        )
                        .count()
        );

        summary.setPaidRecovery(
                records.stream()
                        .filter(record ->
                                record.getRecoveryStatus()
                                        == BreakageRecoveryStatus.PAID
                        )
                        .count()
        );

        summary.setWaivedRecovery(
                records.stream()
                        .filter(record ->
                                record.getRecoveryStatus()
                                        == BreakageRecoveryStatus.WAIVED
                        )
                        .count()
        );

        return summary;
    }

    private void validateRequest(
            BreakageRequestDTO requestDTO) {

        if (requestDTO == null) {

            throw new RuntimeException(
                    "Breakage request is required"
            );
        }

        if (requestDTO.getInventoryItemId() == null) {

            throw new RuntimeException(
                    "Inventory item is required"
            );
        }

        if (requestDTO.getQuantity() == null
                || requestDTO.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        if (requestDTO.getResponsibleName() == null
                || requestDTO.getResponsibleName().isBlank()) {

            throw new RuntimeException(
                    "Responsible person name is required"
            );
        }

        if (requestDTO.getPersonType() == null) {

            throw new RuntimeException(
                    "Person type is required"
            );
        }

        if (requestDTO.getCause() == null
                || requestDTO.getCause().isBlank()) {

            throw new RuntimeException(
                    "Cause is required"
            );
        }

        if (requestDTO.getEstimatedCost() != null
                && requestDTO
                .getEstimatedCost()
                .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Estimated cost cannot be negative"
            );
        }
    }

    private boolean contains(
            String value,
            String keyword) {

        return value != null
                && value
                .toLowerCase(Locale.ROOT)
                .contains(keyword);
    }

    private String normalize(
            String value) {

        if (value == null
                || value.isBlank()) {

            return null;
        }

        return value.trim();
    }

    private BreakageResponseDTO mapToResponse(
            BreakageRecord record) {

        BreakageResponseDTO dto =
                new BreakageResponseDTO();

        dto.setId(
                record.getId()
        );

        dto.setInventoryItemId(
                record
                        .getInventoryItem()
                        .getId()
        );

        dto.setItemCode(
                record
                        .getInventoryItem()
                        .getItemCode()
        );

        dto.setItemName(
                record
                        .getInventoryItem()
                        .getItemName()
        );

        dto.setUnit(
                record
                        .getInventoryItem()
                        .getUnit()
        );

        dto.setBreakageDateTime(
                record.getBreakageDateTime()
        );

        dto.setQuantity(
                record.getQuantity()
        );

        dto.setResponsibleName(
                record.getResponsibleName()
        );

        dto.setPersonType(
                record.getPersonType()
        );

        dto.setResponsibleId(
                record.getResponsibleId()
        );

        dto.setDepartmentClassSection(
                record.getDepartmentClassSection()
        );

        dto.setCause(
                record.getCause()
        );

        dto.setEstimatedCost(
                record.getEstimatedCost()
        );

        dto.setRecoveryStatus(
                record.getRecoveryStatus()
        );

        dto.setRemarks(
                record.getRemarks()
        );

        dto.setStatus(
                record.getStatus()
        );

        dto.setCreatedAt(
                record.getCreatedAt()
        );

        dto.setUpdatedAt(
                record.getUpdatedAt()
        );

        return dto;
    }
}