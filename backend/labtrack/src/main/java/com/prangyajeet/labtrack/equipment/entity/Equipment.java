package com.prangyajeet.labtrack.equipment.entity;

import com.prangyajeet.labtrack.common.entity.AuditableEntity;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.department.entity.Department;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "equipment",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_equipment_equipment_code",
                        columnNames = "equipment_code"
                ),
                @UniqueConstraint(
                        name = "uk_equipment_serial_number",
                        columnNames = "serial_number"
                )
        }
)
public class Equipment extends AuditableEntity {

    @Column(name = "equipment_name", nullable = false, length = 150)
    private String equipmentName;

    @Column(name = "equipment_code", nullable = false, length = 50)
    private String equipmentCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private EquipmentCategory category;

    /*
     * ============================================================
     * DEPARTMENT
     * ============================================================
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "department_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_equipment_department")
    )
    private Department department;

    @Column(name = "manufacturer", nullable = false, length = 150)
    private String manufacturer;

    @Column(name = "model", length = 100)
    private String model;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "purchase_cost", precision = 15, scale = 2)
    private BigDecimal purchaseCost;

    @Column(name = "warranty_until")
    private LocalDate warrantyUntil;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "amc_provider", length = 150)
    private String amcProvider;

    @Column(name = "amc_contact", length = 150)
    private String amcContact;

    @Column(name = "amc_start")
    private LocalDate amcStart;

    @Column(name = "amc_end")
    private LocalDate amcEnd;

    @Column(name = "amc_cost_per_year", precision = 15, scale = 2)
    private BigDecimal amcCostPerYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "amc_type", length = 30)
    private AmcType amcType;

    @Column(name = "amc_coverage_notes", length = 1000)
    private String amcCoverageNotes;

    @Column(name = "last_maintenance_date")
    private LocalDate lastMaintenanceDate;

    @Column(name = "next_maintenance_date")
    private LocalDate nextMaintenanceDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private Status status = Status.ACTIVE;

    public Equipment() {
    }

    public Long getId() {
        return super.getId();
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public String getEquipmentCode() {
        return equipmentCode;
    }

    public EquipmentCategory getCategory() {
        return category;
    }

    public Department getDepartment() {
        return department;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public String getModel() {
        return model;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public BigDecimal getPurchaseCost() {
        return purchaseCost;
    }

    public LocalDate getWarrantyUntil() {
        return warrantyUntil;
    }

    public String getLocation() {
        return location;
    }

    public String getAmcProvider() {
        return amcProvider;
    }

    public String getAmcContact() {
        return amcContact;
    }

    public LocalDate getAmcStart() {
        return amcStart;
    }

    public LocalDate getAmcEnd() {
        return amcEnd;
    }

    public BigDecimal getAmcCostPerYear() {
        return amcCostPerYear;
    }

    public AmcType getAmcType() {
        return amcType;
    }

    public String getAmcCoverageNotes() {
        return amcCoverageNotes;
    }

    public LocalDate getLastMaintenanceDate() {
        return lastMaintenanceDate;
    }

    public LocalDate getNextMaintenanceDate() {
        return nextMaintenanceDate;
    }

    public Status getStatus() {
        return status;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }

    public void setEquipmentCode(String equipmentCode) {
        this.equipmentCode = equipmentCode;
    }

    public void setCategory(EquipmentCategory category) {
        this.category = category;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public void setPurchaseCost(BigDecimal purchaseCost) {
        this.purchaseCost = purchaseCost;
    }

    public void setWarrantyUntil(LocalDate warrantyUntil) {
        this.warrantyUntil = warrantyUntil;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setAmcProvider(String amcProvider) {
        this.amcProvider = amcProvider;
    }

    public void setAmcContact(String amcContact) {
        this.amcContact = amcContact;
    }

    public void setAmcStart(LocalDate amcStart) {
        this.amcStart = amcStart;
    }

    public void setAmcEnd(LocalDate amcEnd) {
        this.amcEnd = amcEnd;
    }

    public void setAmcCostPerYear(BigDecimal amcCostPerYear) {
        this.amcCostPerYear = amcCostPerYear;
    }

    public void setAmcType(AmcType amcType) {
        this.amcType = amcType;
    }

    public void setAmcCoverageNotes(String amcCoverageNotes) {
        this.amcCoverageNotes = amcCoverageNotes;
    }

    public void setLastMaintenanceDate(LocalDate lastMaintenanceDate) {
        this.lastMaintenanceDate = lastMaintenanceDate;
    }

    public void setNextMaintenanceDate(LocalDate nextMaintenanceDate) {
        this.nextMaintenanceDate = nextMaintenanceDate;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}