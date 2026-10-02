package com.prangyajeet.labtrack.issue_return.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prangyajeet.labtrack.issue_return.entity.IssueReturn;

@Repository
public interface IssueReturnRepository
        extends JpaRepository<IssueReturn, Long> {

    boolean existsByIssueNumber(
            String issueNumber
    );


    Optional<IssueReturn> findByIssueNumber(
            String issueNumber
    );
}