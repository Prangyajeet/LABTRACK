package com.prangyajeet.labtrack.issue_return.service;

import com.prangyajeet.labtrack.auth.entity.User;
import com.prangyajeet.labtrack.auth.repository.UserRepository;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.common.enums.TransactionType;
import com.prangyajeet.labtrack.department.entity.Department;
import com.prangyajeet.labtrack.department.repository.DepartmentRepository;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;
import com.prangyajeet.labtrack.inventory.repository.InventoryRepository;
import com.prangyajeet.labtrack.inventorytransaction.dto.InventoryTransactionRequestDTO;
import com.prangyajeet.labtrack.inventorytransaction.service.InventoryTransactionService;
import com.prangyajeet.labtrack.issue_return.dto.IssueItemRequestDTO;
import com.prangyajeet.labtrack.issue_return.dto.IssueReturnResponseDTO;
import com.prangyajeet.labtrack.issue_return.dto.IssueReturnSummaryDTO;
import com.prangyajeet.labtrack.issue_return.dto.RecordReturnRequestDTO;
import com.prangyajeet.labtrack.issue_return.entity.IssueReturn;
import com.prangyajeet.labtrack.issue_return.enums.IssueStatus;
import com.prangyajeet.labtrack.issue_return.enums.IssuedToType;
import com.prangyajeet.labtrack.issue_return.enums.ReturnCondition;
import com.prangyajeet.labtrack.issue_return.repository.IssueReturnRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;


