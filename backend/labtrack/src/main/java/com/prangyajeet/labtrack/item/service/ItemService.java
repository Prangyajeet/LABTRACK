package com.prangyajeet.labtrack.item.service;

import com.prangyajeet.labtrack.common.response.PageResponse;
import com.prangyajeet.labtrack.item.dto.ItemRequestDTO;
import com.prangyajeet.labtrack.item.dto.ItemResponseDTO;

public interface ItemService {

    PageResponse<ItemResponseDTO> getAllItems(

            int page,

            int size,

            String sortBy,

            String sortDirection,

            String search

    );

    ItemResponseDTO getItemById(
            Long id
    );

    ItemResponseDTO createItem(
            ItemRequestDTO requestDTO
    );

    ItemResponseDTO updateItem(

            Long id,

            ItemRequestDTO requestDTO

    );

    ItemResponseDTO restoreItem(
            Long id
    );

    byte[] exportItems();

    void deleteItem(
            Long id
    );

}