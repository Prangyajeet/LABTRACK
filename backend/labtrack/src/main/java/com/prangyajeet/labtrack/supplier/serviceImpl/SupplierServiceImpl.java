package com.prangyajeet.labtrack.supplier.serviceImpl;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.exception.custom.DuplicateResourceException;
import com.prangyajeet.labtrack.exception.custom.ResourceNotFoundException;
import com.prangyajeet.labtrack.supplier.dto.SupplierRequestDTO;
import com.prangyajeet.labtrack.supplier.dto.SupplierResponseDTO;
import com.prangyajeet.labtrack.supplier.entity.Supplier;
import com.prangyajeet.labtrack.supplier.repository.SupplierRepository;
import com.prangyajeet.labtrack.supplier.service.SupplierService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public SupplierResponseDTO createSupplier(SupplierRequestDTO requestDTO) {

        if (supplierRepository.existsBySupplierNameAndStatus(
                requestDTO.getSupplierName(), Status.ACTIVE)) {
            throw new DuplicateResourceException("Supplier name already exists.");
        }

        if (supplierRepository.existsByEmailAndStatus(
                requestDTO.getEmail(), Status.ACTIVE)) {
            throw new DuplicateResourceException("Email already exists.");
        }

        if (supplierRepository.existsByPhoneNumberAndStatus(
                requestDTO.getPhoneNumber(), Status.ACTIVE)) {
            throw new DuplicateResourceException("Phone number already exists.");
        }

        if (supplierRepository.existsByGstNumberAndStatus(
                requestDTO.getGstNumber(), Status.ACTIVE)) {
            throw new DuplicateResourceException("GST number already exists.");
        }

        Supplier supplier = new Supplier();

        supplier.setSupplierName(requestDTO.getSupplierName());
        supplier.setContactPerson(requestDTO.getContactPerson());
        supplier.setEmail(requestDTO.getEmail());
        supplier.setPhoneNumber(requestDTO.getPhoneNumber());
        supplier.setAddress(requestDTO.getAddress());
        supplier.setGstNumber(requestDTO.getGstNumber());
        supplier.setStatus(Status.ACTIVE);

        Supplier savedSupplier = supplierRepository.save(supplier);

        return mapToResponseDTO(savedSupplier);
    }

    @Override
    public SupplierResponseDTO getSupplierById(Long supplierId) {

        Supplier supplier = supplierRepository
                .findByIdAndStatus(supplierId, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Supplier not found."));

        return mapToResponseDTO(supplier);
    }

    @Override
    public List<SupplierResponseDTO> getAllSuppliers() {

        return supplierRepository.findAllByStatus(Status.ACTIVE)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierResponseDTO updateSupplier(Long supplierId,
                                              SupplierRequestDTO requestDTO) {

        Supplier supplier = supplierRepository
                .findByIdAndStatus(supplierId, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Supplier not found."));

        if (!supplier.getSupplierName().equals(requestDTO.getSupplierName())
                && supplierRepository.existsBySupplierNameAndStatus(
                requestDTO.getSupplierName(), Status.ACTIVE)) {

            throw new DuplicateResourceException("Supplier name already exists.");
        }

        if (!supplier.getEmail().equals(requestDTO.getEmail())
                && supplierRepository.existsByEmailAndStatus(
                requestDTO.getEmail(), Status.ACTIVE)) {

            throw new DuplicateResourceException("Email already exists.");
        }

        if (!supplier.getPhoneNumber().equals(requestDTO.getPhoneNumber())
                && supplierRepository.existsByPhoneNumberAndStatus(
                requestDTO.getPhoneNumber(), Status.ACTIVE)) {

            throw new DuplicateResourceException("Phone number already exists.");
        }

        if (!supplier.getGstNumber().equals(requestDTO.getGstNumber())
                && supplierRepository.existsByGstNumberAndStatus(
                requestDTO.getGstNumber(), Status.ACTIVE)) {

            throw new DuplicateResourceException("GST number already exists.");
        }

        supplier.setSupplierName(requestDTO.getSupplierName());
        supplier.setContactPerson(requestDTO.getContactPerson());
        supplier.setEmail(requestDTO.getEmail());
        supplier.setPhoneNumber(requestDTO.getPhoneNumber());
        supplier.setAddress(requestDTO.getAddress());
        supplier.setGstNumber(requestDTO.getGstNumber());

        Supplier updatedSupplier = supplierRepository.save(supplier);

        return mapToResponseDTO(updatedSupplier);
    }

    @Override
    public void deleteSupplier(Long supplierId) {

        Supplier supplier = supplierRepository
                .findByIdAndStatus(supplierId, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Supplier not found."));

        supplier.setStatus(Status.INACTIVE);

        supplierRepository.save(supplier);
    }

    private SupplierResponseDTO mapToResponseDTO(Supplier supplier) {

        SupplierResponseDTO responseDTO = new SupplierResponseDTO();

        responseDTO.setId(supplier.getId());
        responseDTO.setSupplierName(supplier.getSupplierName());
        responseDTO.setContactPerson(supplier.getContactPerson());
        responseDTO.setEmail(supplier.getEmail());
        responseDTO.setPhoneNumber(supplier.getPhoneNumber());
        responseDTO.setAddress(supplier.getAddress());
        responseDTO.setGstNumber(supplier.getGstNumber());
        responseDTO.setStatus(supplier.getStatus().name());

        return responseDTO;
    }
}