@Service
@Transactional
public class IssueReturnServiceImpl
        implements IssueReturnService {


    private final IssueReturnRepository issueReturnRepository;

    private final InventoryRepository inventoryRepository;

    private final InventoryTransactionService inventoryTransactionService;

    private final DepartmentRepository departmentRepository;

    private final UserRepository userRepository;


    public IssueReturnServiceImpl(
            IssueReturnRepository issueReturnRepository,
            InventoryRepository inventoryRepository,
            InventoryTransactionService inventoryTransactionService,
            DepartmentRepository departmentRepository,
            UserRepository userRepository
    ) {

        this.issueReturnRepository =
                issueReturnRepository;

        this.inventoryRepository =
                inventoryRepository;

        this.inventoryTransactionService =
                inventoryTransactionService;

        this.departmentRepository =
                departmentRepository;

        this.userRepository =
                userRepository;
    }


    // =========================================================
    // ISSUE ITEM
    // =========================================================

    @Override
    public IssueReturnResponseDTO issueItem(
            IssueItemRequestDTO request
    ) {

        validateIssueRequest(request);


        // -----------------------------------------------------
        // CURRENT USER
        // -----------------------------------------------------

        User currentUser =
                getCurrentUser();


        // -----------------------------------------------------
        // INVENTORY ITEM
        // -----------------------------------------------------

        InventoryItem inventoryItem =
                inventoryRepository
                        .findByIdAndStatus(
                                request.getInventoryItemId(),
                                Status.ACTIVE
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Inventory item not found or inactive: "
                                                        + request.getInventoryItemId()
                                        )
                        );


        // -----------------------------------------------------
        // STOCK CHECK
        // -----------------------------------------------------

        Integer availableQuantity =
                inventoryItem.getQuantity() == null
                        ? 0
                        : inventoryItem.getQuantity();


        Integer issueQuantity =
                request.getQuantity();


        if (issueQuantity <= 0) {

            throw new RuntimeException(
                    "Issue quantity must be greater than zero."
            );
        }


        if (issueQuantity > availableQuantity) {

            throw new RuntimeException(
                    "Insufficient stock. Available quantity: "
                            + availableQuantity
            );
        }


        // -----------------------------------------------------
        // DEPARTMENT
        // -----------------------------------------------------

        Department department =
                null;


        if (request.getDepartmentId() != null) {

            department =
                    departmentRepository
                            .findByIdAndStatus(
                                    request.getDepartmentId(),
                                    Status.ACTIVE
                            )
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "Department not found or inactive: "
                                                            + request.getDepartmentId()
                                            )
                            );
        }


        // -----------------------------------------------------
        // STOCK OUT TRANSACTION
        // -----------------------------------------------------
        //
        // IMPORTANT:
        // Do NOT manually deduct inventory here.
        //
        // Existing InventoryTransactionService is responsible
        // for the actual stock movement.
        //
        // Because this entire service is @Transactional,
        // if saving IssueReturn fails afterwards,
        // the stock transaction is rolled back.
        //
        // -----------------------------------------------------

        InventoryTransactionRequestDTO transactionRequest =
                new InventoryTransactionRequestDTO();


        transactionRequest.setInventoryItemId(
                request.getInventoryItemId()
        );


        transactionRequest.setTransactionType(
                TransactionType.STOCK_OUT
        );


        transactionRequest.setQuantity(
                issueQuantity
        );


        transactionRequest.setRemarks(
                buildIssueTransactionRemarks(
                        request
                )
        );


        inventoryTransactionService
                .createTransaction(
                        transactionRequest
                );


        // -----------------------------------------------------
        // CREATE ISSUE RECORD
        // -----------------------------------------------------

        IssueReturn issueReturn =
                new IssueReturn();


        issueReturn.setIssueNumber(
                generateIssueNumber()
        );


        issueReturn.setInventoryItem(
                inventoryItem
        );


        issueReturn.setQuantity(
                issueQuantity
        );


        issueReturn.setIssuedQuantity(
                issueQuantity
        );


        issueReturn.setIssueDate(
                request.getIssueDate() != null
                        ? request.getIssueDate()
                        : LocalDate.now()
        );


        issueReturn.setExpectedReturnDate(
                request.getExpectedReturnDate()
        );


        /*
         * IMPORTANT:
         *
         * issuedToType is already an enum in the DTO.
         *
         * Do NOT call .trim()
         * and do NOT parse it as String.
         */

        issueReturn.setIssuedToType(
                request.getIssuedToType()
        );


        issueReturn.setIssuedToName(
                normalize(
                        request.getIssuedToName()
                )
        );


        issueReturn.setEmployeeNo(
                normalize(
                        request.getEmployeeNo()
                )
        );


        issueReturn.setDepartment(
                department
        );


        issueReturn.setPurpose(
                normalize(
                        request.getPurpose()
                )
        );


        issueReturn.setRemarks(
                normalize(
                        request.getRemarks()
                )
        );


        // -----------------------------------------------------
        // BUSINESS STATUS
        // -----------------------------------------------------
        //
        // IMPORTANT:
        //
        // IssueReturn has its own IssueStatus:
        //
        // ISSUED
        // RETURNED
        // OVERDUE
        //
        // Therefore use setIssueStatus().
        //
        // DO NOT use:
        //
        // setStatus(IssueStatus.ISSUED)
        //
        // -----------------------------------------------------

        issueReturn.setIssueStatus(
                IssueStatus.ISSUED
        );


        // -----------------------------------------------------
        // ISSUED BY
        // -----------------------------------------------------

        issueReturn.setIssuedBy(
                currentUser
        );


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        IssueReturn saved =
                issueReturnRepository.save(
                        issueReturn
                );


        return mapToResponseDTO(
                saved
        );
    }


    // =========================================================
    // RECORD RETURN
    // =========================================================

    @Override
    public IssueReturnResponseDTO recordReturn(
            RecordReturnRequestDTO request
    ) {

        validateReturnRequest(
                request
        );


        // -----------------------------------------------------
        // CURRENT USER
        // -----------------------------------------------------

        User currentUser =
                getCurrentUser();


        // -----------------------------------------------------
        // FIND ISSUE
        // -----------------------------------------------------

        IssueReturn issueReturn =
                issueReturnRepository
                        .findById(
                                request.getIssueReturnId()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Issue/Return record not found with id: "
                                                        + request.getIssueReturnId()
                                        )
                        );


        // -----------------------------------------------------
        // BUSINESS STATUS CHECK
        // -----------------------------------------------------

        IssueStatus currentIssueStatus =
                issueReturn.getIssueStatus();


        if (
                currentIssueStatus ==
                        IssueStatus.RETURNED
        ) {

            throw new RuntimeException(
                    "This item has already been fully returned."
            );
        }


        if (
                currentIssueStatus != IssueStatus.ISSUED
                        &&
                currentIssueStatus != IssueStatus.OVERDUE
        ) {

            throw new RuntimeException(
                    "This issue record cannot be returned."
            );
        }


        // -----------------------------------------------------
        // REMAINING / ISSUED QUANTITY
        // -----------------------------------------------------
        //
        // quantity stores the quantity still outside the laboratory.
        // issuedQuantity stores the original quantity issued.
        //

        Integer remainingQuantity =
                issueReturn.getQuantity() == null
                        ? 0
                        : issueReturn.getQuantity();


        Integer issuedQuantity =
                issueReturn.getIssuedQuantity();


        // Backward compatibility for records created before
        // issuedQuantity was introduced.
        if (issuedQuantity == null) {

            issuedQuantity =
                    remainingQuantity;

            issueReturn.setIssuedQuantity(
                    issuedQuantity
            );
        }


        Integer returnQuantity =
                request.getQuantityReturned();


        if (returnQuantity == null
                || returnQuantity <= 0) {

            throw new RuntimeException(
                    "Returned quantity must be greater than zero."
            );
        }


        if (returnQuantity > remainingQuantity) {

            throw new RuntimeException(
                    "Returned quantity cannot exceed the remaining quantity. "
                            + "Currently remaining: "
                            + remainingQuantity
            );
        }


        // -----------------------------------------------------
        // INVENTORY ITEM
        // -----------------------------------------------------

        InventoryItem inventoryItem =
                issueReturn.getInventoryItem();


        if (inventoryItem == null) {

            throw new RuntimeException(
                    "Inventory item associated with this issue was not found."
            );
        }


        if (
                inventoryItem.getStatus() != null
                        &&
                inventoryItem.getStatus()
                        != Status.ACTIVE
        ) {

            throw new RuntimeException(
                    "Inventory item is inactive."
            );
        }


        // -----------------------------------------------------
        // RETURN TRANSACTION
        // -----------------------------------------------------
        //
        // Existing InventoryTransactionService supports:
        //
        // RETURN
        //
        // There is NO returnStock() method in the current
        // InventoryTransactionService.
        //
        // -----------------------------------------------------

        InventoryTransactionRequestDTO transactionRequest =
                new InventoryTransactionRequestDTO();


        transactionRequest.setInventoryItemId(
                inventoryItem.getId()
        );


        transactionRequest.setTransactionType(
                TransactionType.RETURN
        );


        transactionRequest.setQuantity(
                returnQuantity
        );


        transactionRequest.setRemarks(
                buildReturnTransactionRemarks(
                        issueReturn,
                        request
                )
        );


        inventoryTransactionService
                .createTransaction(
                        transactionRequest
                );


        // -----------------------------------------------------
        // RETURN DATE
        // -----------------------------------------------------
        //
        // DTO uses getReturnDate().
        //
        // -----------------------------------------------------

        LocalDate returnDate =
                request.getReturnDate() != null
                        ? request.getReturnDate()
                        : LocalDate.now();


        issueReturn.setActualReturnDate(
                returnDate
        );


        // -----------------------------------------------------
        // RETURN CONDITION
        // -----------------------------------------------------
        //
        // DTO uses getReturnCondition().
        //
        // NOT getCondition().
        //
        // -----------------------------------------------------

        ReturnCondition returnCondition =
                request.getReturnCondition();


        issueReturn.setReturnCondition(
                returnCondition != null
                        ? returnCondition
                        : ReturnCondition.GOOD
        );


        // -----------------------------------------------------
        // RETURN REMARKS
        // -----------------------------------------------------

        if (
                request.getRemarks() != null
                        &&
                !request.getRemarks()
                        .trim()
                        .isEmpty()
        ) {

            issueReturn.setRemarks(
                    request.getRemarks()
                            .trim()
            );
        }


        // -----------------------------------------------------
        // RETURNED BY
        // -----------------------------------------------------

        issueReturn.setReturnedBy(
                currentUser
        );


        // -----------------------------------------------------
        // PARTIAL / FULL RETURN
        // -----------------------------------------------------

        if (
                returnQuantity <
                        remainingQuantity
        ) {

            /*
             * Partial return.
             *
             * Example:
             *
             * Issued = 10
             * Returned = 4
             * Remaining = 6
             *
             * issuedQuantity remains 10.
             * quantity becomes 6.
             */

            issueReturn.setQuantity(
                    remainingQuantity -
                            returnQuantity
            );


            issueReturn.setIssueStatus(
                    IssueStatus.ISSUED
            );

        }
        else {

            /*
             * Full return.
             *
             * Keep the original issued quantity intact.
             * quantity becomes 0 because nothing remains outside.
             */

            issueReturn.setQuantity(
                    0
            );


            issueReturn.setIssueStatus(
                    IssueStatus.RETURNED
            );
        }


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        IssueReturn saved =
                issueReturnRepository.save(
                        issueReturn
                );


        return mapToResponseDTO(
                saved
        );
    }


    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional
    public List<IssueReturnResponseDTO> getAll(
            String search,
            IssueStatus status,
            IssuedToType issuedToType,
            Long departmentId
    ) {

        /*
         * Update overdue statuses before returning
         * records.
         */

        updateOverdueStatuses();


        List<IssueReturn> records =
                issueReturnRepository.findAll();


        // -----------------------------------------------------
        // SEARCH
        // -----------------------------------------------------

        String normalizedSearch =
                search == null
                        ? ""
                        : search.trim()
                                .toLowerCase(
                                        Locale.ROOT
                                );


        // -----------------------------------------------------
        // FILTER SEARCH
        // -----------------------------------------------------

        if (!normalizedSearch.isEmpty()) {

            records =
                    records.stream()
                            .filter(
                                    record ->
                                            matchesSearch(
                                                    record,
                                                    normalizedSearch
                                            )
                            )
                            .collect(
                                    Collectors.toList()
                            );
        }


        // -----------------------------------------------------
        // STATUS FILTER
        // -----------------------------------------------------

        if (status != null) {

            records =
                    records.stream()
                            .filter(
                                    record ->
                                            record.getIssueStatus()
                                                    == status
                            )
                            .collect(
                                    Collectors.toList()
                            );
        }


        // -----------------------------------------------------
        // ISSUED TO TYPE FILTER
        // -----------------------------------------------------

        if (issuedToType != null) {

            records =
                    records.stream()
                            .filter(
                                    record ->
                                            record.getIssuedToType()
                                                    == issuedToType
                            )
                            .collect(
                                    Collectors.toList()
                            );
        }


        // -----------------------------------------------------
        // DEPARTMENT FILTER
        // -----------------------------------------------------

        if (departmentId != null) {

            records =
                    records.stream()
                            .filter(
                                    record ->
                                            record.getDepartment() != null
                                                    &&
                                            departmentId.equals(
                                                    record.getDepartment()
                                                            .getId()
                                            )
                            )
                            .collect(
                                    Collectors.toList()
                            );
        }


        // -----------------------------------------------------
        // SORT
        // -----------------------------------------------------

        records.sort(
                Comparator
                        .comparing(
                                IssueReturn::getIssueDate,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
        );


        // -----------------------------------------------------
        // MAP
        // -----------------------------------------------------

        return records.stream()
                .map(
                        this::mapToResponseDTO
                )
                .collect(
                        Collectors.toList()
                );
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public IssueReturnResponseDTO getById(
            Long id
    ) {

        if (id == null) {

            throw new RuntimeException(
                    "Issue/Return record ID is required."
            );
        }


        updateOverdueStatuses();


        IssueReturn issueReturn =
                issueReturnRepository
                        .findById(
                                id
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Issue/Return record not found with id: "
                                                        + id
                                        )
                        );


        return mapToResponseDTO(
                issueReturn
        );
    }


    // =========================================================
    // SUMMARY
    // =========================================================

    @Override
    @Transactional
    public IssueReturnSummaryDTO getSummary() {

        updateOverdueStatuses();


        List<IssueReturn> records =
                issueReturnRepository.findAll();


        // -----------------------------------------------------
        // TOTAL ISSUED
        // -----------------------------------------------------
        //
        // Every issue record represents an item that was issued.
        //
        // Returned records are still counted in Total Issued.
        //
        // -----------------------------------------------------

        long totalIssued =
                records.stream()
                        .filter(
                                record ->
                                        record.getIssueStatus()
                                                == IssueStatus.ISSUED
                                                ||
                                        record.getIssueStatus()
                                                == IssueStatus.RETURNED
                                                ||
                                        record.getIssueStatus()
                                                == IssueStatus.OVERDUE
                        )
                        .count();


        // -----------------------------------------------------
        // RETURNED
        // -----------------------------------------------------

        long returned =
                records.stream()
                        .filter(
                                record ->
                                        record.getIssueStatus()
                                                == IssueStatus.RETURNED
                        )
                        .count();


        // -----------------------------------------------------
        // OVERDUE
        // -----------------------------------------------------

        long overdue =
                records.stream()
                        .filter(
                                record ->
                                        record.getIssueStatus()
                                                == IssueStatus.OVERDUE
                        )
                        .count();


        IssueReturnSummaryDTO summary =
                new IssueReturnSummaryDTO();


        summary.setTotalIssued(
                totalIssued
        );


        summary.setReturned(
                returned
        );


        summary.setOverdue(
                overdue
        );


        return summary;
    }


    // =========================================================
    // DELETE
    // =========================================================
    //
    // We do NOT allow deleting an item which is still outside
    // the laboratory.
    //
    // A return must be recorded first.
    //
    // For returned records, the register record can be deleted.
    //
    // The actual inventory transaction history remains intact.
    //
    // =========================================================

    @Override
    public void delete(
            Long id
    ) {

        IssueReturn issueReturn =
                issueReturnRepository
                        .findById(
                                id
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Issue/Return record not found with id: "
                                                        + id
                                        )
                        );


        if (
                issueReturn.getIssueStatus()
                        == IssueStatus.ISSUED
                        ||
                issueReturn.getIssueStatus()
                        == IssueStatus.OVERDUE
        ) {

            throw new RuntimeException(
                    "Cannot delete an active issue. "
                            + "Record the return first."
            );
        }


        issueReturnRepository.delete(
                issueReturn
        );
    }


    // =========================================================
    // UPDATE OVERDUE STATUSES
    // =========================================================

    private void updateOverdueStatuses() {

        List<IssueReturn> records =
                issueReturnRepository.findAll();


        LocalDate today =
                LocalDate.now();


        for (
                IssueReturn record :
                records
        ) {

            IssueStatus currentStatus =
                    record.getIssueStatus();


            // -------------------------------------------------
            // ISSUED -> OVERDUE
            // -------------------------------------------------

            if (
                    currentStatus ==
                            IssueStatus.ISSUED
            ) {

                LocalDate expectedReturnDate =
                        record.getExpectedReturnDate();


                if (
                        expectedReturnDate != null
                                &&
                        expectedReturnDate.isBefore(
                                today
                        )
                ) {

                    record.setIssueStatus(
                            IssueStatus.OVERDUE
                    );


                    issueReturnRepository.save(
                            record
                    );
                }
            }


            // -------------------------------------------------
            // OVERDUE -> ISSUED
            // -------------------------------------------------
            //
            // This can happen if the expected return date is
            // changed by future functionality.
            //
            // -------------------------------------------------

            else if (
                    currentStatus ==
                            IssueStatus.OVERDUE
            ) {

                LocalDate expectedReturnDate =
                        record.getExpectedReturnDate();


                if (
                        expectedReturnDate != null
                                &&
                        !expectedReturnDate.isBefore(
                                today
                        )
                ) {

                    record.setIssueStatus(
                            IssueStatus.ISSUED
                    );


                    issueReturnRepository.save(
                            record
                    );
                }
            }
        }
    }


    // =========================================================
    // SEARCH MATCH
    // =========================================================

    private boolean matchesSearch(
            IssueReturn record,
            String search
    ) {

        if (record == null) {
            return false;
        }


        // -----------------------------------------------------
        // ITEM
        // -----------------------------------------------------

        if (
                record.getInventoryItem() != null
        ) {

            InventoryItem item =
                    record.getInventoryItem();


            if (
                    contains(
                            item.getItemName(),
                            search
                    )
                    ||
                    contains(
                            item.getItemCode(),
                            search
                    )
            ) {

                return true;
            }
        }


        // -----------------------------------------------------
        // ISSUE NUMBER
        // -----------------------------------------------------

        if (
                contains(
                        record.getIssueNumber(),
                        search
                )
        ) {

            return true;
        }


        // -----------------------------------------------------
        // ISSUED PERSON
        // -----------------------------------------------------

        if (
                contains(
                        record.getIssuedToName(),
                        search
                )
        ) {

            return true;
        }


        // -----------------------------------------------------
        // EMPLOYEE / STUDENT ID
        // -----------------------------------------------------

        if (
                contains(
                        record.getEmployeeNo(),
                        search
                )
        ) {

            return true;
        }


        // -----------------------------------------------------
        // DEPARTMENT
        // -----------------------------------------------------

        if (
                record.getDepartment() != null
                        &&
                contains(
                        record.getDepartment()
                                .getDepartmentName(),
                        search
                )
        ) {

            return true;
        }


        // -----------------------------------------------------
        // PURPOSE
        // -----------------------------------------------------

        if (
                contains(
                        record.getPurpose(),
                        search
                )
        ) {

            return true;
        }


        return false;
    }


    // =========================================================
    // STRING CONTAINS
    // =========================================================

    private boolean contains(
            String value,
            String search
    ) {

        return value != null
                &&
                search != null
                &&
                value.toLowerCase(
                        Locale.ROOT
                ).contains(
                        search
                );
    }


    // =========================================================
    // MAP ENTITY -> RESPONSE DTO
    // =========================================================

    private IssueReturnResponseDTO mapToResponseDTO(
            IssueReturn record
    ) {

        IssueReturnResponseDTO dto =
                new IssueReturnResponseDTO();


        // -----------------------------------------------------
        // BASIC
        // -----------------------------------------------------

        dto.setId(
                record.getId()
        );


        dto.setIssueNumber(
                record.getIssueNumber()
        );


        // -----------------------------------------------------
        // ITEM
        // -----------------------------------------------------

        if (
                record.getInventoryItem() != null
        ) {

            InventoryItem item =
                    record.getInventoryItem();


            dto.setInventoryItemId(
                    item.getId()
            );


            dto.setItemCode(
                    item.getItemCode()
            );


            dto.setItemName(
                    item.getItemName()
            );


            dto.setUnit(
                    item.getUnit()
            );
        }


        dto.setQuantity(
                record.getQuantity()
        );


        Integer issuedQuantity =
                record.getIssuedQuantity();


        // Backward compatibility for older records.
        if (issuedQuantity == null) {

            issuedQuantity =
                    record.getQuantity();
        }


        dto.setIssuedQuantity(
                issuedQuantity
        );


        // -----------------------------------------------------
        // DATES
        // -----------------------------------------------------

        dto.setIssueDate(
                record.getIssueDate()
        );


        dto.setExpectedReturnDate(
                record.getExpectedReturnDate()
        );


        dto.setActualReturnDate(
                record.getActualReturnDate()
        );


        // -----------------------------------------------------
        // ISSUED TO
        // -----------------------------------------------------

        dto.setIssuedToType(
                record.getIssuedToType()
        );


        dto.setIssuedToName(
                record.getIssuedToName()
        );


        dto.setEmployeeNo(
                record.getEmployeeNo()
        );


        // -----------------------------------------------------
        // DEPARTMENT
        // -----------------------------------------------------

        if (
                record.getDepartment() != null
        ) {

            dto.setDepartmentId(
                    record.getDepartment()
                            .getId()
            );


            dto.setDepartmentName(
                    record.getDepartment()
                            .getDepartmentName()
            );
        }


        // -----------------------------------------------------
        // PURPOSE
        // -----------------------------------------------------

        dto.setPurpose(
                record.getPurpose()
        );


        // -----------------------------------------------------
        // RETURN CONDITION
        // -----------------------------------------------------

        dto.setReturnCondition(
                record.getReturnCondition()
        );


        // -----------------------------------------------------
        // BUSINESS STATUS
        // -----------------------------------------------------
        //
        // IMPORTANT:
        //
        // Response DTO status = IssueStatus.
        //
        // This is NOT common Status.
        //
        // -----------------------------------------------------

        dto.setStatus(
                record.getIssueStatus()
        );


        // -----------------------------------------------------
        // REMARKS
        // -----------------------------------------------------

        dto.setRemarks(
                record.getRemarks()
        );


        // -----------------------------------------------------
        // ISSUED BY
        // -----------------------------------------------------

        if (
                record.getIssuedBy() != null
        ) {

            dto.setIssuedById(
                    record.getIssuedBy()
                            .getId()
            );


            dto.setIssuedByName(
                    record.getIssuedBy()
                            .getFullName()
            );
        }


        // -----------------------------------------------------
        // RETURNED BY
        // -----------------------------------------------------

        if (
                record.getReturnedBy() != null
        ) {

            dto.setReturnedById(
                    record.getReturnedBy()
                            .getId()
            );


            dto.setReturnedByName(
                    record.getReturnedBy()
                            .getFullName()
            );
        }


        return dto;
    }


    // =========================================================
    // VALIDATE ISSUE REQUEST
    // =========================================================

    private void validateIssueRequest(
            IssueItemRequestDTO request
    ) {

        if (request == null) {

            throw new RuntimeException(
                    "Issue request cannot be null."
            );
        }


        if (
                request.getInventoryItemId() == null
        ) {

            throw new RuntimeException(
                    "Inventory item is required."
            );
        }


        if (
                request.getQuantity() == null
                        ||
                request.getQuantity() <= 0
        ) {

            throw new RuntimeException(
                    "Issue quantity must be greater than zero."
            );
        }


        if (
                request.getIssuedToType() == null
        ) {

            throw new RuntimeException(
                    "Issued To type is required."
            );
        }


        if (
                request.getIssuedToName() == null
                        ||
                request.getIssuedToName()
                        .trim()
                        .isEmpty()
        ) {

            throw new RuntimeException(
                    "Name is required."
            );
        }


        if (
                request.getIssueDate() != null
                        &&
                request.getIssueDate()
                        .isAfter(
                                LocalDate.now()
                        )
        ) {

            throw new RuntimeException(
                    "Issue date cannot be in the future."
            );
        }
    }


    // =========================================================
    // VALIDATE RETURN REQUEST
    // =========================================================

   // =========================================================
