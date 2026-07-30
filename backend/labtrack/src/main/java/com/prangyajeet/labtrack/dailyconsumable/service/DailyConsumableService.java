package com.prangyajeet.labtrack.dailyconsumable.service;

import com.prangyajeet.labtrack.dailyconsumable.dto.DailyConsumableResponseDTO;

import java.util.List;

public interface DailyConsumableService {

    List<DailyConsumableResponseDTO> getAllConsumables();

    DailyConsumableResponseDTO getConsumableById(Long id);

    List<DailyConsumableResponseDTO> getLowStockConsumables();
}