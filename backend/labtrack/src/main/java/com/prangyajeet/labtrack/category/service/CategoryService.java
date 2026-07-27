package com.prangyajeet.labtrack.category.service;

import com.prangyajeet.labtrack.category.dto.CategoryRequestDTO;
import com.prangyajeet.labtrack.category.dto.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {

    CategoryResponseDTO createCategory(CategoryRequestDTO requestDTO);

    CategoryResponseDTO getCategoryById(Long id);

    List<CategoryResponseDTO> getAllCategories();

    CategoryResponseDTO updateCategory(Long id,
                                       CategoryRequestDTO requestDTO);

    void deleteCategory(Long id);
}