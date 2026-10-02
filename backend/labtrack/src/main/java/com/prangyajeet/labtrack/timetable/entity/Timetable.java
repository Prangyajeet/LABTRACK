package com.prangyajeet.labtrack.timetable.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(
    name = "timetables",
    indexes = {
        @Index(
            name = "idx_timetable_day_lab_time",
            columnList = "day, lab, time_from, time_to"
        ),
        @Index(
            name = "idx_timetable_date_lab",
            columnList = "date, lab"
        )
    }
)
public class Timetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Optional because a timetable can be weekly.
     *
     * Example:
     * Monday | 09:00 | 10:00 | Lab-1
     *
     * It does not necessarily belong to one calendar date.
     */
    @Column(
        name = "date"
    )
    private LocalDate date;

    @Column(
        nullable = false,
        length = 20
    )
    private String day;

    @Column(
        name = "time_from",
        nullable = false
    )
    private LocalTime timeFrom;

    @Column(
        name = "time_to",
        nullable = false
    )
    private LocalTime timeTo;

    @Column(
        nullable = false,
        length = 150
    )
    private String faculty;

    @Column(
        nullable = false,
        length = 100
    )
    private String lab;

    @Column(
        nullable = false,
        length = 200
    )
    private String subject;

    @Column(
        name = "class_name",
        length = 150
    )
    private String className;

    @Column(
        nullable = false,
        length = 20
    )
    private String status;

    @Column(
        name = "created_at",
        nullable = false
    )
    private LocalDateTime createdAt;

    @Column(
        name = "updated_at",
        nullable = false
    )
    private LocalDateTime updatedAt;


    public Timetable() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }


    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }


    public LocalTime getTimeFrom() {
        return timeFrom;
    }

    public void setTimeFrom(LocalTime timeFrom) {
        this.timeFrom = timeFrom;
    }


    public LocalTime getTimeTo() {
        return timeTo;
    }

    public void setTimeTo(LocalTime timeTo) {
        this.timeTo = timeTo;
    }


    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }


    public String getLab() {
        return lab;
    }

    public void setLab(String lab) {
        this.lab = lab;
    }


    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }


    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
        LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
        LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }
}