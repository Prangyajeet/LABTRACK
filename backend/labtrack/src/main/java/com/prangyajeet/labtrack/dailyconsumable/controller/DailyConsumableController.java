package com.prangyajeet.labtrack.dailyconsumable.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableRequestDTO;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableResponseDTO;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableSummaryDTO;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableUsageResponseDTO;
import com.prangyajeet.labtrack.dailyconsumable.service.DailyConsumableService;
import com.prangyajeet.labtrack.storage.service.SupabaseStorageService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/daily-consumables")
public class DailyConsumableController {

    private final DailyConsumableService dailyConsumableService;

    private final SupabaseStorageService supabaseStorageService;

    private final String consumablePhotoBucket;

    public DailyConsumableController(
            DailyConsumableService dailyConsumableService,
            SupabaseStorageService supabaseStorageService,
            @Value("${supabase.storage.consumable-photo-bucket:consumable-photos}")
            String consumablePhotoBucket) {

        this.dailyConsumableService =
                dailyConsumableService;

        this.supabaseStorageService =
                supabaseStorageService;

        this.consumablePhotoBucket =
                consumablePhotoBucket;
    }

    /*
     * =========================================================
     * EXISTING - GET ALL CONSUMABLES
     * =========================================================
     */

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<List<DailyConsumableResponseDTO>>>
    getAllConsumables() {

        List<DailyConsumableResponseDTO> consumables =
                dailyConsumableService
                        .getAllConsumables();

        ApiResponse<List<DailyConsumableResponseDTO>>
                response =
                new ApiResponse<>(
                        true,
                        "Daily consumables fetched successfully",
                        consumables
                );

        return ResponseEntity.ok(response);
    }

    /*
     * =========================================================
     * EXISTING - GET LOW STOCK
     * =========================================================
     */

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<List<DailyConsumableResponseDTO>>>
    getLowStockConsumables() {

        List<DailyConsumableResponseDTO> consumables =
                dailyConsumableService
                        .getLowStockConsumables();

        ApiResponse<List<DailyConsumableResponseDTO>>
                response =
                new ApiResponse<>(
                        true,
                        "Low stock daily consumables fetched successfully",
                        consumables
                );

        return new ResponseEntity<>(
                response,
                HttpStatus.OK
        );
    }

    /*
     * =========================================================
     * GET TODAY USAGE
     * =========================================================
     *
     * IMPORTANT:
     *
     * This endpoint must be above /{id}.
     */

    @GetMapping("/today")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<List<DailyConsumableUsageResponseDTO>>>
    getTodayUsage() {

        List<DailyConsumableUsageResponseDTO> records =
                dailyConsumableService
                        .getTodayUsage();

        ApiResponse<
                List<DailyConsumableUsageResponseDTO>>
                response =
                new ApiResponse<>(
                        true,
                        "Today's consumable usage fetched successfully",
                        records
                );

        return ResponseEntity.ok(response);
    }

    /*
     * =========================================================
     * SUMMARY
     * =========================================================
     */

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<DailyConsumableSummaryDTO>>
    getUsageSummary(

            @RequestParam(required = false)
            LocalDate date,

            @RequestParam(required = false)
            Long departmentId,

            @RequestParam(required = false)
            String search) {

        DailyConsumableSummaryDTO summary =
                dailyConsumableService
                        .getUsageSummary(
                                date,
                                departmentId,
                                search
                        );

        ApiResponse<DailyConsumableSummaryDTO>
                response =
                new ApiResponse<>(
                        true,
                        "Daily consumable usage summary fetched successfully",
                        summary
                );

        return ResponseEntity.ok(response);
    }

    /*
     * =========================================================
     * GET USAGE RECORDS
     * =========================================================
     */

    @GetMapping("/usage")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<List<DailyConsumableUsageResponseDTO>>>
    getUsageRecords(

            @RequestParam(required = false)
            LocalDate date,

            @RequestParam(required = false)
            Long departmentId,

            @RequestParam(required = false)
            String search) {

        List<DailyConsumableUsageResponseDTO> records =
                dailyConsumableService
                        .getUsageRecords(
                                date,
                                departmentId,
                                search
                        );

        ApiResponse<
                List<DailyConsumableUsageResponseDTO>>
                response =
                new ApiResponse<>(
                        true,
                        "Daily consumable usage records fetched successfully",
                        records
                );

        return ResponseEntity.ok(response);
    }

