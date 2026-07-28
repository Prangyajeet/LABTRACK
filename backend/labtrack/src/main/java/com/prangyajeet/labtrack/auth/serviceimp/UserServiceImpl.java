package com.prangyajeet.labtrack.auth.serviceimp;

import com.prangyajeet.labtrack.auth.dto.UserRequestDTO;
import com.prangyajeet.labtrack.auth.dto.UserResponseDTO;
import com.prangyajeet.labtrack.auth.entity.User;
import com.prangyajeet.labtrack.auth.repository.UserRepository;
import com.prangyajeet.labtrack.auth.service.UserService;
import com.prangyajeet.labtrack.common.enums.Status;
import com.prangyajeet.labtrack.department.entity.Department;
import com.prangyajeet.labtrack.department.repository.DepartmentRepository;
import com.prangyajeet.labtrack.exception.custom.DuplicateResourceException;
import com.prangyajeet.labtrack.exception.custom.ResourceNotFoundException;
import com.prangyajeet.labtrack.role.entity.Role;
import com.prangyajeet.labtrack.role.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           DepartmentRepository departmentRepository,
                           PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }    @Override
    public UserResponseDTO createUser(UserRequestDTO dto) {

        if (userRepository.existsByEmailAndStatus(dto.getEmail(), Status.ACTIVE)) {
            throw new DuplicateResourceException("Email already exists.");
        }

        if (userRepository.existsByPhoneNumberAndStatus(dto.getPhoneNumber(), Status.ACTIVE)) {
            throw new DuplicateResourceException("Phone number already exists.");
        }

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found with ID : " + dto.getRoleId()));

        Department department = departmentRepository
                .findByIdAndStatus(dto.getDepartmentId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with ID : " + dto.getDepartmentId()));

        User user = new User();

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhoneNumber(dto.getPhoneNumber());

        user.setRole(role);
        user.setDepartment(department);

        User savedUser = userRepository.save(user);

        return mapToResponseDTO(savedUser);
    }    @Override
    public UserResponseDTO getUserById(Long id) {

        User user = userRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with ID : " + id));

        return mapToResponseDTO(user);
    }    @Override
    public List<UserResponseDTO> getAllUsers() {

        return userRepository
                .findAllByStatus(Status.ACTIVE)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {

        User user = userRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with ID : " + id));

        if (!user.getEmail().equalsIgnoreCase(dto.getEmail())
                && userRepository.existsByEmailAndStatus(dto.getEmail(), Status.ACTIVE)) {

            throw new DuplicateResourceException("Email already exists.");
        }

        if (!user.getPhoneNumber().equals(dto.getPhoneNumber())
                && userRepository.existsByPhoneNumberAndStatus(dto.getPhoneNumber(), Status.ACTIVE)) {

            throw new DuplicateResourceException("Phone number already exists.");
        }

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Role not found with ID : " + dto.getRoleId()));

        Department department = departmentRepository
                .findByIdAndStatus(dto.getDepartmentId(), Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Department not found with ID : " + dto.getDepartmentId()));

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        user.setRole(role);
        user.setDepartment(department);

        User updatedUser = userRepository.save(user);

        return mapToResponseDTO(updatedUser);
    }    @Override
    public void deleteUser(Long id) {

        User user = userRepository
                .findByIdAndStatus(id, Status.ACTIVE)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with ID : " + id));

        user.setStatus(Status.INACTIVE);

        userRepository.save(user);
    }    private UserResponseDTO mapToResponseDTO(User user) {

        UserResponseDTO responseDTO = new UserResponseDTO();

        responseDTO.setId(user.getId());
        responseDTO.setFullName(user.getFullName());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setPhoneNumber(user.getPhoneNumber());

        responseDTO.setRoleName(user.getRole().getRoleName());
        responseDTO.setDepartmentName(user.getDepartment().getDepartmentName());

        responseDTO.setEnabled(user.isEnabled());
        responseDTO.setAccountNonLocked(user.isAccountNonLocked());
        responseDTO.setLastLoginAt(user.getLastLoginAt());

        responseDTO.setStatus(user.getStatus().name());

        return responseDTO;
    }
}