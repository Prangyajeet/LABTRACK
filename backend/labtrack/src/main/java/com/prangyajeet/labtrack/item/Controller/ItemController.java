// ItemController.java

package com.prangyajeet.labtrack.item.Controller;

import com.prangyajeet.labtrack.common.response.ApiResponse;
import com.prangyajeet.labtrack.common.response.PageResponse;
import com.prangyajeet.labtrack.item.dto.ItemRequestDTO;
import com.prangyajeet.labtrack.item.dto.ItemResponseDTO;
import com.prangyajeet.labtrack.item.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(
            ItemService itemService) {

        this.itemService = itemService;

    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<byte[]> exportItems() {

        byte[] excelFile = itemService.exportItems();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Items.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelFile);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<PageResponse<ItemResponseDTO>>> getAllItems(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "itemName")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String sortDirection,

            @RequestParam(defaultValue = "")
            String search

    ) {

        PageResponse<ItemResponseDTO> response =
                itemService.getAllItems(
                        page,
                        size,
                        sortBy,
                        sortDirection,
                        search
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Items fetched successfully.",
                        response
                )
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'TECHNICIAN')")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> getItemById(

            @PathVariable Long id

    ) {

        ItemResponseDTO response =
                itemService.getItemById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Item fetched successfully.",
                        response
                )
        );
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> createItem(

            @Valid
            @RequestBody
            ItemRequestDTO requestDTO

    ) {

        ItemResponseDTO response =
                itemService.createItem(requestDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Item created successfully.",
                                response
                        )
                );
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> updateItem(

            @PathVariable("id")
            Long id,

            @Valid
            @RequestBody
            ItemRequestDTO requestDTO

    ) {

        ItemResponseDTO response =
                itemService.updateItem(
                        id,
                        requestDTO
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Item updated successfully.",
                        response
                )
        );
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ItemResponseDTO>> restoreItem(

            @PathVariable("id")
            Long id

    ) {

        ItemResponseDTO response =
                itemService.restoreItem(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Item restored successfully.",
                        response
                )
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteItem(

            @PathVariable("id")
            Long id

    ) {

        itemService.deleteItem(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Item deleted successfully."
                )
        );
    }
}