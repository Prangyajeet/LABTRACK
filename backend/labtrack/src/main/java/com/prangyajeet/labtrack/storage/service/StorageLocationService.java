package com.prangyajeet.labtrack.storage.service;

import com.prangyajeet.labtrack.storage.dto.StorageLocationRequestDTO;
import com.prangyajeet.labtrack.storage.dto.StorageLocationResponseDTO;

import java.util.List;

public interface StorageLocationService {

    StorageLocationResponseDTO createStorageLocation(StorageLocationRequestDTO requestDTO);

    StorageLocationResponseDTO getStorageLocationById(Long locationId);

    List<StorageLocationResponseDTO> getAllStorageLocations();

    StorageLocationResponseDTO updateStorageLocation(
            Long locationId,
            StorageLocationRequestDTO requestDTO
    );

    void deleteStorageLocation(Long locationId);
}