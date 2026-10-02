package com.prangyajeet.labtrack.equipment.service;

import com.prangyajeet.labtrack.equipment.dto.AmcDocumentResponseDTO;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AmcDocumentService {

    /*
     * ============================================================
     * GET DOCUMENTS
     * ============================================================
     */

    List<AmcDocumentResponseDTO> getDocuments(
            Long equipmentId
    );

    /*
     * ============================================================
     * UPLOAD DOCUMENT
     * ============================================================
     */

    AmcDocumentResponseDTO uploadDocument(
            Long equipmentId,
            MultipartFile file,
            String documentType
    );

    /*
     * ============================================================
     * GET FILE CONTENT
     * ============================================================
     */

    DocumentFile getDocumentFile(
            Long equipmentId,
            Long documentId
    );

    /*
     * ============================================================
     * DELETE DOCUMENT
     * ============================================================
     */

    void deleteDocument(
            Long equipmentId,
            Long documentId
    );

    /*
     * ============================================================
     * DOCUMENT FILE
     * ============================================================
     */

    record DocumentFile(
            byte[] data,
            String fileName,
            String contentType
    ) {
    }
}