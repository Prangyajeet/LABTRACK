package com.prangyajeet.labtrack.supplier.service;

import com.prangyajeet.labtrack.supplier.dto.SupplierRequestDTO;
import com.prangyajeet.labtrack.supplier.dto.SupplierResponseDTO;

import java.util.List;

public interface SupplierService {

    SupplierResponseDTO createSupplier(SupplierRequestDTO supplierRequestDTO);

    SupplierResponseDTO getSupplierById(Long supplierId);

    List<SupplierResponseDTO> getAllSuppliers();

    SupplierResponseDTO updateSupplier(Long supplierId,
                                       SupplierRequestDTO supplierRequestDTO);

    void deleteSupplier(Long supplierId);
}