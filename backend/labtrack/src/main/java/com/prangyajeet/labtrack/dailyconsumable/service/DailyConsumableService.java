package com.prangyajeet.labtrack.dailyconsumable.service;

import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableRequestDTO;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableResponseDTO;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableSummaryDTO;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableUsageResponseDTO;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface DailyConsumableService {

    /*
     * Existing inventory/consumable APIs
     */

    List<DailyConsumableResponseDTO> getAllConsumables();

    DailyConsumableResponseDTO getConsumableById(Long id);

    List<DailyConsumableResponseDTO> getLowStockConsumables();

    /*
     * Phase 2A - Usage Management
     */

    DailyConsumableUsageResponseDTO logUsage(
            DailyConsumableRequestDTO requestDTO
    );

    List<DailyConsumableUsageResponseDTO> getUsageRecords(
            LocalDate date,
            Long departmentId,
            String search
    );

    List<DailyConsumableUsageResponseDTO> getTodayUsage();

    DailyConsumableSummaryDTO getUsageSummary(
            LocalDate date,
            Long departmentId,
            String search
    );

    DailyConsumableUsageResponseDTO getUsageById(
            Long id
    );

    DailyConsumableUsageResponseDTO updateUsage(
            Long id,
            DailyConsumableRequestDTO requestDTO
    );

    void deleteUsage(Long id);

    /*
     * =========================================================
     * DAILY CONSUMABLE USAGE PHOTO
     * =========================================================
     */

    String uploadUsagePhoto(
            Long id,
            MultipartFile photo
    );

    String getUsagePhotoPath(
            Long id
    );

    void deleteUsagePhoto(
            Long id
    );
}