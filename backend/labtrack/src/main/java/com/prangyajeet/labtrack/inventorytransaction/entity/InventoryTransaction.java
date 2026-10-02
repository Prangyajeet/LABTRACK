package com.prangyajeet.labtrack.inventorytransaction.entity;

import com.prangyajeet.labtrack.auth.entity.User;
import com.prangyajeet.labtrack.common.entity.AuditableEntity;
import com.prangyajeet.labtrack.common.enums.TransactionType;
import com.prangyajeet.labtrack.department.entity.Department;
import com.prangyajeet.labtrack.inventory.entity.InventoryItem;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction extends AuditableEntity {

    @Column(
            name = "transaction_number",
            nullable = false,
            unique = true,
            length = 30
    )
    private String transactionNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "inventory_item_id",
            nullable = false
    )
    private InventoryItem inventoryItem;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "transaction_type",
            nullable = false,
            length = 30
    )
    private TransactionType transactionType;

    @Column(
            name = "quantity",
            nullable = false
    )
    private Integer quantity;

    /*
     * =========================================================
     * EXISTING STOCK-IN DETAILS
     * =========================================================
     */

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "invoice_number", length = 100)
    private String invoiceNumber;

    @Column(name = "purchase_order_number", length = 100)
    private String purchaseOrderNumber;

    @Column(name = "batch_number", length = 100)
    private String batchNumber;

    @Column(name = "purchase_price")
    private java.math.BigDecimal purchasePrice;

    @Column(name = "receiving_date")
    private LocalDate receivingDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    /*
     * =========================================================
     * COMMON TRANSACTION DETAILS
     * =========================================================
     */

    @Column(
            name = "remarks",
            length = 500
    )
    private String remarks;

    @Column(
            name = "transaction_date",
            nullable = false
    )
    private LocalDateTime transactionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "performed_by",
            nullable = false
    )
    private User performedBy;

    /*
     * =========================================================
     * DAILY CONSUMABLE USAGE DETAILS
     * =========================================================
     *
     * These fields are populated only for STOCK_OUT records
     * created through Daily Consumables.
     */

    @Column(
            name = "faculty_staff_name",
            length = 150
    )
    private String facultyStaffName;

    @Column(
            name = "designation",
            length = 100
    )
    private String designation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "department_id"
    )
    private Department department;

    @Column(
            name = "purpose_test",
            length = 300
    )
    private String purposeTest;

    @Column(
            name = "usage_date"
    )
    private LocalDate usageDate;

    @Column(
            name = "usage_time"
    )
    private LocalTime usageTime;

    /*
     * =========================================================
     * DAILY CONSUMABLE USAGE PHOTO
     * =========================================================
     *
     * Photo belongs to this usage transaction.
     * Actual image file is stored outside the database.
     * Database stores only file metadata/path.
     */

    @Column(
            name = "photo_original_file_name",
            length = 255
    )
    private String photoOriginalFileName;

    @Column(
            name = "photo_stored_file_name",
            length = 255
    )
    private String photoStoredFileName;

    @Column(
            name = "photo_content_type",
            length = 100
    )
    private String photoContentType;

    @Column(
            name = "photo_file_path",
            length = 500
    )
    private String photoFilePath;

    /*
     * =========================================================
     * CONSTRUCTOR
     * =========================================================
     */

    public InventoryTransaction() {
    }

    /*
     * =========================================================
     * EXISTING FIELDS
     * =========================================================
     */

    public String getTransactionNumber() {
        return transactionNumber;
    }

    public void setTransactionNumber(
            String transactionNumber) {

        this.transactionNumber = transactionNumber;
    }

    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }

    public void setInventoryItem(
            InventoryItem inventoryItem) {

        this.inventoryItem = inventoryItem;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(
            TransactionType transactionType) {

        this.transactionType = transactionType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(
            Integer quantity) {

        this.quantity = quantity;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(
            Long supplierId) {

        this.supplierId = supplierId;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(
            String invoiceNumber) {

        this.invoiceNumber = invoiceNumber;
    }

    public String getPurchaseOrderNumber() {
        return purchaseOrderNumber;
    }

    public void setPurchaseOrderNumber(
            String purchaseOrderNumber) {

        this.purchaseOrderNumber = purchaseOrderNumber;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(
            String batchNumber) {

        this.batchNumber = batchNumber;
    }

    public java.math.BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(
            java.math.BigDecimal purchasePrice) {

        this.purchasePrice = purchasePrice;
    }

    public LocalDate getReceivingDate() {
        return receivingDate;
    }

    public void setReceivingDate(
            LocalDate receivingDate) {

        this.receivingDate = receivingDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(
            LocalDate expiryDate) {

        this.expiryDate = expiryDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(
            String remarks) {

        this.remarks = remarks;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(
            LocalDateTime transactionDate) {

        this.transactionDate = transactionDate;
    }

    public User getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(
            User performedBy) {

        this.performedBy = performedBy;
    }

    /*
     * =========================================================
     * DAILY CONSUMABLE FIELDS
     * =========================================================
     */

    public String getFacultyStaffName() {
        return facultyStaffName;
    }

    public void setFacultyStaffName(
            String facultyStaffName) {

        this.facultyStaffName =
                facultyStaffName;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(
            String designation) {

        this.designation = designation;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(
            Department department) {

        this.department = department;
    }

    public String getPurposeTest() {
        return purposeTest;
    }

    public void setPurposeTest(
            String purposeTest) {

        this.purposeTest = purposeTest;
    }

    public LocalDate getUsageDate() {
        return usageDate;
    }

    public void setUsageDate(
            LocalDate usageDate) {

        this.usageDate = usageDate;
    }

    public LocalTime getUsageTime() {
        return usageTime;
    }

    public void setUsageTime(
            LocalTime usageTime) {

        this.usageTime = usageTime;
    }

    /*
     * =========================================================
     * DAILY CONSUMABLE PHOTO
     * =========================================================
     */

    public String getPhotoOriginalFileName() {
        return photoOriginalFileName;
    }

    public void setPhotoOriginalFileName(
            String photoOriginalFileName) {

        this.photoOriginalFileName =
                photoOriginalFileName;
    }

    public String getPhotoStoredFileName() {
        return photoStoredFileName;
    }

    public void setPhotoStoredFileName(
            String photoStoredFileName) {

        this.photoStoredFileName =
                photoStoredFileName;
    }

    public String getPhotoContentType() {
        return photoContentType;
    }

    public void setPhotoContentType(
            String photoContentType) {

        this.photoContentType =
                photoContentType;
    }

    public String getPhotoFilePath() {
        return photoFilePath;
    }

    public void setPhotoFilePath(
            String photoFilePath) {

        this.photoFilePath =
                photoFilePath;
    }
}