package com.prangyajeet.labtrack.security;

import com.prangyajeet.labtrack.auth.entity.User;
import com.prangyajeet.labtrack.auth.repository.UserRepository;
import com.prangyajeet.labtrack.common.enums.Status;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository
                .findByEmailAndStatus(email, Status.ACTIVE)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email));

        return new CustomUserDetails(user);
    }
}