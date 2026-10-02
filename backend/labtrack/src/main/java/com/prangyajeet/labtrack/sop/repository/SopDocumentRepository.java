package com.prangyajeet.labtrack.sop.repository;

import com.prangyajeet.labtrack.sop.entity.SopDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SopDocumentRepository
        extends JpaRepository<SopDocument, Long> {

    List<SopDocument> findByDepartmentIdOrderByUploadedAtDesc(
            Long departmentId
    );
}