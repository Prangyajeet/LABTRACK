package com.prangyajeet.labtrack.sop.controller;

import com.prangyajeet.labtrack.sop.dto.SopDocumentResponseDTO;
import com.prangyajeet.labtrack.sop.service.SopService;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/sops")
public class SopController {

    private final SopService sopService;

    public SopController(
            SopService sopService
    ) {

        this.sopService = sopService;

    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<SopDocumentResponseDTO>> getAllSops() {

        return ResponseEntity.ok(
                sopService.getAllSops()
        );

    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<List<SopDocumentResponseDTO>> getSopsByDepartment(

            @PathVariable Long departmentId

    ) {

        return ResponseEntity.ok(
                sopService.getSopsByDepartment(
                        departmentId
                )
        );

    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<SopDocumentResponseDTO> uploadSop(

            @RequestParam("departmentId")
            Long departmentId,

            @RequestParam("file")
            MultipartFile file

    ) {

        return ResponseEntity.ok(
                sopService.uploadSop(
                        departmentId,
                        file
                )
        );

    }

    @GetMapping("/{id}/file")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<byte[]> getSopFile(

            @PathVariable Long id

    ) {

        byte[] file =
                sopService.getSopFile(id);

        String contentType =
                sopService.getContentType(id);

        MediaType mediaType;

        try {

            mediaType =
                    MediaType.parseMediaType(
                            contentType
                    );

        } catch (Exception exception) {

            mediaType =
                    MediaType.APPLICATION_OCTET_STREAM;

        }

        return ResponseEntity.ok()

                .contentType(mediaType)

                .body(file);

    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<byte[]> downloadSop(

            @PathVariable Long id

    ) {

        byte[] file =
                sopService.getSopFile(id);

        String contentType =
                sopService.getContentType(id);

        String originalFileName =
                sopService.getOriginalFileName(id);

        MediaType mediaType;

        try {

            mediaType =
                    MediaType.parseMediaType(
                            contentType
                    );

        } catch (Exception exception) {

            mediaType =
                    MediaType.APPLICATION_OCTET_STREAM;

        }

        ContentDisposition disposition =
                ContentDisposition
                        .attachment()
                        .filename(
                                originalFileName
                        )
                        .build();

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentDisposition(
                disposition
        );

        headers.setContentType(
                mediaType
        );

        return ResponseEntity.ok()

                .headers(headers)

                .body(file);

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Void> deleteSop(

            @PathVariable Long id

    ) {

        sopService.deleteSop(id);

        return ResponseEntity.noContent()
                .build();

    }

}