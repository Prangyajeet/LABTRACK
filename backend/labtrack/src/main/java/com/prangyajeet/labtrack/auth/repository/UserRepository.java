package com.prangyajeet.labtrack.auth.repository;

import com.prangyajeet.labtrack.auth.entity.User;
import com.prangyajeet.labtrack.common.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByIdAndStatus(Long id, Status status);

    List<User> findAllByStatus(Status status);

    Optional<User> findByEmailAndStatus(String email, Status status);

    Optional<User> findByPhoneNumberAndStatus(String phoneNumber, Status status);

    boolean existsByEmailAndStatus(String email, Status status);

    boolean existsByPhoneNumberAndStatus(String phoneNumber, Status status);

}