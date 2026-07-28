package com.prangyajeet.labtrack.auth.serviceimp;

import com.prangyajeet.labtrack.auth.dto.LoginRequestDTO;
import com.prangyajeet.labtrack.auth.dto.LoginResponseDTO;
import com.prangyajeet.labtrack.auth.dto.UserRequestDTO;
import com.prangyajeet.labtrack.auth.dto.UserResponseDTO;
import com.prangyajeet.labtrack.auth.entity.User;
import com.prangyajeet.labtrack.auth.repository.UserRepository;
import com.prangyajeet.labtrack.auth.service.AuthService;
import com.prangyajeet.labtrack.auth.service.UserService;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.exception.custom.ResourceNotFoundException;
import com.prangyajeet.labtrack.security.CustomUserDetails;
import com.prangyajeet.labtrack.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserService userService,
                           UserRepository userRepository,
                           AuthenticationManager authenticationManager,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {

        this.userService = userService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public UserResponseDTO register(UserRequestDTO requestDTO) {

        return userService.createUser(requestDTO);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO requestDTO) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDTO.getEmail(),
                        requestDTO.getPassword()
                )
        );

        User user = userRepository
                .findByEmailAndStatus(requestDTO.getEmail(), Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email : " + requestDTO.getEmail()));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtService.generateToken(new CustomUserDetails(user));

        LoginResponseDTO response = new LoginResponseDTO();

        response.setToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getRoleName());
        response.setDepartment(user.getDepartment().getDepartmentName());

        return response;
    }
}