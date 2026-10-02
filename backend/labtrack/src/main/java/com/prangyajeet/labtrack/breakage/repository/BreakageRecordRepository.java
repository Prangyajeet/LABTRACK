package com.prangyajeet.labtrack.breakage.repository;

import com.prangyajeet.labtrack.breakage.entity.BreakageRecord;
import com.prangyajeet.labtrack.common.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BreakageRecordRepository
        extends JpaRepository<BreakageRecord, Long> {

    Optional<BreakageRecord> findByIdAndStatus(
            Long id,
            Status status
    );

    List<BreakageRecord> findAllByStatus(
            Status status
    );
}