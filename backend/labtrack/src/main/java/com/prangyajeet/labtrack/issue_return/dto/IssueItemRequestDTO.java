package com.prangyajeet.labtrack.issue_return.dto;

import com.prangyajeet.labtrack.issue_return.enums.IssuedToType;

import java.time.LocalDate;

public class IssueItemRequestDTO {

    private Long inventoryItemId;

    private Integer quantity;

    private LocalDate issueDate;

    private LocalDate expectedReturnDate;

    private IssuedToType issuedToType;

    private String issuedToName;

    private String employeeNo;

    private Long departmentId;

    private String purpose;

    private String remarks;


    public IssueItemRequestDTO() {
    }


    public Long getInventoryItemId() {
        return inventoryItemId;
    }

    public void setInventoryItemId(
            Long inventoryItemId) {

        this.inventoryItemId =
                inventoryItemId;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(
            Integer quantity) {

        this.quantity =
                quantity;
    }


    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(
            LocalDate issueDate) {

        this.issueDate =
                issueDate;
    }


    public LocalDate getExpectedReturnDate() {
        return expectedReturnDate;
    }

    public void setExpectedReturnDate(
            LocalDate expectedReturnDate) {

        this.expectedReturnDate =
                expectedReturnDate;
    }


    public IssuedToType getIssuedToType() {
        return issuedToType;
    }

    public void setIssuedToType(
            IssuedToType issuedToType) {

        this.issuedToType =
                issuedToType;
    }


    public String getIssuedToName() {
        return issuedToName;
    }

    public void setIssuedToName(
            String issuedToName) {

        this.issuedToName =
                issuedToName;
    }


    public String getEmployeeNo() {
        return employeeNo;
    }

    public void setEmployeeNo(
            String employeeNo) {

        this.employeeNo =
                employeeNo;
    }


    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(
            Long departmentId) {

        this.departmentId =
                departmentId;
    }


    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(
            String purpose) {

        this.purpose =
                purpose;
    }


    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(
            String remarks) {

        this.remarks =
                remarks;
    }
}