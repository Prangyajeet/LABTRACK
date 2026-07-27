package com.prangyajeet.labtrack.storage.repository;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.storage.entity.StorageLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StorageLocationRepository extends JpaRepository<StorageLocation, Long> {

    Optional<StorageLocation> findByIdAndStatus(Long id, Status status);

    List<StorageLocation> findAllByStatus(Status status);

    boolean existsByLocationCodeAndStatus(String locationCode, Status status);

    boolean existsByLocationNameAndStatus(String locationName, Status status);

    Optional<StorageLocation> findByLocationCodeAndStatus(String locationCode, Status status);

    Optional<StorageLocation> findByLocationNameAndStatus(String locationName, Status status);
}