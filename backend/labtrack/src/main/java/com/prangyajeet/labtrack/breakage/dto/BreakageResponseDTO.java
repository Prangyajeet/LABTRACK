package com.prangyajeet.labtrack.breakage.dto;

import com.prangyajeet.labtrack.breakage.entity.BreakagePersonType;
import com.prangyajeet.labtrack.breakage.entity.BreakageRecoveryStatus;
import com.prangyajeet.labtrack.common.enums.Status;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BreakageResponseDTO {

    private Long id;

    private Long inventoryItemId;

    private String itemCode;

    private String itemName;

    private String unit;

    private LocalDateTime breakageDateTime;

    private Integer quantity;

    private String responsibleName;

    private BreakagePersonType personType;

    private String responsibleId;

    private String departmentClassSection;

    private String cause;

    private BigDecimal estimatedCost;

    private BreakageRecoveryStatus recoveryStatus;

    private String remarks;

    private Status status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInventoryItemId() {
        return inventoryItemId;
    }

    public void setInventoryItemId(Long inventoryItemId) {
        this.inventoryItemId = inventoryItemId;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDateTime getBreakageDateTime() {
        return breakageDateTime;
    }

    public void setBreakageDateTime(LocalDateTime breakageDateTime) {
        this.breakageDateTime = breakageDateTime;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getResponsibleName() {
        return responsibleName;
    }

    public void setResponsibleName(String responsibleName) {
        this.responsibleName = responsibleName;
    }

    public BreakagePersonType getPersonType() {
        return personType;
    }

    public void setPersonType(BreakagePersonType personType) {
        this.personType = personType;
    }

    public String getResponsibleId() {
        return responsibleId;
    }

    public void setResponsibleId(String responsibleId) {
        this.responsibleId = responsibleId;
    }

    public String getDepartmentClassSection() {
        return departmentClassSection;
    }

    public void setDepartmentClassSection(String departmentClassSection) {
        this.departmentClassSection = departmentClassSection;
    }

    public String getCause() {
        return cause;
    }

    public void setCause(String cause) {
        this.cause = cause;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(BigDecimal estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public BreakageRecoveryStatus getRecoveryStatus() {
        return recoveryStatus;
    }

    public void setRecoveryStatus(BreakageRecoveryStatus recoveryStatus) {
        this.recoveryStatus = recoveryStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}