// VALIDATE RETURN REQUEST
// =========================================================

private void validateReturnRequest(
        RecordReturnRequestDTO request
) {

    if (request == null) {

        throw new RuntimeException(
                "Return request cannot be null."
        );
    }


    // ---------------------------------------------------------
    // ISSUE RECORD
    // ---------------------------------------------------------

    if (
            request.getIssueReturnId() == null
    ) {

        throw new RuntimeException(
                "Issue record is required."
        );
    }


    // ---------------------------------------------------------
    // RETURN QUANTITY
    // ---------------------------------------------------------

    if (
            request.getQuantityReturned() == null
                    ||
            request.getQuantityReturned() <= 0
    ) {

        throw new RuntimeException(
                "Returned quantity must be greater than zero."
        );
    }


    // ---------------------------------------------------------
    // RETURN DATE
    // ---------------------------------------------------------
    //
    // IMPORTANT:
    //
    // Future return dates are intentionally allowed.
    //
    // DO NOT add:
    //
    // request.getReturnDate().isAfter(LocalDate.now())
    //
    // because the Issue / Return Register must allow
    // selecting future dates.
    //
    // ---------------------------------------------------------

}


    // =========================================================
    // CURRENT USER
    // =========================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (
                authentication == null
                        ||
                !authentication.isAuthenticated()
                        ||
                authentication.getPrincipal() == null
                        ||
                "anonymousUser".equals(
                        authentication.getPrincipal()
                )
        ) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }


        String email =
                authentication.getName();


        return userRepository
                .findByEmailAndStatus(
                        email,
                        Status.ACTIVE
                )
                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "Logged-in user not found."
                                )
                );
    }


    // =========================================================
    // GENERATE ISSUE NUMBER
    // =========================================================

    private String generateIssueNumber() {

        long count =
                issueReturnRepository.count()
                        + 1;


        String issueNumber;


        do {

            issueNumber =
                    String.format(
                            "ISS%06d",
                            count
                    );


            count++;

        }
        while (
                issueReturnRepository
                        .existsByIssueNumber(
                                issueNumber
                        )
        );


        return issueNumber;
    }


    // =========================================================
    // ISSUE TRANSACTION REMARKS
    // =========================================================

    private String buildIssueTransactionRemarks(
            IssueItemRequestDTO request
    ) {

        StringBuilder remarks =
                new StringBuilder(
                        "Issue/Return Register Issue"
                );


        if (
                request.getIssuedToName() != null
        ) {

            remarks.append(
                    " - Issued to: "
            );


            remarks.append(
                    request.getIssuedToName()
            );
        }


        if (
                request.getPurpose() != null
                        &&
                !request.getPurpose()
                        .trim()
                        .isEmpty()
        ) {

            remarks.append(
                    " - Purpose: "
            );


            remarks.append(
                    request.getPurpose()
                            .trim()
            );
        }


        return remarks.toString();
    }


    // =========================================================
    // RETURN TRANSACTION REMARKS
    // =========================================================

    private String buildReturnTransactionRemarks(
            IssueReturn issueReturn,
            RecordReturnRequestDTO request
    ) {

        StringBuilder remarks =
                new StringBuilder(
                        "Issue/Return Register Return"
                );


        if (
                issueReturn.getIssueNumber() != null
        ) {

            remarks.append(
                    " - Issue: "
            );


            remarks.append(
                    issueReturn.getIssueNumber()
            );
        }


        if (
                request.getRemarks() != null
                        &&
                !request.getRemarks()
                        .trim()
                        .isEmpty()
        ) {

            remarks.append(
                    " - "
            );


            remarks.append(
                    request.getRemarks()
                            .trim()
            );
        }


        return remarks.toString();
    }


    // =========================================================
    // NORMALIZE STRING
    // =========================================================

    private String normalize(
            String value
    ) {

        if (value == null) {
            return null;
        }


        String normalized =
                value.trim();


        return normalized.isEmpty()
                ? null
                : normalized;
    }
}