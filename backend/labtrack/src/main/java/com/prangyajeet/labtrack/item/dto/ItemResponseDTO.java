package com.prangyajeet.labtrack.item.dto;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.item.entity.ItemType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ItemResponseDTO {

    /*
     * ==========================================
     * BASIC INFORMATION
     * ==========================================
     */

    private Long id;

    private String itemName;

    private String itemCode;

    private Long categoryId;

    private String categoryName;

    private ItemType itemType;

    /*
     * ==========================================
     * INVENTORY INFORMATION
     * ==========================================
     */

    private String unit;

    private Integer openingStock;

    private Integer currentStock;

    private Integer minimumStock;

    private Integer maximumStock;

    /*
     * ==========================================
     * PURCHASE INFORMATION
     * ==========================================
     */

    private String supplierName;

    private String manufacturerName;

    private String brandName;

    private LocalDate purchaseDate;

    private BigDecimal purchasePrice;

    private String invoiceNumber;

    private String purchaseOrderNumber;

    private String batchNumber;

    private String serialNumber;

    private LocalDate manufacturingDate;

    private LocalDate receivingDate;

    private LocalDate warrantyExpiry;

    /*
     * ==========================================
     * STORAGE INFORMATION
     * ==========================================
     */

    private String storageLocation;

    private String rackNumber;

    private String shelfNumber;

    private String cabinetNumber;

    private LocalDate expiryDate;

    /*
     * ==========================================
     * ADDITIONAL INFORMATION
     * ==========================================
     */

    private Integer reorderQuantity;

    private String hazardLevel;

    private String storageCondition;

    private String description;

    private String remarks;

    /*
     * ==========================================
     * AUDIT INFORMATION
     * ==========================================
     */

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Status status;

    public ItemResponseDTO() {
    }public ItemResponseDTO(

        Long id,

        String itemName,

        String itemCode,

        Long categoryId,

        String categoryName,

        ItemType itemType,

        String unit,

        Integer openingStock,

        Integer currentStock,

        Integer minimumStock,

        Integer maximumStock,

        String supplierName,

        String manufacturerName,

        String brandName,

        LocalDate purchaseDate,

        BigDecimal purchasePrice,

        String invoiceNumber,

        String purchaseOrderNumber,

        String batchNumber,

        String serialNumber,

        LocalDate manufacturingDate,

        LocalDate receivingDate,

        LocalDate warrantyExpiry,

        String storageLocation,

        String rackNumber,

        String shelfNumber,

        String cabinetNumber,

        LocalDate expiryDate,

        Integer reorderQuantity,

        String hazardLevel,

        String storageCondition,

        String description,

        String remarks,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        Status status

) {

    this.id = id;
    this.itemName = itemName;
    this.itemCode = itemCode;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.itemType = itemType;

    this.unit = unit;
    this.openingStock = openingStock;
    this.currentStock = currentStock;
    this.minimumStock = minimumStock;
    this.maximumStock = maximumStock;

    this.supplierName = supplierName;
    this.manufacturerName = manufacturerName;
    this.brandName = brandName;

    this.purchaseDate = purchaseDate;
    this.purchasePrice = purchasePrice;

    this.invoiceNumber = invoiceNumber;
    this.purchaseOrderNumber = purchaseOrderNumber;
    this.batchNumber = batchNumber;
    this.serialNumber = serialNumber;

    this.manufacturingDate = manufacturingDate;
    this.receivingDate = receivingDate;
    this.warrantyExpiry = warrantyExpiry;

    this.storageLocation = storageLocation;
    this.rackNumber = rackNumber;
    this.shelfNumber = shelfNumber;
    this.cabinetNumber = cabinetNumber;

    this.expiryDate = expiryDate;

    this.reorderQuantity = reorderQuantity;
    this.hazardLevel = hazardLevel;
    this.storageCondition = storageCondition;

    this.description = description;
    this.remarks = remarks;

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = status;
}    public Long getId() {
        return id;
    }

    public String getItemName() {
        return itemName;
    }

    public String getItemCode() {
        return itemCode;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public ItemType getItemType() {
        return itemType;
    }

    public String getUnit() {
        return unit;
    }

    public Integer getOpeningStock() {
        return openingStock;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public Integer getMinimumStock() {
        return minimumStock;
    }

    public Integer getMaximumStock() {
        return maximumStock;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public String getManufacturerName() {
        return manufacturerName;
    }

    public String getBrandName() {
        return brandName;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public String getPurchaseOrderNumber() {
        return purchaseOrderNumber;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public LocalDate getManufacturingDate() {
        return manufacturingDate;
    }

    public LocalDate getReceivingDate() {
        return receivingDate;
    }

    public LocalDate getWarrantyExpiry() {
        return warrantyExpiry;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public String getRackNumber() {
        return rackNumber;
    }

    public String getShelfNumber() {
        return shelfNumber;
    }

    public String getCabinetNumber() {
        return cabinetNumber;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public Integer getReorderQuantity() {
        return reorderQuantity;
    }

    public String getHazardLevel() {
        return hazardLevel;
    }

    public String getStorageCondition() {
        return storageCondition;
    }

    public String getDescription() {
        return description;
    }

    public String getRemarks() {
        return remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Status getStatus() {
        return status;
    }    public void setId(Long id) {
        this.id = id;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public void setOpeningStock(Integer openingStock) {
        this.openingStock = openingStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public void setMinimumStock(Integer minimumStock) {
        this.minimumStock = minimumStock;
    }

    public void setMaximumStock(Integer maximumStock) {
        this.maximumStock = maximumStock;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public void setManufacturerName(String manufacturerName) {
        this.manufacturerName = manufacturerName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public void setPurchaseOrderNumber(String purchaseOrderNumber) {
        this.purchaseOrderNumber = purchaseOrderNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public void setManufacturingDate(LocalDate manufacturingDate) {
        this.manufacturingDate = manufacturingDate;
    }

    public void setReceivingDate(LocalDate receivingDate) {
        this.receivingDate = receivingDate;
    }

    public void setWarrantyExpiry(LocalDate warrantyExpiry) {
        this.warrantyExpiry = warrantyExpiry;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }

    public void setRackNumber(String rackNumber) {
        this.rackNumber = rackNumber;
    }

    public void setShelfNumber(String shelfNumber) {
        this.shelfNumber = shelfNumber;
    }

    public void setCabinetNumber(String cabinetNumber) {
        this.cabinetNumber = cabinetNumber;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setReorderQuantity(Integer reorderQuantity) {
        this.reorderQuantity = reorderQuantity;
    }

    public void setHazardLevel(String hazardLevel) {
        this.hazardLevel = hazardLevel;
    }

    public void setStorageCondition(String storageCondition) {
        this.storageCondition = storageCondition;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

}