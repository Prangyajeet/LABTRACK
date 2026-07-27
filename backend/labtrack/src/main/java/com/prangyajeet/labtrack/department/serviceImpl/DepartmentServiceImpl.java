package com.prangyajeet.labtrack.department.serviceImpl;

import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.department.dto.DepartmentRequestDTO;
import com.prangyajeet.labtrack.department.dto.DepartmentResponseDTO;
import com.prangyajeet.labtrack.department.entity.Department;
import com.prangyajeet.labtrack.department.repository.DepartmentRepository;
import com.prangyajeet.labtrack.department.service.DepartmentService;
import com.prangyajeet.labtrack.exception.custom.DuplicateResourceException;
import com.prangyajeet.labtrack.exception.custom.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public List<DepartmentResponseDTO> getAllDepartments() {

        return departmentRepository.findAllByStatus(Status.ACTIVE)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponseDTO getDepartmentById(Long id) {

        Department department = departmentRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with ID: " + id));

        return mapToResponseDTO(department);
    }

    @Override
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO dto) {

        if (departmentRepository.existsByDepartmentNameAndStatus(
                dto.getDepartmentName(),
                Status.ACTIVE)) {

            throw new DuplicateResourceException(
                    "Department '" + dto.getDepartmentName() + "' already exists.");
        }

        Department department = new Department();

        department.setDepartmentName(dto.getDepartmentName());
        department.setDescription(dto.getDescription());
        department.setStatus(Status.ACTIVE);

        Department savedDepartment = departmentRepository.save(department);

        return mapToResponseDTO(savedDepartment);
    }

    @Override
    public DepartmentResponseDTO updateDepartment(Long id,
                                                  DepartmentRequestDTO dto) {

        Department department = departmentRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with ID: " + id));

        if (!department.getDepartmentName().equalsIgnoreCase(dto.getDepartmentName())
                && departmentRepository.existsByDepartmentNameAndStatus(
                dto.getDepartmentName(),
                Status.ACTIVE)) {

            throw new DuplicateResourceException(
                    "Department '" + dto.getDepartmentName() + "' already exists.");
        }

        department.setDepartmentName(dto.getDepartmentName());
        department.setDescription(dto.getDescription());

        Department updatedDepartment = departmentRepository.save(department);

        return mapToResponseDTO(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Long id) {

        Department department = departmentRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with ID: " + id));

        department.setStatus(Status.INACTIVE);

        departmentRepository.save(department);
    }

    private DepartmentResponseDTO mapToResponseDTO(Department department) {

        return new DepartmentResponseDTO(
                department.getId(),
                department.getDepartmentName(),
                department.getDescription(),
                department.getCreatedAt()
        );
    }
}