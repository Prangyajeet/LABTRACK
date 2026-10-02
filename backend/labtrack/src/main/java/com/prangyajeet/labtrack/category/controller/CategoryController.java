package com.prangyajeet.labtrack.category.controller;

import com.prangyajeet.labtrack.category.dto.CategoryRequestDTO;
import com.prangyajeet.labtrack.category.dto.CategoryResponseDTO;
import com.prangyajeet.labtrack.category.export.CategoryExcelExporter;
import com.prangyajeet.labtrack.category.service.CategoryService;
import com.prangyajeet.labtrack.common.response.ApiResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    private final CategoryExcelExporter categoryExcelExporter;

    public CategoryController(
            CategoryService categoryService,
            CategoryExcelExporter categoryExcelExporter) {

        this.categoryService = categoryService;
        this.categoryExcelExporter = categoryExcelExporter;
    }

    /*
     * ============================================================
     * GET ALL CATEGORIES
     * ============================================================
     */

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<CategoryResponseDTO>>>
    getAllCategories() {

        List<CategoryResponseDTO> categories =
                categoryService.getAllCategories();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Categories fetched successfully.",
                        categories
                )
        );
    }

    /*
     * ============================================================
     * GET CATEGORY BY ID
     * ============================================================
     */

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>>
    getCategoryById(
            @PathVariable Long id) {

        CategoryResponseDTO category =
                categoryService.getCategoryById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category fetched successfully.",
                        category
                )
        );
    }

    /*
     * ============================================================
     * CREATE CATEGORY
     * ============================================================
     */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>>
    createCategory(
            @RequestBody CategoryRequestDTO requestDTO) {

        CategoryResponseDTO category =
                categoryService.createCategory(
                        requestDTO
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category created successfully.",
                        category
                )
        );
    }

    /*
     * ============================================================
     * UPDATE CATEGORY
     * ============================================================
     */

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseDTO>>
    updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequestDTO requestDTO) {

        CategoryResponseDTO category =
                categoryService.updateCategory(
                        id,
                        requestDTO
                );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category updated successfully.",
                        category
                )
        );
    }

    /*
     * ============================================================
     * SOFT DELETE CATEGORY
     * ============================================================
     */

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>>
    deleteCategory(
            @PathVariable Long id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category deleted successfully.",
                        null
                )
        );
    }

    /*
     * ============================================================
     * RESTORE CATEGORY
     * ============================================================
     */

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>>
    restoreCategory(
            @PathVariable Long id) {

        categoryService.restoreCategory(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Category restored successfully.",
                        null
                )
        );
    }

    /*
     * ============================================================
     * EXPORT CATEGORIES TO EXCEL
     * ============================================================
     */

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<byte[]> exportCategories() {

        List<CategoryResponseDTO> categories =
                categoryService.getAllCategories();

        byte[] file =
                categoryExcelExporter.export(categories);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Categories.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(file);
    }
}