package com.prangyajeet.labtrack.category.serviceImpl;

import com.prangyajeet.labtrack.category.dto.CategoryRequestDTO;
import com.prangyajeet.labtrack.category.dto.CategoryResponseDTO;
import com.prangyajeet.labtrack.category.entity.Category;
import com.prangyajeet.labtrack.category.repository.CategoryRepository;
import com.prangyajeet.labtrack.category.service.CategoryService;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.department.entity.Department;
import com.prangyajeet.labtrack.department.repository.DepartmentRepository;
import com.prangyajeet.labtrack.exception.custom.DuplicateResourceException;
import com.prangyajeet.labtrack.exception.custom.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final DepartmentRepository departmentRepository;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository,
            DepartmentRepository departmentRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.departmentRepository = departmentRepository;
    }

    /*
     * ============================================================
     * CREATE CATEGORY
     * ============================================================
     */

    @Override
    public CategoryResponseDTO createCategory(
            CategoryRequestDTO requestDTO
    ) {

        Department department =
                departmentRepository
                        .findByIdAndStatus(
                                requestDTO.getDepartmentId(),
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found or inactive."
                                )
                        );

        boolean exists =
                categoryRepository
                        .existsByDepartmentIdAndCategoryNameAndStatus(
                                requestDTO.getDepartmentId(),
                                requestDTO.getCategoryName(),
                                Status.ACTIVE
                        );

        if (exists) {

            throw new DuplicateResourceException(
                    "Category already exists in this department."
            );
        }

        Category category = new Category();

        category.setDepartment(department);

        category.setCategoryName(
                requestDTO.getCategoryName()
        );

        category.setDescription(
                requestDTO.getDescription()
        );

        category.setStatus(
                Status.ACTIVE
        );

        Category savedCategory =
                categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    /*
     * ============================================================
     * GET CATEGORY BY ID
     * ============================================================
     */

    @Override
    public CategoryResponseDTO getCategoryById(
            Long id
    ) {

        Category category =
                categoryRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found."
                                )
                        );

        return mapToResponse(category);
    }

    /*
     * ============================================================
     * GET ALL ACTIVE CATEGORIES
     * ============================================================
     */

    @Override
    public List<CategoryResponseDTO> getAllCategories() {

        return categoryRepository
                .findAllByStatus(Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /*
     * ============================================================
     * UPDATE CATEGORY
     * ============================================================
     */

    @Override
    public CategoryResponseDTO updateCategory(
            Long id,
            CategoryRequestDTO requestDTO
    ) {

        Category category =
                categoryRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found."
                                )
                        );

        Department department =
                departmentRepository
                        .findByIdAndStatus(
                                requestDTO.getDepartmentId(),
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Department not found or inactive."
                                )
                        );

        boolean departmentChanged =
                !category.getDepartment()
                        .getId()
                        .equals(
                                requestDTO.getDepartmentId()
                        );

        boolean categoryNameChanged =
                !category.getCategoryName()
                        .equalsIgnoreCase(
                                requestDTO.getCategoryName()
                        );

        if (
                (departmentChanged || categoryNameChanged)
                        &&
                categoryRepository
                        .existsByDepartmentIdAndCategoryNameAndStatus(
                                requestDTO.getDepartmentId(),
                                requestDTO.getCategoryName(),
                                Status.ACTIVE
                        )
        ) {

            throw new DuplicateResourceException(
                    "Category already exists in this department."
            );
        }

        category.setDepartment(department);

        category.setCategoryName(
                requestDTO.getCategoryName()
        );

        category.setDescription(
                requestDTO.getDescription()
        );

        Category updatedCategory =
                categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    /*
     * ============================================================
     * SOFT DELETE CATEGORY
     * ============================================================
     */

    @Override
    public void deleteCategory(
            Long id
    ) {

        Category category =
                categoryRepository
                        .findByIdAndStatus(
                                id,
                                Status.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found."
                                )
                        );

        category.setStatus(
                Status.INACTIVE
        );

        categoryRepository.save(category);
    }

    /*
     * ============================================================
     * RESTORE CATEGORY
     * ============================================================
     */

    @Override
    public void restoreCategory(
            Long id
    ) {

        Category category =
                categoryRepository
                        .findByIdAndStatus(
                                id,
                                Status.INACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Inactive category not found with ID: "
                                                + id
                        )
                        );

        boolean activeDuplicate =
                categoryRepository
                        .existsByDepartmentIdAndCategoryNameAndStatus(
                                category.getDepartment().getId(),
                                category.getCategoryName(),
                                Status.ACTIVE
                        );

        if (activeDuplicate) {

            throw new DuplicateResourceException(
                    "An active category with the same name already exists in this department."
            );
        }

        category.setStatus(
                Status.ACTIVE
        );

        categoryRepository.save(category);
    }

    /*
     * ============================================================
     * ENTITY -> RESPONSE DTO
     * ============================================================
     */

    private CategoryResponseDTO mapToResponse(
            Category category
    ) {

        return new CategoryResponseDTO(

                category.getId(),

                category.getDepartment().getId(),

                category.getDepartment().getDepartmentName(),

                category.getCategoryName(),

                category.getDescription(),

                category.getStatus() != null
                        ? category.getStatus().name()
                        : null,

                category.getCreatedAt(),

                category.getUpdatedAt()
        );
    }
}