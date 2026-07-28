package com.prangyajeet.labtrack.auth.controller;

import com.prangyajeet.labtrack.auth.dto.LoginRequestDTO;
import com.prangyajeet.labtrack.auth.dto.LoginResponseDTO;
import com.prangyajeet.labtrack.auth.dto.UserRequestDTO;
import com.prangyajeet.labtrack.auth.dto.UserResponseDTO;
import com.prangyajeet.labtrack.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(
            @Valid @RequestBody UserRequestDTO requestDTO) {

        UserResponseDTO response = authService.register(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO requestDTO) {

        LoginResponseDTO response = authService.login(requestDTO);

        return ResponseEntity.ok(response);
    }
}