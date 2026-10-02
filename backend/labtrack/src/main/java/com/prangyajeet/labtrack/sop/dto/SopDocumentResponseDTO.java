package com.prangyajeet.labtrack.sop.dto;

import java.time.LocalDateTime;

public class SopDocumentResponseDTO {

    private Long id;

    private Long departmentId;

    private String originalFileName;

    private String contentType;

    private Long fileSize;

    private LocalDateTime uploadedAt;

    public SopDocumentResponseDTO() {
    }

    public SopDocumentResponseDTO(
            Long id,
            Long departmentId,
            String originalFileName,
            String contentType,
            Long fileSize,
            LocalDateTime uploadedAt
    ) {
        this.id = id;
        this.departmentId = departmentId;
        this.originalFileName = originalFileName;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}