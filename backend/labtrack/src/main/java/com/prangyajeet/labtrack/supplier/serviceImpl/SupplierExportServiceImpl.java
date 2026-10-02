package com.prangyajeet.labtrack.supplier.serviceImpl;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.supplier.entity.Supplier;
import com.prangyajeet.labtrack.supplier.export.SupplierExcelExporter;
import com.prangyajeet.labtrack.supplier.repository.SupplierRepository;
import com.prangyajeet.labtrack.supplier.service.SupplierExportService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierExportServiceImpl implements SupplierExportService {

    private final SupplierRepository supplierRepository;

    public SupplierExportServiceImpl(
            SupplierRepository supplierRepository) {

        this.supplierRepository = supplierRepository;
    }

    @Override
    public byte[] exportSuppliers() {

        List<Supplier> suppliers =
                supplierRepository.findAll()
                        .stream()
                        .filter(supplier ->
                                supplier.getStatus() == Status.ACTIVE)
                        .toList();

        return SupplierExcelExporter.export(suppliers);
    }
}