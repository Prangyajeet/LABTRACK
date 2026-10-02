package com.prangyajeet.labtrack.breakage.repository;

import com.prangyajeet.labtrack.breakage.entity.BreakageEvidence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BreakageEvidenceRepository
        extends JpaRepository<BreakageEvidence, Long> {

    List<BreakageEvidence>
    findAllByBreakageIdOrderByUploadedAtDesc(
            Long breakageId
    );

    Optional<BreakageEvidence>
    findByIdAndBreakageId(
            Long id,
            Long breakageId
    );
}