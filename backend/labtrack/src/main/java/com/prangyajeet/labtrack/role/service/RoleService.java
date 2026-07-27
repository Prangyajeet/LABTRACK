package com.prangyajeet.labtrack.role.service;

import com.prangyajeet.labtrack.role.dto.RoleRequestDTO;
import com.prangyajeet.labtrack.role.dto.RoleResponseDTO;

import java.util.List;

public interface RoleService {

    List<RoleResponseDTO> getAllRoles();

    RoleResponseDTO getRoleById(Long id);

    RoleResponseDTO createRole(RoleRequestDTO roleRequestDTO);

    RoleResponseDTO updateRole(Long id, RoleRequestDTO roleRequestDTO);

    void deleteRole(Long id);

}