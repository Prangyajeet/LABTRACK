package com.prangyajeet.labtrack.department.repository;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.department.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByIdAndStatus(Long id, Status status);

    List<Department> findAllByStatus(Status status);

    Optional<Department> findByDepartmentNameAndStatus(
            String departmentName,
            Status status);

    boolean existsByDepartmentNameAndStatus(
            String departmentName,
            Status status);
}