package com.prangyajeet.labtrack.equipment.dto;

import java.time.LocalDateTime;

public class AmcDocumentResponseDTO {

    private Long id;

    private Long equipmentId;

    private String documentName;

    private String documentType;

    private String fileName;

    private String contentType;

    private Long fileSize;

    private LocalDateTime uploadedAt;

    /*
     * ============================================================
     * CONSTRUCTORS
     * ============================================================
     */

    public AmcDocumentResponseDTO() {
    }

    public AmcDocumentResponseDTO(
            Long id,
            Long equipmentId,
            String documentName,
            String documentType,
            String fileName,
            String contentType,
            Long fileSize,
            LocalDateTime uploadedAt) {

        this.id = id;
        this.equipmentId = equipmentId;
        this.documentName = documentName;
        this.documentType = documentType;
        this.fileName = fileName;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
    }

    /*
     * ============================================================
     * GETTERS / SETTERS
     * ============================================================
     */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
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