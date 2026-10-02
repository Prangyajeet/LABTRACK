package com.prangyajeet.labtrack.breakage.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "breakage_evidence")
public class BreakageEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "breakage_id",
            nullable = false
    )
    private Long breakageId;

    @Column(
            name = "original_file_name",
            nullable = false
    )
    private String originalFileName;

    @Column(
            name = "stored_file_name",
            nullable = false,
            unique = true
    )
    private String storedFileName;

    @Column(
            name = "file_path",
            nullable = false
    )
    private String filePath;

    @Column(
            name = "content_type",
            nullable = false
    )
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(
            name = "uploaded_at",
            nullable = false
    )
    private LocalDateTime uploadedAt;

    public BreakageEvidence() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBreakageId() {
        return breakageId;
    }

    public void setBreakageId(Long breakageId) {
        this.breakageId = breakageId;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(
            String originalFileName) {

        this.originalFileName = originalFileName;
    }

    public String getStoredFileName() {
        return storedFileName;
    }

    public void setStoredFileName(
            String storedFileName) {

        this.storedFileName = storedFileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(
            String contentType) {

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

    public void setUploadedAt(
            LocalDateTime uploadedAt) {

        this.uploadedAt = uploadedAt;
    }
}