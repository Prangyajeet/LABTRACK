package com.prangyajeet.labtrack.breakage.serviceImpl;

import com.prangyajeet.labtrack.breakage.entity.BreakageEvidence;
import com.prangyajeet.labtrack.breakage.repository.BreakageEvidenceRepository;
import com.prangyajeet.labtrack.breakage.repository.BreakageRecordRepository;
import com.prangyajeet.labtrack.breakage.service.BreakageEvidenceService;
import com.prangyajeet.labtrack.storage.service.SupabaseStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BreakageEvidenceServiceImpl
        implements BreakageEvidenceService {

    private final BreakageEvidenceRepository evidenceRepository;

    private final BreakageRecordRepository breakageRecordRepository;

    private final SupabaseStorageService supabaseStorageService;

    private final String consumablePhotoBucket;

    public BreakageEvidenceServiceImpl(
            BreakageEvidenceRepository evidenceRepository,
            BreakageRecordRepository breakageRecordRepository,
            SupabaseStorageService supabaseStorageService,
            @Value("${supabase.storage.consumable-photo-bucket:consumable-photos}")
            String consumablePhotoBucket) {

        this.evidenceRepository = evidenceRepository;
        this.breakageRecordRepository = breakageRecordRepository;
        this.supabaseStorageService = supabaseStorageService;
        this.consumablePhotoBucket = consumablePhotoBucket;
    }

    @Override
    public BreakageEvidence uploadEvidence(
            Long breakageId,
            MultipartFile file) {

        if (breakageId == null) {
            throw new RuntimeException(
                    "Breakage ID is required"
            );
        }

        if (!breakageRecordRepository.existsById(breakageId)) {
            throw new RuntimeException(
                    "Breakage record not found"
            );
        }

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Evidence file is required"
            );
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !isAllowedImage(contentType)) {

            throw new RuntimeException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
            );
        }

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            throw new RuntimeException(
                    "Invalid file name"
            );
        }

        String extension =
                getExtension(originalFileName);

        String storedFileName =
                UUID.randomUUID() + extension;

        String objectPath =
                "breakages/"
                        + breakageId
                        + "/"
                        + storedFileName;

        try {

            byte[] fileData = file.getBytes();

            supabaseStorageService.uploadFile(
                    consumablePhotoBucket,
                    objectPath,
                    fileData,
                    contentType
            );

            BreakageEvidence evidence =
                    new BreakageEvidence();

            evidence.setBreakageId(
                    breakageId
            );

            evidence.setOriginalFileName(
                    originalFileName
            );

            evidence.setStoredFileName(
                    storedFileName
            );

            evidence.setFilePath(
                    objectPath
            );

            evidence.setContentType(
                    contentType
            );

            evidence.setFileSize(
                    file.getSize()
            );

            evidence.setUploadedAt(
                    LocalDateTime.now()
            );

            try {

                return evidenceRepository.save(
                        evidence
                );

            } catch (RuntimeException databaseException) {

                try {
                    supabaseStorageService.deleteFile(
                            consumablePhotoBucket,
                            objectPath
                    );
                } catch (RuntimeException storageException) {
                    databaseException.addSuppressed(
                            storageException
                    );
                }

                throw databaseException;
            }

        } catch (IOException exception) {

            throw new RuntimeException(
                    "Failed to read evidence file",
                    exception
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<BreakageEvidence> getEvidence(
            Long breakageId) {

        return evidenceRepository
                .findAllByBreakageIdOrderByUploadedAtDesc(
                        breakageId
                );
    }

    @Override
    @Transactional(readOnly = true)
    public BreakageEvidence getEvidenceById(
            Long breakageId,
            Long evidenceId) {

        return evidenceRepository
                .findByIdAndBreakageId(
                        evidenceId,
                        breakageId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Breakage evidence not found"
                        )
                );
    }

    private boolean isAllowedImage(
            String contentType) {

        return contentType.equalsIgnoreCase(
                    "image/jpeg"
                )
                || contentType.equalsIgnoreCase(
                    "image/png"
                )
                || contentType.equalsIgnoreCase(
                    "image/webp"
                );
    }

    private String getExtension(
            String fileName) {

        int index =
                fileName.lastIndexOf(".");

        if (index < 0) {
            return "";
        }

        return fileName
                .substring(index)
                .toLowerCase();
    }
}