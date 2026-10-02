package com.prangyajeet.labtrack.breakage.service;

import com.prangyajeet.labtrack.breakage.entity.BreakageEvidence;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BreakageEvidenceService {

    BreakageEvidence uploadEvidence(
            Long breakageId,
            MultipartFile file
    );

    List<BreakageEvidence> getEvidence(
            Long breakageId
    );

    BreakageEvidence getEvidenceById(
            Long breakageId,
            Long evidenceId
    );
}