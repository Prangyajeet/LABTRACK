package com.prangyajeet.labtrack.breakage.service;

import com.prangyajeet.labtrack.breakage.dto.BreakageRequestDTO;
import com.prangyajeet.labtrack.breakage.dto.BreakageResponseDTO;
import com.prangyajeet.labtrack.breakage.dto.BreakageSummaryDTO;
import com.prangyajeet.labtrack.breakage.entity.BreakagePersonType;
import com.prangyajeet.labtrack.breakage.entity.BreakageRecoveryStatus;
import org.springframework.data.domain.Page;

public interface BreakageService {

    BreakageResponseDTO createBreakage(
            BreakageRequestDTO requestDTO
    );

    Page<BreakageResponseDTO> getBreakages(
            int page,
            int size,
            String search,
            BreakagePersonType personType,
            BreakageRecoveryStatus recoveryStatus,
            String sortBy,
            String sortDirection
    );

    BreakageResponseDTO getBreakageById(
            Long id
    );

    BreakageResponseDTO updateBreakage(
            Long id,
            BreakageRequestDTO requestDTO
    );

    BreakageResponseDTO updateRecoveryStatus(
            Long id,
            BreakageRecoveryStatus recoveryStatus
    );

    void deleteBreakage(
            Long id
    );

    BreakageSummaryDTO getSummary();
}