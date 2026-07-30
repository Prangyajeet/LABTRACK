package com.prangyajeet.labtrack.dailyconsumable.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableResponseDTO;
import com.prangyajeet.labtrack.dailyconsumable.service.DailyConsumableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-consumables")
public class DailyConsumableController {

    private final DailyConsumableService dailyConsumableService;

    public DailyConsumableController(DailyConsumableService dailyConsumableService) {
        this.dailyConsumableService = dailyConsumableService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DailyConsumableResponseDTO>>> getAllConsumables() {

        List<DailyConsumableResponseDTO> consumables =
                dailyConsumableService.getAllConsumables();

        ApiResponse<List<DailyConsumableResponseDTO>> response =
                new ApiResponse<>(
                        true,
                        "Daily consumables fetched successfully",
                        consumables
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DailyConsumableResponseDTO>> getConsumableById(
            @PathVariable Long id) {

        DailyConsumableResponseDTO consumable =
                dailyConsumableService.getConsumableById(id);

        ApiResponse<DailyConsumableResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Daily consumable fetched successfully",
                        consumable
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<DailyConsumableResponseDTO>>> getLowStockConsumables() {

        List<DailyConsumableResponseDTO> consumables =
                dailyConsumableService.getLowStockConsumables();

        ApiResponse<List<DailyConsumableResponseDTO>> response =
                new ApiResponse<>(
                        true,
                        "Low stock daily consumables fetched successfully",
                        consumables
                );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}