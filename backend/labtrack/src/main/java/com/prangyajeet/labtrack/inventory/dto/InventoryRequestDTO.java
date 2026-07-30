package com.prangyajeet.labtrack.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InventoryRequestDTO {

    @NotBlank(message = "Item name is required")
    private String itemName;

    private String description;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Storage Location ID is required")
    private Long storageLocationId;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Minimum quantity is required")
    @Min(value = 0, message = "Minimum quantity cannot be negative")
    private Integer minimumQuantity;

    @NotNull(message = "Maximum quantity is required")
    @Min(value = 0, message = "Maximum quantity cannot be negative")
    private Integer maximumQuantity;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal unitPrice;

    private String batchNumber;

    private LocalDate manufactureDate;

    private LocalDate expiryDate;

    private String remarks;
@NotNull(message = "Consumable status is required")
private Boolean isConsumable;

@NotNull(message = "Reorder quantity is required")
@Min(value = 0, message = "Reorder quantity cannot be negative")
private Integer reorderQuantity;

    public InventoryRequestDTO() {
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public Long getStorageLocationId() {
        return storageLocationId;
    }

    public void setStorageLocationId(Long storageLocationId) {
        this.storageLocationId = storageLocationId;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getMinimumQuantity() {
        return minimumQuantity;
    }

    public void setMinimumQuantity(Integer minimumQuantity) {
        this.minimumQuantity = minimumQuantity;
    }

    public Integer getMaximumQuantity() {
        return maximumQuantity;
    }

    public void setMaximumQuantity(Integer maximumQuantity) {
        this.maximumQuantity = maximumQuantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public LocalDate getManufactureDate() {
        return manufactureDate;
    }

    public void setManufactureDate(LocalDate manufactureDate) {
        this.manufactureDate = manufactureDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Boolean getIsConsumable() {
    return isConsumable;
}

public void setIsConsumable(Boolean isConsumable) {
    this.isConsumable = isConsumable;
}

public Integer getReorderQuantity() {
    return reorderQuantity;
}

public void setReorderQuantity(Integer reorderQuantity) {
    this.reorderQuantity = reorderQuantity;
}

}