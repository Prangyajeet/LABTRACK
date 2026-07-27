package com.prangyajeet.labtrack.category.controller;

import com.prangyajeet.labtrack.category.dto.CategoryRequestDTO;
import com.prangyajeet.labtrack.category.dto.CategoryResponseDTO;
import com.prangyajeet.labtrack.category.service.CategoryService;
import com.prangyajeet.labtrack.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> createCategory(
            @Valid @RequestBody CategoryRequestDTO requestDTO) {

        return new ResponseEntity<>(
                new ApiResponse<>(true,
                        "Category created successfully.",
                        categoryService.createCategory(requestDTO)),
                HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> getCategoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Category fetched successfully.",
                        categoryService.getCategoryById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>> getAllCategories() {

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Categories fetched successfully.",
                        categoryService.getAllCategories()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDTO requestDTO) {

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Category updated successfully.",
                        categoryService.updateCategory(id, requestDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(
            @PathVariable Long id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true,
                        "Category deleted successfully.",
                        null));
    }
}