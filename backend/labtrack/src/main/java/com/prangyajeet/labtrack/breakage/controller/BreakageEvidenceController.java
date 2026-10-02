package com.prangyajeet.labtrack.breakage.controller;

import com.prangyajeet.labtrack.breakage.entity.BreakageEvidence;
import com.prangyajeet.labtrack.breakage.service.BreakageEvidenceService;
import com.prangyajeet.labtrack.storage.service.SupabaseStorageService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/breakages")
public class BreakageEvidenceController {

    private final BreakageEvidenceService evidenceService;
    private final SupabaseStorageService supabaseStorageService;
    private final String consumablePhotoBucket;

    public BreakageEvidenceController(
            BreakageEvidenceService evidenceService,
            SupabaseStorageService supabaseStorageService,
            @Value("${supabase.storage.consumable-photo-bucket:consumable-photos}")
            String consumablePhotoBucket) {

        this.evidenceService = evidenceService;
        this.supabaseStorageService = supabaseStorageService;
        this.consumablePhotoBucket = consumablePhotoBucket;
    }

    @PostMapping(
            value = "/{breakageId}/evidence",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<BreakageEvidence> uploadEvidence(
            @PathVariable Long breakageId,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                evidenceService.uploadEvidence(
                        breakageId,
                        file
                )
        );
    }

    @GetMapping("/{breakageId}/evidence")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<BreakageEvidence>> getEvidence(
            @PathVariable Long breakageId) {

        return ResponseEntity.ok(
                evidenceService.getEvidence(
                        breakageId
                )
        );
    }

    @GetMapping("/{breakageId}/evidence/{evidenceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<Resource> viewEvidence(
            @PathVariable Long breakageId,
            @PathVariable Long evidenceId) {

        try {

            BreakageEvidence evidence =
                    evidenceService.getEvidenceById(
                            breakageId,
                            evidenceId
                    );

            byte[] fileData =
                    supabaseStorageService.downloadFile(
                            consumablePhotoBucket,
                            evidence.getFilePath()
                    );

            Resource resource =
                    new ByteArrayResource(fileData);

            MediaType mediaType =
                    MediaType.parseMediaType(
                            evidence.getContentType()
                    );

            String contentDisposition =
                    "inline; filename=\"" +
                            evidence.getOriginalFileName() +
                            "\"";

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .contentLength(fileData.length)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            contentDisposition
                    )
                    .body(resource);

        } catch (Exception exception) {

            exception.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}