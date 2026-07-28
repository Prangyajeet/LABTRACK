package com.prangyajeet.labtrack.role.serviceImpl;

import com.prangyajeet.labtrack.exception.custom.DuplicateResourceException;
import com.prangyajeet.labtrack.exception.custom.ResourceNotFoundException;
import com.prangyajeet.labtrack.role.dto.RoleRequestDTO;
import com.prangyajeet.labtrack.role.dto.RoleResponseDTO;
import com.prangyajeet.labtrack.role.entity.Role;
import com.prangyajeet.labtrack.role.repository.RoleRepository;
import com.prangyajeet.labtrack.role.service.RoleService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<RoleResponseDTO> getAllRoles() {
        return roleRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponseDTO getRoleById(Long id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found with ID: " + id));

        return mapToResponseDTO(role);
    }

    @Override
public RoleResponseDTO createRole(RoleRequestDTO dto) {

    if (roleRepository.existsByRoleName(dto.getRoleName())) {
        throw new DuplicateResourceException("Role already exists.");
    }

    Role role = new Role();
    role.setRoleName(dto.getRoleName());
    role.setDescription(dto.getDescription());

    Role savedRole = roleRepository.save(role);

    return mapToResponseDTO(savedRole);
}

    @Override
    public RoleResponseDTO updateRole(Long id, RoleRequestDTO dto) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found with ID: " + id));

        role.setRoleName(dto.getRoleName());
        role.setDescription(dto.getDescription());

        Role updatedRole = roleRepository.save(role);

        return mapToResponseDTO(updatedRole);
    }

    @Override
    public void deleteRole(Long id) {

        Role role = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found with ID: " + id));

        roleRepository.delete(role);
    }

    private RoleResponseDTO mapToResponseDTO(Role role) {

        return new RoleResponseDTO(
                role.getId(),
                role.getRoleName(),
                role.getDescription(),
                role.getCreatedAt()
        );
    }
}