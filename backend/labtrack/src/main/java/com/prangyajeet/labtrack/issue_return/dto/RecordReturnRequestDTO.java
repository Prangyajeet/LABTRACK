package com.prangyajeet.labtrack.issue_return.dto;

import java.time.LocalDate;

import com.prangyajeet.labtrack.issue_return.enums.ReturnCondition;

public class RecordReturnRequestDTO {

    // =========================================================
    // ISSUE RETURN ID
    // =========================================================

    private Long issueReturnId;


    // =========================================================
    // RETURN DATE
    // =========================================================

    private LocalDate returnDate;


    // =========================================================
    // QUANTITY RETURNED
    // =========================================================

    private Integer quantityReturned;


    // =========================================================
    // RETURN CONDITION
    // =========================================================

    private ReturnCondition returnCondition;


    // =========================================================
    // REMARKS
    // =========================================================

    private String remarks;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public RecordReturnRequestDTO() {
    }


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Long getIssueReturnId() {
        return issueReturnId;
    }

    public void setIssueReturnId(
            Long issueReturnId
    ) {
        this.issueReturnId = issueReturnId;
    }


    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(
            LocalDate returnDate
    ) {
        this.returnDate = returnDate;
    }


    public Integer getQuantityReturned() {
        return quantityReturned;
    }

    public void setQuantityReturned(
            Integer quantityReturned
    ) {
        this.quantityReturned = quantityReturned;
    }


    public ReturnCondition getReturnCondition() {
        return returnCondition;
    }

    public void setReturnCondition(
            ReturnCondition returnCondition
    ) {
        this.returnCondition = returnCondition;
    }


    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(
            String remarks
    ) {
        this.remarks = remarks;
    }
}