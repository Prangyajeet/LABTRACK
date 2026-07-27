package com.prangyajeet.labtrack.storage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class StorageLocationRequestDTO {

    @NotBlank(message = "Location code is required.")
    @Size(max = 20, message = "Location code cannot exceed 20 characters.")
    private String locationCode;

    @NotBlank(message = "Location name is required.")
    @Size(max = 100, message = "Location name cannot exceed 100 characters.")
    private String locationName;

    @Size(max = 500, message = "Description cannot exceed 500 characters.")
    private String description;

    public StorageLocationRequestDTO() {
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