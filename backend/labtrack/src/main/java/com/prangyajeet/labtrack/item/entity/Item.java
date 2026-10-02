package com.prangyajeet.labtrack.item.entity;

import com.prangyajeet.labtrack.category.entity.Category;
import com.prangyajeet.labtrack.common.entity.AuditableEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "items",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "item_code")
        }
)
public class Item extends AuditableEntity {

    @Column(
            name = "item_name",
            nullable = false,
            length = 150
    )
    private String itemName;

    @Column(
            name = "item_code",
            nullable = false,
            unique = true,
            length = 30
    )
    private String itemCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "category_id",
            nullable = false
    )
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "item_type",
            nullable = false,
            length = 30
    )
    private ItemType itemType;

    /*
     * ==========================================
     * INVENTORY INFORMATION
     * ==========================================
     */

    @Column(
            name = "unit",
            nullable = false,
            length = 50
    )
    private String unit;

    @Column(
            name = "opening_stock",
            nullable = false
    )
    private Integer openingStock;

    @Column(
            name = "current_stock",
            nullable = false
    )
    private Integer currentStock;

    @Column(
            name = "minimum_stock",
            nullable = false
    )
    private Integer minimumStock;

    @Column(name = "maximum_stock")
    private Integer maximumStock;    /*
     * ==========================================
     * PURCHASE INFORMATION
     * ==========================================
     */

    @Column(
            name = "supplier_name",
            length = 150
    )
    private String supplierName;

    @Column(
            name = "manufacturer_name",
            length = 150
    )
    private String manufacturerName;

    @Column(
            name = "brand_name",
            length = 100
    )
    private String brandName;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(
            name = "purchase_price",
            precision = 12,
            scale = 2
    )
    private BigDecimal purchasePrice;

    @Column(
            name = "invoice_number",
            length = 100
    )
    private String invoiceNumber;

    @Column(
            name = "purchase_order_number",
            length = 100
    )
    private String purchaseOrderNumber;

    @Column(
            name = "batch_number",
            length = 100
    )
    private String batchNumber;

    @Column(
            name = "serial_number",
            length = 100
    )
    private String serialNumber;

    @Column(name = "manufacturing_date")
    private LocalDate manufacturingDate;

    @Column(name = "receiving_date")
    private LocalDate receivingDate;

    @Column(name = "warranty_expiry")
    private LocalDate warrantyExpiry;

    /*
     * ==========================================
     * STORAGE INFORMATION
     * ==========================================
     */

    @Column(
            name = "storage_location",
            length = 100
    )
    private String storageLocation;

    @Column(
            name = "rack_number",
            length = 50
    )
    private String rackNumber;

    @Column(
            name = "shelf_number",
            length = 50
    )
    private String shelfNumber;

    @Column(
            name = "cabinet_number",
            length = 50
    )
    private String cabinetNumber;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;    /*
     * ==========================================
     * ADDITIONAL INFORMATION
     * ==========================================
     */

    @Column(
            name = "reorder_quantity"
    )
    private Integer reorderQuantity;

    @Column(
            name = "hazard_level",
            length = 50
    )
    private String hazardLevel;

    @Column(
            name = "storage_condition",
            length = 150
    )
    private String storageCondition;

    @Column(
            name = "description",
            length = 1000
    )
    private String description;

    @Column(
            name = "remarks",
            length = 1000
    )
    private String remarks;

    public Item() {
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getOpeningStock() {
        return openingStock;
    }

    public void setOpeningStock(Integer openingStock) {
        this.openingStock = openingStock;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Integer getMinimumStock() {
        return minimumStock;
    }

    public void setMinimumStock(Integer minimumStock) {
        this.minimumStock = minimumStock;
    }

    public Integer getMaximumStock() {
        return maximumStock;
    }

    public void setMaximumStock(Integer maximumStock) {
        this.maximumStock = maximumStock;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getManufacturerName() {
        return manufacturerName;
    }

    public void setManufacturerName(String manufacturerName) {
        this.manufacturerName = manufacturerName;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getPurchaseOrderNumber() {
        return purchaseOrderNumber;
    }

    public void setPurchaseOrderNumber(String purchaseOrderNumber) {
        this.purchaseOrderNumber = purchaseOrderNumber;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public LocalDate getManufacturingDate() {
        return manufacturingDate;
    }

    public void setManufacturingDate(LocalDate manufacturingDate) {
        this.manufacturingDate = manufacturingDate;
    }

    public LocalDate getReceivingDate() {
        return receivingDate;
    }

    public void setReceivingDate(LocalDate receivingDate) {
        this.receivingDate = receivingDate;
    }

    public LocalDate getWarrantyExpiry() {
        return warrantyExpiry;
    }

    public void setWarrantyExpiry(LocalDate warrantyExpiry) {
        this.warrantyExpiry = warrantyExpiry;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }

    public String getRackNumber() {
        return rackNumber;
    }

    public void setRackNumber(String rackNumber) {
        this.rackNumber = rackNumber;
    }

    public String getShelfNumber() {
        return shelfNumber;
    }

    public void setShelfNumber(String shelfNumber) {
        this.shelfNumber = shelfNumber;
    }

    public String getCabinetNumber() {
        return cabinetNumber;
    }

    public void setCabinetNumber(String cabinetNumber) {
        this.cabinetNumber = cabinetNumber;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Integer getReorderQuantity() {
        return reorderQuantity;
    }

    public void setReorderQuantity(Integer reorderQuantity) {
        this.reorderQuantity = reorderQuantity;
    }

    public String getHazardLevel() {
        return hazardLevel;
    }

    public void setHazardLevel(String hazardLevel) {
        this.hazardLevel = hazardLevel;
    }

    public String getStorageCondition() {
        return storageCondition;
    }

    public void setStorageCondition(String storageCondition) {
        this.storageCondition = storageCondition;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

}