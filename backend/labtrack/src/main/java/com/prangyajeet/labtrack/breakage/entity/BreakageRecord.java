package com.prangyajeet.labtrack.breakage.entity;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.item.entity.Item;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "breakage_records",
        indexes = {
                @Index(
                        name = "idx_breakage_date",
                        columnList = "breakage_date_time"
                ),
                @Index(
                        name = "idx_breakage_item",
                        columnList = "inventory_item_id"
                ),
                @Index(
                        name = "idx_breakage_person_type",
                        columnList = "person_type"
                ),
                @Index(
                        name = "idx_breakage_recovery_status",
                        columnList = "recovery_status"
                ),
                @Index(
                        name = "idx_breakage_status",
                        columnList = "status"
                )
        }
)
public class BreakageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * IMPORTANT:
     * Breakage now references the actual Item entity
     * used by the Item Register.
     *
     * Database:
     * breakage_records.inventory_item_id
     *              ->
     * items.id
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "inventory_item_id",
            nullable = false
    )
    private Item inventoryItem;

    @Column(
            name = "breakage_date_time",
            nullable = false
    )
    private LocalDateTime breakageDateTime;

    @Column(nullable = false)
    private Integer quantity;

    @Column(
            name = "responsible_name",
            nullable = false,
            length = 150
    )
    private String responsibleName;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "person_type",
            nullable = false,
            length = 20
    )
    private BreakagePersonType personType;

    @Column(
            name = "responsible_id",
            length = 100
    )
    private String responsibleId;

    @Column(
            name = "department_class_section",
            length = 200
    )
    private String departmentClassSection;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String cause;

    @Column(
            name = "estimated_cost",
            precision = 15,
            scale = 2
    )
    private BigDecimal estimatedCost;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "recovery_status",
            nullable = false,
            length = 20
    )
    private BreakageRecoveryStatus recoveryStatus;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 20
    )
    private Status status;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }

        if (status == null) {
            status = Status.ACTIVE;
        }

        if (recoveryStatus == null) {
            recoveryStatus = BreakageRecoveryStatus.PENDING;
        }

        if (estimatedCost == null) {
            estimatedCost = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Item getInventoryItem() {
        return inventoryItem;
    }

    public void setInventoryItem(Item inventoryItem) {
        this.inventoryItem = inventoryItem;
    }

    public LocalDateTime getBreakageDateTime() {
        return breakageDateTime;
    }

    public void setBreakageDateTime(
            LocalDateTime breakageDateTime) {

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

    public void setPersonType(
            BreakagePersonType personType) {

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

    public void setDepartmentClassSection(
            String departmentClassSection) {

        this.departmentClassSection =
                departmentClassSection;
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

    public void setEstimatedCost(
            BigDecimal estimatedCost) {

        this.estimatedCost = estimatedCost;
    }

    public BreakageRecoveryStatus getRecoveryStatus() {
        return recoveryStatus;
    }

    public void setRecoveryStatus(
            BreakageRecoveryStatus recoveryStatus) {

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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}