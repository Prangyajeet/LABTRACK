package com.prangyajeet.labtrack.equipment.serviceImpl;

import com.prangyajeet.labtrack.equipment.dto.AmcDocumentResponseDTO;
import com.prangyajeet.labtrack.equipment.entity.AmcDocument;
import com.prangyajeet.labtrack.equipment.entity.Equipment;
import com.prangyajeet.labtrack.equipment.repository.AmcDocumentRepository;
import com.prangyajeet.labtrack.equipment.repository.EquipmentRepository;
import com.prangyajeet.labtrack.equipment.service.AmcDocumentService;
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
public class AmcDocumentServiceImpl
        implements AmcDocumentService {

    private static final long MAX_FILE_SIZE =
            10L * 1024L * 1024L;

    private final AmcDocumentRepository
            amcDocumentRepository;

    private final EquipmentRepository
            equipmentRepository;

    private final SupabaseStorageService
            supabaseStorageService;

    private final String amcBucket;

    public AmcDocumentServiceImpl(
            AmcDocumentRepository amcDocumentRepository,
            EquipmentRepository equipmentRepository,
            SupabaseStorageService supabaseStorageService,
            @Value("${supabase.storage.amc-bucket}")
            String amcBucket) {

        this.amcDocumentRepository =
                amcDocumentRepository;

        this.equipmentRepository =
                equipmentRepository;

        this.supabaseStorageService =
                supabaseStorageService;

        this.amcBucket =
                amcBucket;
    }

    /*
     * ============================================================
     * GET ALL DOCUMENTS
     * ============================================================
     */

    @Override
    @Transactional(readOnly = true)
    public List<AmcDocumentResponseDTO> getDocuments(
            Long equipmentId) {

        Equipment equipment =
                getEquipment(equipmentId);

        return amcDocumentRepository
                .findByEquipmentOrderByCreatedAtDesc(
                        equipment
                )
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    /*
     * ============================================================
     * UPLOAD DOCUMENT
     * ============================================================
     */

    @Override
    public AmcDocumentResponseDTO uploadDocument(
            Long equipmentId,
            MultipartFile file,
            String documentType) {

        Equipment equipment =
                getEquipment(equipmentId);

        validateFile(file);

        if (documentType == null
                || documentType.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Document type is required."
            );
        }

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null
                || originalFileName.trim().isEmpty()) {

            originalFileName =
                    "AMC-Document";
        }

        String contentType =
                file.getContentType();

        if (contentType == null
                || contentType.isBlank()) {

            contentType =
                    "application/octet-stream";
        }

        String extension =
                getExtension(
                        originalFileName
                );

        String storedFileName =
                UUID.randomUUID()
                        + "."
                        + extension;

        String objectPath =
                "equipment/"
                        + equipmentId
                        + "/"
                        + storedFileName;

        try {

            /*
             * Upload the actual file to Supabase Storage.
             */

            supabaseStorageService.uploadFile(
                    amcBucket,
                    objectPath,
                    file.getBytes(),
                    contentType
            );

            /*
             * Store only metadata + Storage object path
             * inside PostgreSQL.
             */

            AmcDocument document =
                    new AmcDocument();

            document.setEquipment(
                    equipment
            );

            document.setDocumentName(
                    originalFileName
            );

            document.setDocumentType(
                    documentType.trim()
            );

            document.setFileName(
                    originalFileName
            );

            document.setContentType(
                    contentType
            );

            document.setFileSize(
                    file.getSize()
            );

            document.setFilePath(
                    objectPath
            );

            LocalDateTime now =
                    LocalDateTime.now();

            document.setCreatedAt(
                    now
            );

            document.setUpdatedAt(
                    now
            );

            AmcDocument saved =
                    amcDocumentRepository.save(
                            document
                    );

            return toResponseDTO(
                    saved
            );

        } catch (IOException exception) {

            throw new IllegalStateException(
                    "Unable to read the uploaded document.",
                    exception
            );
        }
    }

    /*
     * ============================================================
     * GET DOCUMENT FILE
     * ============================================================
     */

    @Override
    @Transactional(readOnly = true)
    public DocumentFile getDocumentFile(
            Long equipmentId,
            Long documentId) {

        Equipment equipment =
                getEquipment(equipmentId);

        AmcDocument document =
                amcDocumentRepository
                        .findByIdAndEquipment(
                                documentId,
                                equipment
                        )
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "AMC document not found."
                                )
                        );

        byte[] fileData =
                supabaseStorageService.downloadFile(
                        amcBucket,
                        document.getFilePath()
                );

        return new DocumentFile(
                fileData,
                document.getFileName(),
                document.getContentType()
        );
    }

    /*
     * ============================================================
     * DELETE DOCUMENT
     * ============================================================
     */

    @Override
    public void deleteDocument(
            Long equipmentId,
            Long documentId) {

        Equipment equipment =
                getEquipment(equipmentId);

        AmcDocument document =
                amcDocumentRepository
                        .findByIdAndEquipment(
                                documentId,
                                equipment
                        )
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "AMC document not found."
                                )
                        );

        /*
         * Delete the actual file from Supabase Storage.
         */

        if (document.getFilePath() != null
                && !document.getFilePath().isBlank()) {

            supabaseStorageService.deleteFile(
                    amcBucket,
                    document.getFilePath()
            );
        }

        /*
         * Delete the metadata record from PostgreSQL.
         */

        amcDocumentRepository.delete(
                document
        );
    }

    /*
     * ============================================================
     * FIND EQUIPMENT
     * ============================================================
     */

    private Equipment getEquipment(
            Long equipmentId) {

        if (equipmentId == null) {

            throw new IllegalArgumentException(
                    "Equipment ID is required."
            );
        }

        return equipmentRepository
                .findById(equipmentId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Equipment not found with ID: "
                                        + equipmentId
                        )
                );
    }

    /*
     * ============================================================
     * VALIDATE FILE
     * ============================================================
     */

    private void validateFile(
            MultipartFile file) {

        if (file == null
                || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "Please select an AMC document."
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {

            throw new IllegalArgumentException(
                    "File size must not exceed 10 MB."
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null) {

            throw new IllegalArgumentException(
                    "Unable to determine document type."
            );
        }

        boolean supported =
                contentType.equalsIgnoreCase(
                        "application/pdf"
                )
                || contentType.equalsIgnoreCase(
                        "application/msword"
                )
                || contentType.equalsIgnoreCase(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                )
                || contentType.equalsIgnoreCase(
                        "application/vnd.ms-excel"
                )
                || contentType.equalsIgnoreCase(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
                || contentType.equalsIgnoreCase(
                        "image/jpeg"
                )
                || contentType.equalsIgnoreCase(
                        "image/png"
                );

        if (!supported) {

            throw new IllegalArgumentException(
                    "Unsupported document format. "
                            + "Allowed formats: PDF, DOC, DOCX, XLS, XLSX, JPG and PNG."
            );
        }
    }

    /*
     * ============================================================
     * GET FILE EXTENSION
     * ============================================================
     */

    private String getExtension(
            String fileName) {

        if (fileName == null
                || !fileName.contains(".")) {

            return "bin";
        }

        return fileName
                .substring(
                        fileName.lastIndexOf(".") + 1
                )
                .toLowerCase();
    }

    /*
     * ============================================================
     * ENTITY → DTO
     * ============================================================
     */

    private AmcDocumentResponseDTO toResponseDTO(
            AmcDocument document) {

        Long equipmentId = null;

        if (document.getEquipment() != null) {

            equipmentId =
                    document
                            .getEquipment()
                            .getId();
        }

        return new AmcDocumentResponseDTO(
                document.getId(),
                equipmentId,
                document.getDocumentName(),
                document.getDocumentType(),
                document.getFileName(),
                document.getContentType(),
                document.getFileSize(),
                document.getCreatedAt()
        );
    }
}