    /*
     * =========================================================
     * LOG USAGE
     * =========================================================
     */

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<DailyConsumableUsageResponseDTO>>
    logUsage(
            @RequestBody
            DailyConsumableRequestDTO requestDTO) {

        DailyConsumableUsageResponseDTO usage =
                dailyConsumableService
                        .logUsage(requestDTO);

        ApiResponse<
                DailyConsumableUsageResponseDTO>
                response =
                new ApiResponse<>(
                        true,
                        "Consumable usage logged successfully",
                        usage
                );

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    /*
     * =========================================================
     * GET USAGE BY ID
     * =========================================================
     */

    @GetMapping("/usage/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<DailyConsumableUsageResponseDTO>>
    getUsageById(
            @PathVariable Long id) {

        DailyConsumableUsageResponseDTO usage =
                dailyConsumableService
                        .getUsageById(id);

        ApiResponse<
                DailyConsumableUsageResponseDTO>
                response =
                new ApiResponse<>(
                        true,
                        "Consumable usage fetched successfully",
                        usage
                );

        return ResponseEntity.ok(response);
    }

    /*
     * =========================================================
     * UPDATE USAGE
     * =========================================================
     */

    @PutMapping("/usage/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<DailyConsumableUsageResponseDTO>>
    updateUsage(

            @PathVariable Long id,

            @RequestBody
            DailyConsumableRequestDTO requestDTO) {

        DailyConsumableUsageResponseDTO usage =
                dailyConsumableService
                        .updateUsage(
                                id,
                                requestDTO
                        );

        ApiResponse<
                DailyConsumableUsageResponseDTO>
                response =
                new ApiResponse<>(
                        true,
                        "Consumable usage updated successfully",
                        usage
                );

        return ResponseEntity.ok(response);
    }

    /*
     * =========================================================
     * UPLOAD / REPLACE USAGE PHOTO
     * =========================================================
     */

    @PostMapping("/usage/{id}/photo")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<String>>
    uploadUsagePhoto(

            @PathVariable Long id,

            @RequestParam("photo")
            MultipartFile photo) {

        String fileName =
                dailyConsumableService
                        .uploadUsagePhoto(
                                id,
                                photo
                        );

        ApiResponse<String> response =
                new ApiResponse<>(
                        true,
                        "Consumable usage photo uploaded successfully",
                        fileName
                );

        return ResponseEntity.ok(response);
    }

    /*
     * =========================================================
     * GET USAGE PHOTO
     * =========================================================
     */

    @GetMapping("/usage/{id}/photo")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<?> getUsagePhoto(
            @PathVariable Long id) {

        String photoPath =
                dailyConsumableService
                        .getUsagePhotoPath(id);

        try {

            byte[] fileBytes =
                    supabaseStorageService.downloadFile(
                            consumablePhotoBucket,
                            photoPath
                    );

            String fileName =
                    photoPath.substring(
                            photoPath.lastIndexOf('/') + 1
                    );

            MediaType contentType =
                    MediaTypeFactory
                            .getMediaType(fileName)
                            .orElse(
                                    MediaType.APPLICATION_OCTET_STREAM
                            );

            ByteArrayResource resource =
                    new ByteArrayResource(fileBytes);

            return ResponseEntity.ok()
                    .contentType(contentType)
                    .contentLength(fileBytes.length)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" +
                                    fileName +
                                    "\""
                    )
                    .body(resource);

        } catch (Exception exception) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            new ApiResponse<>(
                                    false,
                                    "Unable to load usage photo",
                                    null
                            )
                    );
        }
    }

    /*
     * =========================================================
     * DELETE USAGE PHOTO
     * =========================================================
     */

    @DeleteMapping("/usage/{id}/photo")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<Void>>
    deleteUsagePhoto(
            @PathVariable Long id) {

        dailyConsumableService
                .deleteUsagePhoto(id);

        ApiResponse<Void> response =
                new ApiResponse<>(
                        true,
                        "Consumable usage photo deleted successfully",
                        null
                );

        return ResponseEntity.ok(response);
    }

    /*
     * =========================================================
     * DELETE / CORRECT USAGE
     * =========================================================
     */

    @DeleteMapping("/usage/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<Void>>
    deleteUsage(
            @PathVariable Long id) {

        dailyConsumableService.deleteUsage(id);

        ApiResponse<Void> response =
                new ApiResponse<>(
                        true,
                        "Consumable usage corrected and stock restored successfully",
                        null
                );

        return ResponseEntity.ok(response);
    }

    /*
     * =========================================================
     * EXISTING - GET CONSUMABLE BY ID
     * =========================================================
     */

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<
            ApiResponse<DailyConsumableResponseDTO>>
    getConsumableById(
            @PathVariable Long id) {

        DailyConsumableResponseDTO consumable =
                dailyConsumableService
                        .getConsumableById(id);

        ApiResponse<DailyConsumableResponseDTO>
                response =
                new ApiResponse<>(
                        true,
                        "Daily consumable fetched successfully",
                        consumable
                );

        return ResponseEntity.ok(response);
    }
}