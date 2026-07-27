package com.prangyajeet.labtrack.role.dto;

import java.time.LocalDateTime;

public class RoleResponseDTO {

    private Long id;

    private String roleName;

    private String description;

    private LocalDateTime createdAt;

    public RoleResponseDTO() {
    }

    public RoleResponseDTO(Long id,
                           String roleName,
                           String description,
                           LocalDateTime createdAt) {
        this.id = id;
        this.roleName = roleName;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}