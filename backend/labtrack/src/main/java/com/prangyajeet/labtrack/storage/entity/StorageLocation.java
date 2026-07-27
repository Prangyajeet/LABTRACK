package com.prangyajeet.labtrack.storage.entity;

import com.prangyajeet.labtrack.common.entity.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "storage_locations")
public class StorageLocation extends AuditableEntity {

    @Column(name = "location_code", nullable = false, length = 20)
    private String locationCode;

    @Column(name = "location_name", nullable = false, length = 100)
    private String locationName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    public StorageLocation() {
    }

    public String getLocationCode() {
        return locationCode;
    }

    public void setLocationCode(String locationCode) {
        this.locationCode = locationCode;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}