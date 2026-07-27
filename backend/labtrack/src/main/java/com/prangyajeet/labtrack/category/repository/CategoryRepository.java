package com.prangyajeet.labtrack.category.repository;

import com.prangyajeet.labtrack.category.entity.Category;
import com.prangyajeet.labtrack.common.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByIdAndStatus(Long id, Status status);

    List<Category> findAllByStatus(Status status);

    Optional<Category> findByDepartmentIdAndCategoryNameAndStatus(
            Long departmentId,
            String categoryName,
            Status status);

    boolean existsByDepartmentIdAndCategoryNameAndStatus(
            Long departmentId,
            String categoryName,
            Status status);
}