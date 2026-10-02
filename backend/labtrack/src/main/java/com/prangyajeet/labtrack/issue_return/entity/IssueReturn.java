package com.prangyajeet.labtrack.issue_return.entity;

import java.time.LocalDate;

import com.prangyajeet.labtrack.auth.entity.User;
import com.prangyajeet.labtrack.common.entity.AuditableEntity;
import com.prangyajeet.labtrack.department.entity.Department;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;
import com.prangyajeet.labtrack.issue_return.enums.IssueStatus;
import com.prangyajeet.labtrack.issue_return.enums.IssuedToType;
import com.prangyajeet.labtrack.issue_return.enums.ReturnCondition;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "issue_returns")
public class IssueReturn extends AuditableEntity {

    // =========================================================
    // ISSUE NUMBER
    // =========================================================

    @Column(
        name = "issue_number",
        nullable = false,
        unique = true,
        length = 50
    )
    private String issueNumber;


    // =========================================================
    // INVENTORY ITEM
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "inventory_item_id",
        nullable = false
    )
    private InventoryItem inventoryItem;


    // =========================================================
    // QUANTITY
    // =========================================================
    //
    // quantity = remaining quantity still outside the laboratory.
    // It decreases when a return is recorded.
    //
    // issuedQuantity = original quantity issued in this register.
    // It never changes after the issue is created.
    //
    // =========================================================

    @Column(
        name = "quantity",
        nullable = false
    )
    private Integer quantity;

    @Column(
        name = "issued_quantity"
    )
    private Integer issuedQuantity;


    // =========================================================
    // ISSUE DATE
    // =========================================================

    @Column(
        name = "issue_date",
        nullable = false
    )
    private LocalDate issueDate;


    // =========================================================
    // EXPECTED RETURN DATE
    // =========================================================

    @Column(
        name = "expected_return_date"
    )
    private LocalDate expectedReturnDate;


    // =========================================================
    // ACTUAL RETURN DATE
    // =========================================================

    @Column(
        name = "actual_return_date"
    )
    private LocalDate actualReturnDate;


    // =========================================================
    // ISSUED TO TYPE
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(
        name = "issued_to_type",
        nullable = false,
        length = 30
    )
    private IssuedToType issuedToType;


    // =========================================================
    // ISSUED TO NAME
    // =========================================================

    @Column(
        name = "issued_to_name",
        nullable = false,
        length = 150
    )
    private String issuedToName;


    // =========================================================
    // EMPLOYEE / STUDENT NUMBER
    // =========================================================

    @Column(
        name = "employee_no",
        length = 100
    )
    private String employeeNo;


    // =========================================================
    // DEPARTMENT
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "department_id"
    )
    private Department department;


    // =========================================================
    // PURPOSE
    // =========================================================

    @Column(
        name = "purpose",
        length = 500
    )
    private String purpose;


    // =========================================================
    // ISSUE STATUS
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(
        name = "issue_status",
        nullable = false,
        length = 30
    )
    private IssueStatus issueStatus;


    // =========================================================
    // RETURN CONDITION
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(
        name = "return_condition",
        length = 40
    )
    private ReturnCondition returnCondition;


    // =========================================================
    // REMARKS
    // =========================================================

    @Column(
        name = "remarks",
        length = 1000
    )
    private String remarks;


    // =========================================================
    // ISSUED BY
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "issued_by"
    )
    private User issuedBy;


    // =========================================================
    // RETURNED BY
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "returned_by"
    )
    private User returnedBy;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public IssueReturn() {
    }


    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public String getIssueNumber() {
        return issueNumber;
    }

    public void setIssueNumber(String issueNumber) {
        this.issueNumber = issueNumber;
    }


    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }

    public void setInventoryItem(
            InventoryItem inventoryItem
    ) {
        this.inventoryItem = inventoryItem;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public Integer getIssuedQuantity() {
        return issuedQuantity;
    }

    public void setIssuedQuantity(Integer issuedQuantity) {
        this.issuedQuantity = issuedQuantity;
    }


    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }


    public LocalDate getExpectedReturnDate() {
        return expectedReturnDate;
    }

    public void setExpectedReturnDate(
            LocalDate expectedReturnDate
    ) {
        this.expectedReturnDate = expectedReturnDate;
    }


    public LocalDate getActualReturnDate() {
        return actualReturnDate;
    }

    public void setActualReturnDate(
            LocalDate actualReturnDate
    ) {
        this.actualReturnDate = actualReturnDate;
    }


    public IssuedToType getIssuedToType() {
        return issuedToType;
    }

    public void setIssuedToType(
            IssuedToType issuedToType
    ) {
        this.issuedToType = issuedToType;
    }


    public String getIssuedToName() {
        return issuedToName;
    }

    public void setIssuedToName(
            String issuedToName
    ) {
        this.issuedToName = issuedToName;
    }


    public String getEmployeeNo() {
        return employeeNo;
    }

    public void setEmployeeNo(
            String employeeNo
    ) {
        this.employeeNo = employeeNo;
    }


    public Department getDepartment() {
        return department;
    }

    public void setDepartment(
            Department department
    ) {
        this.department = department;
    }


    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(
            String purpose
    ) {
        this.purpose = purpose;
    }


    public IssueStatus getIssueStatus() {
        return issueStatus;
    }

    public void setIssueStatus(
            IssueStatus issueStatus
    ) {
        this.issueStatus = issueStatus;
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


    public User getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(
            User issuedBy
    ) {
        this.issuedBy = issuedBy;
    }


    public User getReturnedBy() {
        return returnedBy;
    }

    public void setReturnedBy(
            User returnedBy
    ) {
        this.returnedBy = returnedBy;
    }
}
