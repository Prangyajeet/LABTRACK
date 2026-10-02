package com.prangyajeet.labtrack.equipment.dto;

import com.prangyajeet.labtrack.equipment.entity.AmcType;
import com.prangyajeet.labtrack.equipment.entity.EquipmentCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class EquipmentRequestDTO {

    @NotBlank
    private String equipmentName;

    @NotBlank
    private String equipmentCode;

    @NotNull
    private EquipmentCategory category;

    private String manufacturer;
    private String model;
    private String serialNumber;
    private LocalDate purchaseDate;

    @DecimalMin(value = "0.0")
    private BigDecimal purchaseCost;

    private LocalDate warrantyUntil;
    private String location;

    private String amcProvider;
    private String amcContact;
    private LocalDate amcStart;
    private LocalDate amcEnd;

    @DecimalMin(value = "0.0")
    private BigDecimal amcCostPerYear;

    private AmcType amcType;
    private String amcCoverageNotes;

    private LocalDate lastMaintenanceDate;
    private LocalDate nextMaintenanceDate;

    public EquipmentRequestDTO() {
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public String getEquipmentCode() {
        return equipmentCode;
    }

    public void setEquipmentCode(String equipmentCode) {
        this.equipmentCode = equipmentCode;
    }

    public EquipmentCategory getCategory() {
        return category;
    }

    public void setCategory(EquipmentCategory category) {
        this.category = category;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public BigDecimal getPurchaseCost() {
        return purchaseCost;
    }

    public void setPurchaseCost(BigDecimal purchaseCost) {
        this.purchaseCost = purchaseCost;
    }

    public LocalDate getWarrantyUntil() {
        return warrantyUntil;
    }

    public void setWarrantyUntil(LocalDate warrantyUntil) {
        this.warrantyUntil = warrantyUntil;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAmcProvider() {
        return amcProvider;
    }

    public void setAmcProvider(String amcProvider) {
        this.amcProvider = amcProvider;
    }

    public String getAmcContact() {
        return amcContact;
    }

    public void setAmcContact(String amcContact) {
        this.amcContact = amcContact;
    }

    public LocalDate getAmcStart() {
        return amcStart;
    }

    public void setAmcStart(LocalDate amcStart) {
        this.amcStart = amcStart;
    }

    public LocalDate getAmcEnd() {
        return amcEnd;
    }

    public void setAmcEnd(LocalDate amcEnd) {
        this.amcEnd = amcEnd;
    }

    public BigDecimal getAmcCostPerYear() {
        return amcCostPerYear;
    }

    public void setAmcCostPerYear(BigDecimal amcCostPerYear) {
        this.amcCostPerYear = amcCostPerYear;
    }

    public AmcType getAmcType() {
        return amcType;
    }

    public void setAmcType(AmcType amcType) {
        this.amcType = amcType;
    }

    public String getAmcCoverageNotes() {
        return amcCoverageNotes;
    }

    public void setAmcCoverageNotes(String amcCoverageNotes) {
        this.amcCoverageNotes = amcCoverageNotes;
    }

    public LocalDate getLastMaintenanceDate() {
        return lastMaintenanceDate;
    }

    public void setLastMaintenanceDate(LocalDate lastMaintenanceDate) {
        this.lastMaintenanceDate = lastMaintenanceDate;
    }

    public LocalDate getNextMaintenanceDate() {
        return nextMaintenanceDate;
    }

    public void setNextMaintenanceDate(LocalDate nextMaintenanceDate) {
        this.nextMaintenanceDate = nextMaintenanceDate;
    }
}
