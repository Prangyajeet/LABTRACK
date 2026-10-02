package com.prangyajeet.labtrack.timetable.repository;

import com.prangyajeet.labtrack.timetable.entity.Timetable;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TimetableRepository
        extends JpaRepository<Timetable, Long> {


    List<Timetable>
    findByDateOrderByTimeFromAsc(
        LocalDate date
    );


    List<Timetable>
    findByDateAndLabIgnoreCaseOrderByTimeFromAsc(
        LocalDate date,
        String lab
    );


    List<Timetable>
    findByDayIgnoreCaseOrderByTimeFromAsc(
        String day
    );


    List<Timetable>
    findByDayIgnoreCaseAndLabIgnoreCaseOrderByTimeFromAsc(
        String day,
        String lab
    );


    List<Timetable>
    findByDateOrDayIgnoreCaseOrderByTimeFromAsc(
        LocalDate date,
        String day
    );


    Optional<Timetable>
    findFirstByDateAndDayIgnoreCaseAndTimeFromAndTimeToAndFacultyIgnoreCaseAndLabIgnoreCaseAndSubjectIgnoreCaseAndClassName(
        LocalDate date,
        String day,
        LocalTime timeFrom,
        LocalTime timeTo,
        String faculty,
        String lab,
        String subject,
        String className
    );
}