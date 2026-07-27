package com.prangyajeet.labtrack.storage.controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.storage.dto.StorageLocationRequestDTO;
import com.prangyajeet.labtrack.storage.dto.StorageLocationResponseDTO;
import com.prangyajeet.labtrack.storage.service.StorageLocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage-locations")
public class StorageLocationController {

    private final StorageLocationService storageLocationService;

    public StorageLocationController(StorageLocationService storageLocationService) {
        this.storageLocationService = storageLocationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StorageLocationResponseDTO>> createStorageLocation(
            @Valid @RequestBody StorageLocationRequestDTO requestDTO) {

        StorageLocationResponseDTO responseDTO =
                storageLocationService.createStorageLocation(requestDTO);

        ApiResponse<StorageLocationResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Storage location created successfully.",
                        responseDTO
                );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<ApiResponse<StorageLocationResponseDTO>> getStorageLocationById(
            @PathVariable Long locationId) {

        StorageLocationResponseDTO responseDTO =
                storageLocationService.getStorageLocationById(locationId);

        ApiResponse<StorageLocationResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Storage location fetched successfully.",
                        responseDTO
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StorageLocationResponseDTO>>> getAllStorageLocations() {

        List<StorageLocationResponseDTO> responseDTOList =
                storageLocationService.getAllStorageLocations();

        ApiResponse<List<StorageLocationResponseDTO>> response =
                new ApiResponse<>(
                        true,
                        "Storage locations fetched successfully.",
                        responseDTOList
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{locationId}")
    public ResponseEntity<ApiResponse<StorageLocationResponseDTO>> updateStorageLocation(
            @PathVariable Long locationId,
            @Valid @RequestBody StorageLocationRequestDTO requestDTO) {

        StorageLocationResponseDTO responseDTO =
                storageLocationService.updateStorageLocation(locationId, requestDTO);

        ApiResponse<StorageLocationResponseDTO> response =
                new ApiResponse<>(
                        true,
                        "Storage location updated successfully.",
                        responseDTO
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{locationId}")
    public ResponseEntity<ApiResponse<String>> deleteStorageLocation(
            @PathVariable Long locationId) {

        storageLocationService.deleteStorageLocation(locationId);

        ApiResponse<String> response =
                new ApiResponse<>(
                        true,
                        "Storage location deleted successfully.",
                        null
                );

        return ResponseEntity.ok(response);
    }
}