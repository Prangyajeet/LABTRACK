package com.prangyajeet.labtrack.sop.service;

import com.prangyajeet.labtrack.sop.dto.SopDocumentResponseDTO;
import com.prangyajeet.labtrack.sop.entity.SopDocument;
import com.prangyajeet.labtrack.sop.exception.SopException;
import com.prangyajeet.labtrack.sop.repository.SopDocumentRepository;
import com.prangyajeet.labtrack.storage.service.SupabaseStorageService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SopServiceImpl implements SopService {

    private static final long MAX_FILE_SIZE =
            10L * 1024L * 1024L;

    private static final List<String> ALLOWED_EXTENSIONS =
            List.of(
                    "pdf",
                    "doc",
                    "docx"
            );

    private static final List<String> ALLOWED_CONTENT_TYPES =
            List.of(
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );

    private final SopDocumentRepository sopDocumentRepository;

    private final SupabaseStorageService supabaseStorageService;

    private final String sopBucket;

    public SopServiceImpl(
            SopDocumentRepository sopDocumentRepository,
            SupabaseStorageService supabaseStorageService,
            @Value("${supabase.storage.sop-bucket:sop-documents}")
            String sopBucket
    ) {
        this.sopDocumentRepository =
                sopDocumentRepository;

        this.supabaseStorageService =
                supabaseStorageService;

        this.sopBucket =
                sopBucket;
    }

    @Override
    public List<SopDocumentResponseDTO> getAllSops() {

        return sopDocumentRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

    }

    @Override
    public List<SopDocumentResponseDTO> getSopsByDepartment(
            Long departmentId
    ) {

        if (departmentId == null) {
            throw new SopException(
                    "Department ID is required."
            );
        }

        return sopDocumentRepository
                .findByDepartmentIdOrderByUploadedAtDesc(
                        departmentId
                )
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

    }

    @Override
    public SopDocumentResponseDTO uploadSop(
            Long departmentId,
            MultipartFile file
    ) {

        if (departmentId == null) {
            throw new SopException(
                    "Department ID is required."
            );
        }

        validateFile(file);

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            throw new SopException(
                    "File name is missing."
            );
        }

        String extension =
                getExtension(
                        originalFileName
                );

        String storedFileName =
                UUID.randomUUID()
                        + "."
                        + extension;

        /*
         * Keep the existing stored file name.
         *
         * The file is now stored in Supabase Storage
         * under the sop-documents bucket.
         */
        String objectPath =
                storedFileName;

        String contentType =
                file.getContentType() != null
                        ? file.getContentType()
                        : "application/octet-stream";

        try {

            supabaseStorageService.uploadFile(
                    sopBucket,
                    objectPath,
                    file.getBytes(),
                    contentType
            );

        } catch (Exception exception) {

            throw new SopException(
                    "Unable to store SOP file.",
                    exception
            );
        }

        SopDocument document =
                new SopDocument();

        document.setDepartmentId(
                departmentId
        );

        document.setOriginalFileName(
                originalFileName
        );

        document.setStoredFileName(
                storedFileName
        );

        document.setContentType(
                contentType
        );

        document.setFileSize(
                file.getSize()
        );

        /*
         * Store the Supabase Storage object path
         * in the existing file_path column.
         */
        document.setFilePath(
                objectPath
        );

        try {

            SopDocument saved =
                    sopDocumentRepository.save(
                            document
                    );

            return toResponse(saved);

        } catch (Exception exception) {

            /*
             * If database save fails after the Storage
             * upload, remove the uploaded file.
             */
            try {

                supabaseStorageService.deleteFile(
                        sopBucket,
                        objectPath
                );

            } catch (Exception cleanupException) {

                exception.addSuppressed(
                        cleanupException
                );
            }

            throw new SopException(
                    "Unable to save SOP document.",
                    exception
            );
        }

    }

    @Override
    public byte[] getSopFile(
            Long id
    ) {

        SopDocument document =
                getDocument(id);

        String objectPath =
                document.getFilePath();

        if (objectPath == null ||
                objectPath.isBlank()) {

            throw new SopException(
                    "SOP file path is missing."
            );
        }

        try {

            return supabaseStorageService.downloadFile(
                    sopBucket,
                    objectPath
            );

        } catch (Exception exception) {

            throw new SopException(
                    "Unable to read SOP file.",
                    exception
            );
        }

    }

    @Override
    public String getOriginalFileName(
            Long id
    ) {

        return getDocument(id)
                .getOriginalFileName();

    }

    @Override
    public String getContentType(
            Long id
    ) {

        return getDocument(id)
                .getContentType();

    }

    @Override
    public void deleteSop(
            Long id
    ) {

        SopDocument document =
                getDocument(id);

        String objectPath =
                document.getFilePath();

        if (objectPath != null &&
                !objectPath.isBlank()) {

            try {

                supabaseStorageService.deleteFile(
                        sopBucket,
                        objectPath
                );

            } catch (Exception exception) {

                throw new SopException(
                        "Unable to delete SOP file.",
                        exception
                );
            }
        }

        sopDocumentRepository.delete(
                document
        );

    }

    private SopDocument getDocument(
            Long id
    ) {

        if (id == null) {
            throw new SopException(
                    "SOP document ID is required."
            );
        }

        return sopDocumentRepository
                .findById(id)
                .orElseThrow(
                        () -> new SopException(
                                "SOP document not found."
                        )
                );

    }

    private SopDocumentResponseDTO toResponse(
            SopDocument document
    ) {

        return new SopDocumentResponseDTO(
                document.getId(),
                document.getDepartmentId(),
                document.getOriginalFileName(),
                document.getContentType(),
                document.getFileSize(),
                document.getUploadedAt()
        );

    }

    private void validateFile(
            MultipartFile file
    ) {

        if (file == null ||
                file.isEmpty()) {

            throw new SopException(
                    "Please select an SOP file."
            );
        }

        if (file.getSize() >
                MAX_FILE_SIZE) {

            throw new SopException(
                    "File size must not exceed 10 MB."
            );
        }

        String fileName =
                file.getOriginalFilename();

        String extension =
                getExtension(fileName);

        boolean validExtension =
                ALLOWED_EXTENSIONS
                        .contains(
                                extension
                        );

        String contentType =
                file.getContentType();

        boolean validContentType =
                contentType != null &&
                        ALLOWED_CONTENT_TYPES
                                .contains(
                                        contentType
                                );

        if (!validExtension &&
                !validContentType) {

            throw new SopException(
                    "Unsupported file type. Allowed: PDF, DOC and DOCX."
            );
        }

    }

    private String getExtension(
            String fileName
    ) {

        if (fileName == null ||
                !fileName.contains(".")) {

            return "";
        }

        return fileName
                .substring(
                        fileName.lastIndexOf(".") + 1
                )
                .toLowerCase();

    }

}