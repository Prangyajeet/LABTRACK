package com.prangyajeet.labtrack.issue_return.service;

import com.prangyajeet.labtrack.issue_return.dto.IssueItemRequestDTO;
import com.prangyajeet.labtrack.issue_return.dto.IssueReturnResponseDTO;
import com.prangyajeet.labtrack.issue_return.dto.IssueReturnSummaryDTO;
import com.prangyajeet.labtrack.issue_return.dto.RecordReturnRequestDTO;
import com.prangyajeet.labtrack.issue_return.enums.IssueStatus;
import com.prangyajeet.labtrack.issue_return.enums.IssuedToType;

import java.util.List;

public interface IssueReturnService {


    /*
     * =========================================================
     * ISSUE ITEM
     * =========================================================
     */

    IssueReturnResponseDTO issueItem(
            IssueItemRequestDTO requestDTO
    );


    /*
     * =========================================================
     * RECORD RETURN
     * =========================================================
     */

    IssueReturnResponseDTO recordReturn(
            RecordReturnRequestDTO requestDTO
    );


    /*
     * =========================================================
     * GET ALL
     * =========================================================
     */

    List<IssueReturnResponseDTO> getAll(
            String search,
            IssueStatus status,
            IssuedToType issuedToType,
            Long departmentId
    );


    /*
     * =========================================================
     * GET BY ID
     * =========================================================
     */

    IssueReturnResponseDTO getById(
            Long id
    );


    /*
     * =========================================================
     * SUMMARY
     * =========================================================
     */

    IssueReturnSummaryDTO getSummary();


    /*
     * =========================================================
     * DELETE / CANCEL
     * =========================================================
     */

    void delete(
            Long id
    );
}