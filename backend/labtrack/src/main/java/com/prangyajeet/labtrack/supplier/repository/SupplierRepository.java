package com.prangyajeet.labtrack.supplier.repository;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.supplier.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Optional<Supplier> findByIdAndStatus(Long id, Status status);

    List<Supplier> findAllByStatus(Status status);

    boolean existsBySupplierNameAndStatus(String supplierName, Status status);

    boolean existsByEmailAndStatus(String email, Status status);

    boolean existsByPhoneNumberAndStatus(String phoneNumber, Status status);

    boolean existsByGstNumberAndStatus(String gstNumber, Status status);

    Optional<Supplier> findBySupplierNameAndStatus(String supplierName, Status status);

    Optional<Supplier> findByEmailAndStatus(String email, Status status);

    Optional<Supplier> findByPhoneNumberAndStatus(String phoneNumber, Status status);

    Optional<Supplier> findByGstNumberAndStatus(String gstNumber, Status status);
}