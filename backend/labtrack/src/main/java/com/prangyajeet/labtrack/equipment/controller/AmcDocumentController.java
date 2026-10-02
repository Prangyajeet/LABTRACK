package com.prangyajeet.labtrack.equipment.controller;

import com.prangyajeet.labtrack.equipment.dto.AmcDocumentResponseDTO;
import com.prangyajeet.labtrack.equipment.service.AmcDocumentService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(
        "/api/equipment/{equipmentId}/amc-documents"
)
public class AmcDocumentController {

    private final AmcDocumentService
            amcDocumentService;

    public AmcDocumentController(
            AmcDocumentService amcDocumentService) {

        this.amcDocumentService =
                amcDocumentService;
    }

    /*
     * ============================================================
     * GET AMC DOCUMENTS
     * ============================================================
     */

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<AmcDocumentResponseDTO>>
    getDocuments(
            @PathVariable Long equipmentId) {

        return ResponseEntity.ok(
                amcDocumentService.getDocuments(
                        equipmentId
                )
        );
    }

    /*
     * ============================================================
     * UPLOAD AMC DOCUMENT
     * ============================================================
     */

    @PostMapping(
            consumes =
                    MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<AmcDocumentResponseDTO>
    uploadDocument(

            @PathVariable Long equipmentId,

            @RequestPart("file")
            MultipartFile file,

            @RequestParam("documentType")
            String documentType) {

        AmcDocumentResponseDTO response =
                amcDocumentService.uploadDocument(
                        equipmentId,
                        file,
                        documentType
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /*
     * ============================================================
     * VIEW / DOWNLOAD DOCUMENT
     * ============================================================
     */

    @GetMapping("/{documentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<byte[]>
    getDocument(

            @PathVariable Long equipmentId,

            @PathVariable Long documentId) {

        AmcDocumentService.DocumentFile
                documentFile =
                amcDocumentService.getDocumentFile(
                        equipmentId,
                        documentId
                );

        MediaType mediaType =
                MediaType.APPLICATION_OCTET_STREAM;

        if (documentFile.contentType() != null
                && !documentFile.contentType().isBlank()) {

            try {

                mediaType =
                        MediaType.parseMediaType(
                                documentFile.contentType()
                        );

            } catch (Exception ignored) {

                mediaType =
                        MediaType.APPLICATION_OCTET_STREAM;
            }
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                documentFile.fileName() +
                                "\""
                )
                .body(
                        documentFile.data()
                );
    }

    /*
     * ============================================================
     * DELETE DOCUMENT
     * ============================================================
     */

    @DeleteMapping("/{documentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Void>
    deleteDocument(

            @PathVariable Long equipmentId,

            @PathVariable Long documentId) {

        amcDocumentService.deleteDocument(
                equipmentId,
                documentId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}