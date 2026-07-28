package com.prangyajeet.labtrack.auth.service;

import com.prangyajeet.labtrack.auth.dto.UserRequestDTO;
import com.prangyajeet.labtrack.auth.dto.UserResponseDTO;

import java.util.List;

public interface UserService {

    UserResponseDTO createUser(UserRequestDTO requestDTO);

    UserResponseDTO getUserById(Long id);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO updateUser(Long id, UserRequestDTO requestDTO);

    void deleteUser(Long id);

}