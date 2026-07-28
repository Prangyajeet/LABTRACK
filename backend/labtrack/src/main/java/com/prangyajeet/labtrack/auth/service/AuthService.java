package com.prangyajeet.labtrack.auth.service;

import com.prangyajeet.labtrack.auth.dto.LoginRequestDTO;
import com.prangyajeet.labtrack.auth.dto.LoginResponseDTO;
import com.prangyajeet.labtrack.auth.dto.UserRequestDTO;
import com.prangyajeet.labtrack.auth.dto.UserResponseDTO;

public interface AuthService {

    UserResponseDTO register(UserRequestDTO requestDTO);

    LoginResponseDTO login(LoginRequestDTO requestDTO);

}