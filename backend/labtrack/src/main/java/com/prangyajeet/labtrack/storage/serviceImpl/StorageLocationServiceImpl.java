package com.prangyajeet.labtrack.storage.serviceImpl;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.exception.custom.DuplicateResourceException;
import com.prangyajeet.labtrack.exception.custom.ResourceNotFoundException;
import com.prangyajeet.labtrack.storage.dto.StorageLocationRequestDTO;
import com.prangyajeet.labtrack.storage.dto.StorageLocationResponseDTO;
import com.prangyajeet.labtrack.storage.entity.StorageLocation;
import com.prangyajeet.labtrack.storage.repository.StorageLocationRepository;
import com.prangyajeet.labtrack.storage.service.StorageLocationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StorageLocationServiceImpl implements StorageLocationService {

    private final StorageLocationRepository storageLocationRepository;

    public StorageLocationServiceImpl(StorageLocationRepository storageLocationRepository) {
        this.storageLocationRepository = storageLocationRepository;
    }

    @Override
    public StorageLocationResponseDTO createStorageLocation(StorageLocationRequestDTO requestDTO) {

        if (storageLocationRepository.existsByLocationCodeAndStatus(
                requestDTO.getLocationCode(), Status.ACTIVE)) {

            throw new DuplicateResourceException("Location code already exists.");
        }

        if (storageLocationRepository.existsByLocationNameAndStatus(
                requestDTO.getLocationName(), Status.ACTIVE)) {

            throw new DuplicateResourceException("Location name already exists.");
        }

        StorageLocation location = new StorageLocation();

        location.setLocationCode(requestDTO.getLocationCode());
        location.setLocationName(requestDTO.getLocationName());
        location.setDescription(requestDTO.getDescription());
        location.setStatus(Status.ACTIVE);

        StorageLocation savedLocation = storageLocationRepository.save(location);

        return mapToResponseDTO(savedLocation);
    }

    @Override
    public StorageLocationResponseDTO getStorageLocationById(Long locationId) {

        StorageLocation location = storageLocationRepository
                .findByIdAndStatus(locationId, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Storage location not found."));

        return mapToResponseDTO(location);
    }

    @Override
    public List<StorageLocationResponseDTO> getAllStorageLocations() {

        return storageLocationRepository.findAllByStatus(Status.ACTIVE)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StorageLocationResponseDTO updateStorageLocation(
            Long locationId,
            StorageLocationRequestDTO requestDTO) {

        StorageLocation location = storageLocationRepository
                .findByIdAndStatus(locationId, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Storage location not found."));

        if (!location.getLocationCode().equals(requestDTO.getLocationCode())
                && storageLocationRepository.existsByLocationCodeAndStatus(
                requestDTO.getLocationCode(), Status.ACTIVE)) {

            throw new DuplicateResourceException("Location code already exists.");
        }

        if (!location.getLocationName().equals(requestDTO.getLocationName())
                && storageLocationRepository.existsByLocationNameAndStatus(
                requestDTO.getLocationName(), Status.ACTIVE)) {

            throw new DuplicateResourceException("Location name already exists.");
        }

        location.setLocationCode(requestDTO.getLocationCode());
        location.setLocationName(requestDTO.getLocationName());
        location.setDescription(requestDTO.getDescription());

        StorageLocation updatedLocation = storageLocationRepository.save(location);

        return mapToResponseDTO(updatedLocation);
    }

    @Override
    public void deleteStorageLocation(Long locationId) {

        StorageLocation location = storageLocationRepository
                .findByIdAndStatus(locationId, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Storage location not found."));

        location.setStatus(Status.INACTIVE);

        storageLocationRepository.save(location);
    }

    private StorageLocationResponseDTO mapToResponseDTO(StorageLocation location) {

        StorageLocationResponseDTO responseDTO = new StorageLocationResponseDTO();

        responseDTO.setId(location.getId());
        responseDTO.setLocationCode(location.getLocationCode());
        responseDTO.setLocationName(location.getLocationName());
        responseDTO.setDescription(location.getDescription());
        responseDTO.setStatus(location.getStatus().name());

        return responseDTO;
    }
}