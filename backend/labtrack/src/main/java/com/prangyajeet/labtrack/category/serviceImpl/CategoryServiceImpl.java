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

    public CategoryServiceImpl(CategoryRepository categoryRepository,
                               DepartmentRepository departmentRepository) {
        this.categoryRepository = categoryRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public CategoryResponseDTO createCategory(CategoryRequestDTO requestDTO) {

        Department department = departmentRepository
                .findByIdAndStatus(requestDTO.getDepartmentId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found or inactive."));

        if (categoryRepository.existsByDepartmentIdAndCategoryNameAndStatus(
                requestDTO.getDepartmentId(),
                requestDTO.getCategoryName(),
                Status.ACTIVE)) {

            throw new DuplicateResourceException(
                    "Category already exists in this department.");
        }

        Category category = new Category();

        category.setDepartment(department);
        category.setCategoryName(requestDTO.getCategoryName());
        category.setDescription(requestDTO.getDescription());
        category.setStatus(Status.ACTIVE);

        Category saved = categoryRepository.save(category);

        return mapToResponse(saved);
    }

    @Override
    public CategoryResponseDTO getCategoryById(Long id) {

        Category category = categoryRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found."));

        return mapToResponse(category);
    }

    @Override
    public List<CategoryResponseDTO> getAllCategories() {

        return categoryRepository.findAllByStatus(Status.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponseDTO updateCategory(Long id,
                                              CategoryRequestDTO requestDTO) {

        Category category = categoryRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found."));

        Department department = departmentRepository
                .findByIdAndStatus(requestDTO.getDepartmentId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found or inactive."));

        if ((!category.getCategoryName().equalsIgnoreCase(requestDTO.getCategoryName())
                || !category.getDepartment().getId().equals(requestDTO.getDepartmentId()))
                && categoryRepository.existsByDepartmentIdAndCategoryNameAndStatus(
                requestDTO.getDepartmentId(),
                requestDTO.getCategoryName(),
                Status.ACTIVE)) {

            throw new DuplicateResourceException(
                    "Category already exists in this department.");
        }

        category.setDepartment(department);
        category.setCategoryName(requestDTO.getCategoryName());
        category.setDescription(requestDTO.getDescription());

        Category updated = categoryRepository.save(category);

        return mapToResponse(updated);
    }

    @Override
    public void deleteCategory(Long id) {

        Category category = categoryRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found."));

        category.setStatus(Status.INACTIVE);

        categoryRepository.save(category);
    }

    private CategoryResponseDTO mapToResponse(Category category) {

        return new CategoryResponseDTO(
                category.getId(),
                category.getDepartment().getId(),
                category.getDepartment().getDepartmentName(),
                category.getCategoryName(),
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}