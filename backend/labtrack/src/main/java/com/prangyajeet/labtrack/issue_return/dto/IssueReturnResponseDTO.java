package com.prangyajeet.labtrack.issue_return.dto;

import com.prangyajeet.labtrack.issue_return.enums.IssueStatus;
import com.prangyajeet.labtrack.issue_return.enums.IssuedToType;
import com.prangyajeet.labtrack.issue_return.enums.ReturnCondition;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class IssueReturnResponseDTO {

    private Long id;

    private String issueNumber;

    private Long inventoryItemId;

    private String itemCode;

    private String itemName;

    private String unit;

    private Integer quantity;

    private Integer issuedQuantity;

    private LocalDate issueDate;

    private LocalDate expectedReturnDate;

    private LocalDate actualReturnDate;

    private IssuedToType issuedToType;

    private String issuedToName;

    private String employeeNo;

    private Long departmentId;

    private String departmentName;

    private String purpose;

    private IssueStatus status;

    private ReturnCondition returnCondition;

    private String remarks;

    private Long issuedById;

    private String issuedByName;

    private Long returnedById;

    private String returnedByName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public IssueReturnResponseDTO() {

    }


    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }


    public String getIssueNumber() {

        return issueNumber;
    }

    public void setIssueNumber(
            String issueNumber) {

        this.issueNumber =
                issueNumber;
    }


    public Long getInventoryItemId() {

        return inventoryItemId;
    }

    public void setInventoryItemId(
            Long inventoryItemId) {

        this.inventoryItemId =
                inventoryItemId;
    }


    public String getItemCode() {

        return itemCode;
    }

    public void setItemCode(
            String itemCode) {

        this.itemCode =
                itemCode;
    }


    public String getItemName() {

        return itemName;
    }

    public void setItemName(
            String itemName) {

        this.itemName =
                itemName;
    }


    public String getUnit() {

        return unit;
    }

    public void setUnit(
            String unit) {

        this.unit =
                unit;
    }


    public Integer getQuantity() {

        return quantity;
    }

    public void setQuantity(
            Integer quantity) {

        this.quantity =
                quantity;
    }


    public Integer getIssuedQuantity() {

        return issuedQuantity;
    }

    public void setIssuedQuantity(
            Integer issuedQuantity) {

        this.issuedQuantity =
                issuedQuantity;
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


    public LocalDate getActualReturnDate() {

        return actualReturnDate;
    }

    public void setActualReturnDate(
            LocalDate actualReturnDate) {

        this.actualReturnDate =
                actualReturnDate;
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


    public String getDepartmentName() {

        return departmentName;
    }

    public void setDepartmentName(
            String departmentName) {

        this.departmentName =
                departmentName;
    }


    public String getPurpose() {

        return purpose;
    }

    public void setPurpose(
            String purpose) {

        this.purpose =
                purpose;
    }


    public IssueStatus getStatus() {

        return status;
    }

    public void setStatus(
            IssueStatus status) {

        this.status =
                status;
    }


    public ReturnCondition getReturnCondition() {

        return returnCondition;
    }

    public void setReturnCondition(
            ReturnCondition returnCondition) {

        this.returnCondition =
                returnCondition;
    }


    public String getRemarks() {

        return remarks;
    }

    public void setRemarks(
            String remarks) {

        this.remarks =
                remarks;
    }


    public Long getIssuedById() {

        return issuedById;
    }

    public void setIssuedById(
            Long issuedById) {

        this.issuedById =
                issuedById;
    }


    public String getIssuedByName() {

        return issuedByName;
    }

    public void setIssuedByName(
            String issuedByName) {

        this.issuedByName =
                issuedByName;
    }


    public Long getReturnedById() {

        return returnedById;
    }

    public void setReturnedById(
            Long returnedById) {

        this.returnedById =
                returnedById;
    }


    public String getReturnedByName() {

        return returnedByName;
    }

    public void setReturnedByName(
            String returnedByName) {

        this.returnedByName =
                returnedByName;
    }


    public LocalDateTime getCreatedAt() {

        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt =
                createdAt;
    }


    public LocalDateTime getUpdatedAt() {

        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt =
                updatedAt;
    }
}
